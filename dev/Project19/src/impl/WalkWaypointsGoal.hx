package impl;

import domain.FieldObject.Marker;
import domain.Goal.GoalFailure;
import domain.Goal.GoalSpec;
import domain.Goal.GoalStatus;
import domain.Machine;
import domain.Pathfinding.IPathfinder;
import domain.World.NeighborProvider;
import domain.WorldNode.WorldNode;

/**
 * 建立「依序行走 waypoint marker」的 GoalSpec。
 *
 * 建立 goal 時代入 marker list; leaf 會依序將 actor 移動到每個 marker 的格子。
 * 實際尋路演算法與鄰居成本由呼叫方注入, 因此可搭配 debug 基本網格或正式地圖實作。
 */
function createWalkWaypointsGoal(
	markers:Array<Marker>,
	pathfinder:IPathfinder,
	neighbors:NeighborProvider,
	cellStep:Float = 100.0
):GoalSpec {
	return Leaf({
		name: "WalkWaypoints",
		initialize: (ctx, state) -> {
			if (state.markerIndex == null)
				state.markerIndex = 0;

			if (state.markerIndex >= markers.length) {
				state.path = [];
				state.pathIndex = 0;
				return true;
			}

			var start = nodeFromPosition(ctx.actor.position.x, ctx.actor.position.y, cellStep);
			var target = nodeFromPosition(markers[state.markerIndex].position.x, markers[state.markerIndex].position.y, cellStep);
			var result = pathfinder.findShortestPathTree(ctx.world, neighbors, start, target);

			if (!result.found)
				return false;

			state.path = result.path;
			state.pathIndex = result.path.length > 1 ? 1 : 0;
			trace('  [WalkWaypoints] initialize: marker=${markers[state.markerIndex].name} cost=${result.cost} steps=${result.path.length}');
			return true;
		},
		validate: (ctx, state) -> {
			if (state.markerIndex == null)
				return false;
			if (state.markerIndex >= markers.length)
				return true;
			if (state.path == null || state.path.length == 0)
				return false;
			return true;
		},
		tick: (ctx, state, dt) -> {
			if (state.markerIndex >= markers.length)
				return GoalStatus.Succeeded;

			var path:Array<WorldNode> = state.path;
			var pathIndex:Int = state.pathIndex;

			if (pathIndex < path.length) {
				moveActorToNode(ctx.actor, path[pathIndex]);
				trace('  [WalkWaypoints] move: marker=${markers[state.markerIndex].name} node=${nodeLabel(path[pathIndex])}');
				state.pathIndex = pathIndex + 1;
				return GoalStatus.Running;
			}

			trace('  [WalkWaypoints] arrived: ${markers[state.markerIndex].name}');
			state.markerIndex++;

			if (state.markerIndex >= markers.length)
				return GoalStatus.Succeeded;

			var start = nodeFromPosition(ctx.actor.position.x, ctx.actor.position.y, cellStep);
			var target = nodeFromPosition(markers[state.markerIndex].position.x, markers[state.markerIndex].position.y, cellStep);
			var result = pathfinder.findShortestPathTree(ctx.world, neighbors, start, target);

			if (!result.found)
				return GoalStatus.Failed(GoalFailure.Custom('Waypoint unreachable: ${markers[state.markerIndex].name}'));

			state.path = result.path;
			state.pathIndex = result.path.length > 1 ? 1 : 0;
			trace('  [WalkWaypoints] next: marker=${markers[state.markerIndex].name} cost=${result.cost} steps=${result.path.length}');
			return GoalStatus.Running;
		}
	});
}

private function nodeFromPosition(x:Float, y:Float, cellStep:Float):WorldNode {
	return Cell({
		x: Math.round(x / cellStep) * cellStep,
		y: Math.round(y / cellStep) * cellStep
	}, Plain);
}

private function moveActorToNode(actor:Machine, node:WorldNode):Void {
	switch (node) {
		case Cell(pos, _):
			actor.position = {x: pos.x, y: pos.y};
	}
}

private function nodeLabel(node:WorldNode):String {
	return switch (node) {
		case Cell(pos, _): '(${pos.x},${pos.y})';
	}
}
