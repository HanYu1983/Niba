package debug;

import debug.BasicNeighbors.basicNeighborProvider;
import domain.FieldObject.Marker;
import domain.FieldObject.createEmptyMarker;
import domain.Goal.GoalContext;
import domain.Machine;
import domain.Machine.createEmptyMachine;
import domain.World;
import domain.World.createEmptyWorld;
import impl.SimpleAStarPathfinder;
import impl.WalkWaypointsGoal.createWalkWaypointsGoal;
import sample.GoalDemo;

/**
 * 用 marker list 建立「行走 waypoint」goal 的測試。
 */
class WaypointGoalTest {
	public static function run():Void {
		trace("=== Waypoint Goal Test ===");

		var actor = buildActor();
		var markers = [
			buildMarker("wp_1", "Waypoint A", 200.0, 0.0),
			buildMarker("wp_2", "Waypoint B", 200.0, 200.0),
			buildMarker("wp_3", "Waypoint C", -100.0, 200.0)
		];

		var world = createWorld(actor, markers);
		var built = createWalkWaypointsGoal(markers, new SimpleAStarPathfinder(), basicNeighborProvider);
		var node = GoalDemo.makeNode(built.spec);
		var ctx:GoalContext = {actor: actor, world: world};

		for (frame in 0...30) {
			trace('--- waypoint frame ${frame + 1} ---');
			GoalDemo.runFrame(node, ctx, 0.1, built.factory, GoalDemo.plannerFactory);
			trace('  actor=(${actor.position.x}, ${actor.position.y}) status=${node.status}');
			if (GoalDemo.isFinal(node.status))
				break;
		}

		trace('WAYPOINT FINAL: ${node.status}');
	}

	static function createWorld(actor:Machine, markers:Array<Marker>):World {
		var world = createEmptyWorld();
		world.machines.push(actor);
		for (marker in markers)
			world.markers.push(marker);
		return world;
	}

	static function buildActor():Machine {
		var actor = createEmptyMachine();
		actor.id = "waypoint_actor";
		actor.name = "Waypoint Actor";
		actor.maxHp = 100.0;
		actor.maxEnergy = 100.0;
		actor.energyRegen = 1.0;
		return actor;
	}

	static function buildMarker(id:String, name:String, x:Float, y:Float):Marker {
		var marker = createEmptyMarker();
		marker.id = id;
		marker.name = name;
		marker.position = {x: x, y: y};
		return marker;
	}
}
