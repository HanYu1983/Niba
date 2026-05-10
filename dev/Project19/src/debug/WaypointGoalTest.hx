package debug;

import debug.BasicNeighbors.basicNeighborProvider;
import domain.Damage.DamageType;
import domain.FieldObject.Marker;
import domain.Goal.GoalContext;
import domain.Machine;
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

		var actor = makeActor();
		var markers = [
			makeMarker("wp_1", "Waypoint A", 200.0, 0.0),
			makeMarker("wp_2", "Waypoint B", 200.0, 200.0),
			makeMarker("wp_3", "Waypoint C", -100.0, 200.0)
		];

		var world = createWorld(actor, markers);
		var goal = createWalkWaypointsGoal(markers, new SimpleAStarPathfinder(), basicNeighborProvider);
		var node = GoalDemo.makeNode(goal);
		var ctx:GoalContext = {actor: actor, world: world};

		for (frame in 0...30) {
			trace('--- waypoint frame ${frame + 1} ---');
			GoalDemo.runFrame(node, ctx, 0.1);
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

	static function makeActor():Machine {
		return {
			id: "waypoint_actor",
			name: "Waypoint Actor",
			position: {x: 0.0, y: 0.0},
			facing: 0.0,
			maxHp: 100.0,
			maxEnergy: 100.0,
			energyRegen: 1.0,
			defense: {weights: new Map<DamageType, Float>()},
			weapons: [],
			skills: []
		};
	}

	static function makeMarker(id:String, name:String, x:Float, y:Float):Marker {
		return {
			id: id,
			name: name,
			position: {x: x, y: y},
			facing: 0.0
		};
	}
}
