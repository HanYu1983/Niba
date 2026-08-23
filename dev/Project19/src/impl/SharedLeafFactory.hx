package impl;

import domain.Goal.LeafLifecycle;
import impl.MoveToPointGoal.MOVE_TO_POINT_LEAF_NAME;
import impl.MoveToPointGoal.moveToPointLifecycle;

/**
 * 共用 LeafFactory: 依名稱回傳對應的 LeafLifecycle。
 *
 * 設計動機:
 *   - lifecycle 為「無狀態的純函式集合」, 所有 per-instance 參數寫進 leafState
 *     (例: MoveToPointGoal 把 target / arrivalDistance 放到 leafState)
 *   - 一個全域 SharedLeafFactory 統一登記所有 leaf 名稱對應的 lifecycle
 *   - runtime 引擎 (runFrame) 只需要這一個 factory, 不需要每個 goal 各自帶 closure factory
 *
 * 註冊新 leaf:
 *   在下方 switch 加一個 case, 對應到該 goal 模組 export 出的 lifecycle 常數即可。
 *
 * 找不到名稱時直接 throw, 避免靜默忽略設定錯誤; 由上層回報配置缺漏。
 */
function sharedLeafFactory(name:String):LeafLifecycle {
	return switch (name) {
		case MOVE_TO_POINT_LEAF_NAME: moveToPointLifecycle;
		case _: throw 'sharedLeafFactory: unknown leaf "$name"';
	}
}
