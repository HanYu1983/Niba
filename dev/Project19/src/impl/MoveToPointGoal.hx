package impl;

import domain.Geometry.Vec2;
import domain.Goal.GoalFailure;
import domain.Goal.GoalNode;
import domain.Goal.GoalSpec;
import domain.Goal.GoalStatus;
import domain.Goal.LeafLifecycle;
import domain.Goal.makeNode;
import domain.World.findMachineById;

/** 此 goal 在 GoalSpec 中的 leaf 名稱 */
final MOVE_TO_POINT_LEAF_NAME = "MoveToPoint";

/**
 * 「移動到指定點」leaf 的生命週期。
 *
 * 不再透過 closure 捕獲 target / arrivalDistance, 改為從 leafState 讀取:
 *   - actorId          (String): 行動者機體 id
 *   - targetX, targetY (Float):  目標世界座標
 *   - arrivalDistance  (Float):  抵達判定半徑
 *
 * 這樣同一份 lifecycle 可被多個 actor / 多個目標點重用,
 * 並能搭配 SharedLeafFactory 統一註冊在一張表上, 不需要每個 goal 各自帶 factory。
 *
 * 行為:
 *   - tick 每幀計算 actor 到 target 的方向, 並設定 actor.velocity = direction * effectiveSpeed
 *   - 抵達判定: 距離 <= arrivalDistance → velocity 設為 (0,0), 回傳 Succeeded
 *
 * 不變式 (重要):
 *   - 此 goal 只會修改 actor.velocity, 完全不直接寫 actor.position
 *   - 實際位移由 MovementSystem (或其他 movement resolver) 透過 velocity * dt 計算
 *   - 維持「決策 (Goal) ↔ 物理 (MovementSystem)」職責切割乾淨
 *
 * 過衝防護:
 *   若 maxSpeed * dt 將超出剩餘距離, 將 effectiveSpeed 縮到「剛好抵達」的速率,
 *   避免高速 / 大 dt 造成跳過目標點。
 *
 * 失敗條件:
 *   - actor (state.actorId) 不存在: init/validate 失敗 → Failed; tick 期間消失 → Failed(Custom)
 *   - actor.maxSpeed <= 0: init/validate 失敗 (無法移動)
 */
final moveToPointLifecycle:LeafLifecycle = {
	initialize: (ctx, state) -> {
		var actor = findMachineById(ctx.world, state.actorId);
		if (actor == null) {
			trace('  [MoveToPoint] initialize: actor "${state.actorId}" 不存在, 放棄');
			return false;
		}
		if (actor.maxSpeed <= 0.0) {
			trace('  [MoveToPoint] initialize: actor=${actor.name} maxSpeed=${actor.maxSpeed} <= 0, 無法移動');
			return false;
		}
		trace('  [MoveToPoint] initialize: actor=${actor.name} target=(${state.targetX}, ${state.targetY})');
		return true;
	},
	validate: (ctx, state) -> {
		var actor = findMachineById(ctx.world, state.actorId);
		return actor != null && actor.maxSpeed > 0.0;
	},
	tick: (ctx, state, dt) -> {
		var actor = findMachineById(ctx.world, state.actorId);
		if (actor == null)
			return GoalStatus.Failed(GoalFailure.Custom('Actor disappeared: ${state.actorId}'));

		var targetX:Float = state.targetX;
		var targetY:Float = state.targetY;
		var arrivalDistance:Float = state.arrivalDistance;

		var dx = targetX - actor.position.x;
		var dy = targetY - actor.position.y;
		var distSq = dx * dx + dy * dy;

		if (distSq <= arrivalDistance * arrivalDistance) {
			actor.velocity = {x: 0.0, y: 0.0};
			trace('  [MoveToPoint] arrived: actor=${actor.name} target=($targetX, $targetY)');
			return GoalStatus.Succeeded;
		}

		var dist = Math.sqrt(distSq);
		var maxStepDist = actor.maxSpeed * dt;
		var effectiveSpeed = (dt > 0.0 && maxStepDist > dist) ? (dist / dt) : actor.maxSpeed;
		actor.velocity = {
			x: (dx / dist) * effectiveSpeed,
			y: (dy / dist) * effectiveSpeed
		};
		return GoalStatus.Running;
	}
};

/**
 * 建立一個「移動到指定點」的 GoalNode (已完成 makeNode + params 注入)。
 *
 * 與 WalkWaypointsGoal 不同, 本 goal 不需要回傳 spec + factory 配對 —
 * 因為 lifecycle 不依賴 closure, 已註冊在 SharedLeafFactory 上,
 * 故只需把 actorId / target / arrivalDistance 寫到 leafState 即可開始執行。
 *
 * 呼叫端用法:
 *   var node = createMoveToPointGoal(machine.id, {x: 100, y: 200});
 *   runFrame(node, ctx, dt, sharedLeafFactory, plannerFactory);
 *
 * @param actorId          負責執行此目標的機體 id
 * @param target           世界座標目標點
 * @param arrivalDistance  抵達判定半徑 (預設 5 世界單位)
 */
function createMoveToPointGoal(actorId:String, target:Vec2, arrivalDistance:Float = 5.0):GoalNode {
	return makeNode(Leaf({name: MOVE_TO_POINT_LEAF_NAME}), {
		actorId: actorId,
		targetX: target.x,
		targetY: target.y,
		arrivalDistance: arrivalDistance
	});
}
