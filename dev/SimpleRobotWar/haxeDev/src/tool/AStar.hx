package tool;

import haxe.Exception;
import haxe.ds.List;
import haxe.ds.ListSort;
import haxe.ds.StringMap;
import haxe.ds.BalancedTree;
import haxe.ds.ObjectMap;

using StringTools;

interface ISolution {
	function getId():Dynamic;
	function getParentId():Null<Dynamic>;
	function getSortKey():String;
	function isGoal():Bool;
}

function getAStar(getNextSolution:ISolution->Array<ISolution>, isContinueWhenFind:Bool, s:ISolution):ObjectMap<Dynamic, ISolution> {
	final close = new ObjectMap<Dynamic, ISolution>();
	final open = new BalancedTree<String, ISolution>();
	final openMapping = new ObjectMap<Dynamic, ISolution>();
	open.set(s.getSortKey(), s);
	openMapping.set(s.getId(), s);
	var i = 0;
	while (true) {
		if (++i > 20000) {
			trace("loop done");
			break;
		}
		var hasProcess = false;
		for (top in open.iterator()) {
			// trace(i, top.getId());
			open.remove(top.getSortKey());
			openMapping.remove(top.getId());
			close.set(top.getId(), top);
			if (isContinueWhenFind == false) {
				if (top.isGoal()) {
					trace("Goal!");
					break;
				}
			}
			final nextNodes = getNextSolution(top);
			for (nextNode in nextNodes) {
				if (close.exists(nextNode.getId())) {
					// trace("ignore", nextNode.getId());
					continue;
				}
				final origin = openMapping.get(nextNode.getId());
				if (origin == null) {
					open.set(nextNode.getSortKey(), nextNode);
					openMapping.set(nextNode.getId(), nextNode);
				} else {
					if (nextNode.getSortKey() < origin.getSortKey()) {
						open.remove(origin.getSortKey());
						open.set(nextNode.getSortKey(), nextNode);
						openMapping.set(nextNode.getId(), nextNode);
					}
				}
			}
			hasProcess = true;
			break;
		}
		if (hasProcess == false) {
			trace("hasProcess == false");
			break;
		}
	}
	trace(i);
	return close;
}

function getPath(tree:ObjectMap<Dynamic, ISolution>, goal:Dynamic):Array<Dynamic> {
	final ret:Array<Dynamic> = [goal];
	var curr:Null<ISolution> = tree.get(goal);
	if (curr == null) {
		throw new Exception("goal not found");
	}
	while (true) {
		final parentId = curr.getParentId();
		if (parentId == null) {
			break;
		}
		curr = tree.get(parentId);
		if (curr == null) {
			throw new Exception("goal not found");
		}
		ret.push(curr.getId());
	}
	ret.reverse();
	return ret;
}

class AStarSolution implements ISolution {
	public final id:Dynamic;
	public final parentId:Null<Dynamic>;
	public final cost:Int;
	public final estimate:Int;
	public final _isGoal:Bool;

	final key:String;

	public function new(id:Dynamic, parentId:Null<Dynamic>, cost:Int, estimate:Int, isGoal:Bool) {
		this.id = id;
		this.parentId = parentId;
		this.cost = cost;
		this.estimate = estimate;
		this._isGoal = isGoal;
		key = '${cost + estimate}'.lpad("0", 20) + "_" + id;
	}

	public function getId():Dynamic {
		return id;
	}

	public function getParentId():Null<Dynamic> {
		return parentId;
	}

	public function getSortKey():String {
		return key;
	}

	public function isGoal():Bool {
		return _isGoal;
	}
}

function test() {
	final tmp = new StringMap<Array<Int>>();
	// ObjectMap的key是認物件地址
	final getPosition:(Int, Int) -> Array<Int> = (x, y) -> {
		final key = '${x}_${y}';
		if (tmp.exists(key)) {
			final ret = tmp.get(key);
			if (ret == null) {
				throw new Exception("must not null");
			}
			return ret;
		}
		final ret:Array<Int> = [x, y];
		tmp.set(key, ret);
		return ret;
	};
	final firstNode = new AStarSolution(getPosition(0, 0), null, 0, 9999999, false);
	final tree = getAStar(node -> {
		// if (tmp.cost >= 100) {
		// 	return [];
		// }
		return switch node.getId() {
			case [x, y]:
				final fixDot = 10.0;
				final tmp = cast(node, AStarSolution);
				[
					for (next in [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
						switch next {
							case [ox, oy]:
								final nx = x + ox;
								final ny = y + oy;
								// 本身COST只是拿來和其和COST比較, 這個值要盡量小, 有比較的意義就可以了
								// 不然, ASTAR要多找指數上升的NODE
								final cost = Std.int(((tmp.cost / fixDot) + 0.1) * fixDot);
								final ex = 1000;
								final ey = 1000;
								// 這個值要比COST的比重還大, 因為最短徑看的就是離終點的距離
								final estimate = Std.int(Math.sqrt(Math.pow(ex - nx, 2) + Math.pow(ey - ny, 2)) * fixDot);
								final isGoal = nx == ex && ny == ey;
								new AStarSolution(getPosition(nx, ny), tmp.getId(), cost, estimate, isGoal);
							case _:
								throw new Exception("next not found");
						}
					}
				];
			case _:
				throw new Exception("payload not found");
		}
	}, false, firstNode);
	// trace(tree);
	// final path = getPath(tree, getPosition(100, 100));
	// trace(path.length);
}
