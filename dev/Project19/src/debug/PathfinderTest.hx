package debug;

import debug.BasicNeighbors.CELL_STEP;
import debug.BasicNeighbors.basicNeighborProvider;
import domain.FieldObject;
import domain.FieldObject.Marker;
import domain.FieldObject.createEmptyMarker;
import domain.Pathfinding.FieldObjectMatcher;
import domain.Pathfinding.FieldObjectNodeResolver;
import domain.World;
import domain.World.createEmptyWorld;
import domain.WorldNode.WorldNode;
import impl.SimpleAStarPathfinder;

/**
 * SimpleAStarPathfinder 的功能驗證腳本。
 *
 * 用 BasicNeighbors 的 4 連通網格搭配空 World, 測試:
 *   1. findShortestPathTree    - 起點到終點的最短路徑
 *   2. findShortestPathTree    - 起點 = 終點 (邊界)
 *   3. findNearestObjectPathTree - 多 marker 中找最近
 *   4. findNearestObjectPathTree - maxCost 太小, 找不到
 */
class PathfinderTest {
	public static function run():Void {
		trace("=== Pathfinder Test ===");

		var pathfinder = new SimpleAStarPathfinder();

		testShortestPath(pathfinder);
		testShortestPathSamePoint(pathfinder);
		testNearestObject(pathfinder);
		testNearestObjectOutOfRange(pathfinder);
	}

	static function testShortestPath(pathfinder:SimpleAStarPathfinder):Void {
		trace("--- [1] findShortestPathTree: (0,0) -> (300,200) ---");

		var world = createEmptyWorld();
		var start = Cell({x: 0.0, y: 0.0}, Plain);
		var target = Cell({x: 300.0, y: 200.0}, Plain);

		var result = pathfinder.findShortestPathTree(world, basicNeighborProvider, start, target);

		trace('found=${result.found} cost=${result.cost} steps=${result.path.length} expanded=${result.tree.entries.length}');
		printPath(result.path);
	}

	static function testShortestPathSamePoint(pathfinder:SimpleAStarPathfinder):Void {
		trace("--- [2] findShortestPathTree: start == target ---");

		var world = createEmptyWorld();
		var start = Cell({x: 0.0, y: 0.0}, Plain);

		var result = pathfinder.findShortestPathTree(world, basicNeighborProvider, start, start);

		trace('found=${result.found} cost=${result.cost} steps=${result.path.length}');
		printPath(result.path);
	}

	static function testNearestObject(pathfinder:SimpleAStarPathfinder):Void {
		trace("--- [3] findNearestObjectPathTree: 3 markers, maxCost=1000 ---");

		var world = createEmptyWorld();
		world.markers.push(buildMarker("marker_a", "A", 200.0, 100.0));
		world.markers.push(buildMarker("marker_b", "B", -100.0, 100.0));
		world.markers.push(buildMarker("marker_c", "C", 0.0, -500.0));

		var start = Cell({x: 0.0, y: 0.0}, Plain);

		var result = pathfinder.findNearestObjectPathTree(
			world,
			basicNeighborProvider,
			start,
			1000.0,
			markerMatcher,
			snapToCellResolver
		);

		var name = result.found ? result.object.name : "<none>";
		trace('found=${result.found} -> $name cost=${result.cost} steps=${result.path.length} expanded=${result.tree.entries.length}');
		printPath(result.path);
	}

	static function testNearestObjectOutOfRange(pathfinder:SimpleAStarPathfinder):Void {
		trace("--- [4] findNearestObjectPathTree: marker @ (1000, 0), maxCost=300 ---");

		var world = createEmptyWorld();
		world.markers.push(buildMarker("marker_far", "Far", 1000.0, 0.0));

		var start = Cell({x: 0.0, y: 0.0}, Plain);

		var result = pathfinder.findNearestObjectPathTree(
			world,
			basicNeighborProvider,
			start,
			300.0,
			markerMatcher,
			snapToCellResolver
		);

		var name = result.found ? result.object.name : "<none>";
		trace('found=${result.found} -> $name cost=${result.cost} expanded=${result.tree.entries.length}');
	}

	static function buildMarker(id:String, name:String, x:Float, y:Float):Marker {
		var marker = createEmptyMarker();
		marker.id = id;
		marker.name = name;
		marker.position = {x: x, y: y};
		return marker;
	}

	static var markerMatcher:FieldObjectMatcher = (world, object) -> StringTools.startsWith(object.id, "marker_");

	static var snapToCellResolver:FieldObjectNodeResolver = (world, object) -> {
		var sx = Math.round(object.position.x / CELL_STEP) * CELL_STEP;
		var sy = Math.round(object.position.y / CELL_STEP) * CELL_STEP;
		return Cell({x: sx, y: sy}, Plain);
	};

	static function printPath(path:Array<WorldNode>):Void {
		if (path.length == 0) {
			trace("  (empty path)");
			return;
		}
		var buf = new StringBuf();
		buf.add("  ");
		for (i in 0...path.length) {
			if (i > 0)
				buf.add(" -> ");
			switch (path[i]) {
				case Cell(pos, _):
					buf.add('(${pos.x},${pos.y})');
			}
		}
		trace(buf.toString());
	}
}
