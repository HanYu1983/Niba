package impl;

import domain.FieldObject;
import domain.Pathfinding.FieldObjectMatcher;
import domain.Pathfinding.FieldObjectNodeResolver;
import domain.Pathfinding.FieldObjectPathResult;
import domain.Pathfinding.IPathfinder;
import domain.Pathfinding.PathResult;
import domain.Pathfinding.ShortestPathTree;
import domain.Pathfinding.ShortestPathTreeEntry;
import domain.World;
import domain.World.NeighborProvider;
import domain.World.WorldQuery;
import domain.WorldNode.WorldNode;

private typedef SearchRecord = {
	var node:WorldNode;
	var key:String;
	var costFromStart:Float;
	var estimatedTotalCost:Float;
	var ?previousKey:String;
}

/**
 * 簡單 A* / Dijkstra pathfinder 實作。
 *
 * 特性:
 *   - `findShortestPathTree` 使用 A*，heuristic 目前只支援 Cell 座標距離。
 *   - `findNearestObjectPathTree` 使用 Dijkstra 形式展開 maxCost 範圍，因為目標集合需掃 world 取得。
 *   - 使用 `nodeKey` 字串索引節點，避免 enum 參數物件在 Map key 上的跨 target 差異。
 *
 * 注意:
 *   這是簡單實作，open set 用線性掃描取最低 f-cost；
 *   未來資料量變大時可替換成 binary heap / priority queue。
 */
class SimpleAStarPathfinder implements IPathfinder {
	public function new() {}

	public function findShortestPathTree(
		world:World,
		neighbors:NeighborProvider,
		start:WorldNode,
		target:WorldNode
	):PathResult {
		var targetKey = nodeKey(target);
		var records = search(world, neighbors, start, target, Math.POSITIVE_INFINITY);
		var tree = buildTree(start, target, null, records.records);
		var found = records.records.exists(targetKey);
		var cost = found ? records.records.get(targetKey).costFromStart : Math.POSITIVE_INFINITY;

		return {
			found: found,
			path: found ? reconstructPath(records.records, start, targetKey) : [],
			cost: cost,
			tree: tree
		};
	}

	public function findNearestObjectPathTree(
		world:World,
		neighbors:NeighborProvider,
		start:WorldNode,
		maxCost:Float,
		matcher:FieldObjectMatcher,
		resolveObjectNode:FieldObjectNodeResolver
	):FieldObjectPathResult {
		var records = search(world, neighbors, start, null, maxCost);
		var bestObject:Null<FieldObject> = null;
		var bestNode:Null<WorldNode> = null;
		var bestNodeKey:Null<String> = null;
		var bestCost = Math.POSITIVE_INFINITY;

		for (object in WorldQuery.getFieldObjects(world)) {
			if (!matcher(world, object))
				continue;

			var objectNode = resolveObjectNode(world, object);
			if (objectNode == null)
				continue;

			var objectNodeKey = nodeKey(objectNode);
			if (!records.records.exists(objectNodeKey))
				continue;

			var objectCost = records.records.get(objectNodeKey).costFromStart;
			if (objectCost <= maxCost && objectCost < bestCost) {
				bestObject = object;
				bestNode = objectNode;
				bestNodeKey = objectNodeKey;
				bestCost = objectCost;
			}
		}

		var tree = buildTree(start, bestNode, maxCost, records.records);
		var found = bestObject != null && bestNode != null && bestNodeKey != null;

		return {
			found: found,
			object: bestObject,
			objectNode: bestNode,
			path: found ? reconstructPath(records.records, start, bestNodeKey) : [],
			cost: found ? bestCost : Math.POSITIVE_INFINITY,
			tree: tree
		};
	}

	private static function search(
		world:World,
		neighbors:NeighborProvider,
		start:WorldNode,
		target:Null<WorldNode>,
		maxCost:Float
	):{records:Map<String, SearchRecord>} {
		var targetKey = target == null ? null : nodeKey(target);
		var open:Array<String> = [];
		var closed = new Map<String, Bool>();
		var records = new Map<String, SearchRecord>();

		var startKey = nodeKey(start);
		records.set(startKey, {
			node: start,
			key: startKey,
			costFromStart: 0.0,
			estimatedTotalCost: target == null ? 0.0 : heuristic(start, target)
		});
		open.push(startKey);

		while (open.length > 0) {
			var currentKey = popLowestCost(open, records);
			var current = records.get(currentKey);

			if (current.costFromStart > maxCost)
				continue;

			if (targetKey != null && currentKey == targetKey)
				break;

			closed.set(currentKey, true);

			for (edge in neighbors(world, current.node)) {
				if (!Math.isFinite(edge.cost) || edge.cost < 0)
					continue;

				var nextCost = current.costFromStart + edge.cost;
				if (nextCost > maxCost)
					continue;

				var nextKey = nodeKey(edge.node);
				if (closed.exists(nextKey))
					continue;

				var existing = records.get(nextKey);
				if (existing == null || nextCost < existing.costFromStart) {
					records.set(nextKey, {
						node: edge.node,
						key: nextKey,
						costFromStart: nextCost,
						estimatedTotalCost: nextCost + (target == null ? 0.0 : heuristic(edge.node, target)),
						previousKey: currentKey
					});

					if (open.indexOf(nextKey) < 0)
						open.push(nextKey);
				}
			}
		}

		return {records: records};
	}

	private static function buildTree(
		start:WorldNode,
		target:Null<WorldNode>,
		costLimit:Null<Float>,
		records:Map<String, SearchRecord>
	):ShortestPathTree {
		var entries:Array<ShortestPathTreeEntry> = [];

		for (record in records) {
			var entry:ShortestPathTreeEntry = {
				node: record.node,
				costFromStart: record.costFromStart
			};

			if (record.previousKey != null)
				entry.previous = records.get(record.previousKey).node;

			entries.push(entry);
		}

		return {
			start: start,
			target: target,
			entries: entries,
			treeCostLimit: costLimit
		};
	}

	private static function reconstructPath(
		records:Map<String, SearchRecord>,
		start:WorldNode,
		targetKey:String
	):Array<WorldNode> {
		var path:Array<WorldNode> = [];
		var currentKey:Null<String> = targetKey;
		var startKey = nodeKey(start);

		while (currentKey != null) {
			var record = records.get(currentKey);
			if (record == null)
				return [];

			path.unshift(record.node);

			if (currentKey == startKey)
				break;

			currentKey = record.previousKey;
		}

		return path.length > 0 && nodeKey(path[0]) == startKey ? path : [];
	}

	private static function popLowestCost(open:Array<String>, records:Map<String, SearchRecord>):String {
		var bestIndex = 0;
		var bestCost = records.get(open[0]).estimatedTotalCost;

		for (i in 1...open.length) {
			var cost = records.get(open[i]).estimatedTotalCost;
			if (cost < bestCost) {
				bestIndex = i;
				bestCost = cost;
			}
		}

		return open.splice(bestIndex, 1)[0];
	}

	private static function heuristic(a:WorldNode, b:WorldNode):Float {
		return switch [a, b] {
			case [Cell(pa, _), Cell(pb, _)]:
				var dx = pa.x - pb.x;
				var dy = pa.y - pb.y;
				Math.sqrt(dx * dx + dy * dy);
		}
	}

	private static function nodeKey(node:WorldNode):String {
		return switch (node) {
			case Cell(pos, terrain):
				'cell:${pos.x},${pos.y}:${terrain}';
		}
	}
}
