package impl;

import domain.Geometry.Vec2;
import domain.Goal.GoalSpec;
import impl.MoveToPointGoal.createMoveToPointGoal;
import domain.Goal.GoalNode;

/**
 * 建立一個「依序移動到多個指定點」的 Sequence GoalNode。
 *
 * 結構:
 *   GoalSpec = Sequence([
 *     Leaf("MoveToPoint"),  // → point[0]
 *     Leaf("MoveToPoint"),  // → point[1]
 *     ...
 *   ])
 *
 * 實作方式:
 *   不直接用 domain.Goal.makeNode 一口氣建整棵樹, 因為 makeNode 的 params 會被
 *   「同一份」淺拷貝到所有 Leaf 的 leafState, 無法讓各個子節點帶不同的 targetX/Y。
 *
 *   改為:
 *     1. 對每個 point 呼叫 createMoveToPointGoal 產生獨立的 leaf GoalNode
 *        (各自帶自己的 targetX / targetY / arrivalDistance, 共享 actorId)
 *     2. 蒐集這些 leaf 的 spec 組成 Sequence GoalSpec
 *     3. 手動組一個 Sequence GoalNode, children 直接掛上述 leaf GoalNode
 *
 * 行為:
 *   - 由 domain.Goal.runFrame 的 Sequence 規則推進: 子節點全部 Succeeded 才整體 Succeeded;
 *     任一子節點 Failed 立即 Failed(ChildFailed)
 *   - 子節點沿用 MoveToPointGoal 的契約 — 只修改 actor.velocity, 不寫 position
 *
 * 不變式:
 *   - 不註冊新 leaf name; 整個 goal 由現有的 "MoveToPoint" leaf 組合而成,
 *     SharedLeafFactory 不需改動
 *   - GoalNode.spec 與 GoalNode.children 結構保持同構 (Sequence 的 spec.children
 *     與 node.children 長度 / 順序對齊), 滿足 runFrame 對 Sequence 的假設
 *
 * 邊界:
 *   - points 為空: throw, 因為空 Sequence 在 runFrame 推進時會嘗試存取 children[0]
 *     而崩潰; 與其讓 runtime 失敗, 不如在建構期就明確報錯
 *
 * @param actorId          負責執行此目標的機體 id (整棵 Sequence 共用同一個 actor)
 * @param points           依序要抵達的目標點列表 (世界座標)
 * @param arrivalDistance  每個點共用的抵達判定半徑 (預設 5 世界單位)
 */
function createMoveToPointsGoal(actorId:String, points:Array<Vec2>, arrivalDistance:Float = 5.0):GoalNode {
	if (points.length == 0)
		throw 'createMoveToPointsGoal: points 不能為空, 至少需要一個目標點';

	var children = [for (p in points) createMoveToPointGoal(actorId, p, arrivalDistance)];
	var childSpecs:Array<GoalSpec> = [for (c in children) c.spec];

	return {
		spec: Sequence(childSpecs),
		status: Pending,
		children: children,
		activeChildIndex: 0,
		leafState: null
	};
}
