package domain;

import domain.World;

/**
 * 目標執行狀態
 */
enum GoalStatus {
	/** 尚未啟動 */
	Pending;

	/** tick 執行中 */
	Running;

	/** 完成 */
	Succeeded;

	/** 失敗, 含失敗原因; runtime 會把 Failed 向上傳遞給父節點 */
	Failed(reason:GoalFailure);
}

/**
 * 失敗原因 / 通知上層的訊號
 */
enum GoalFailure {
	/** initialize 失敗 (例: 無合法路徑) */
	InitFailed;

	/** validate 不合法且 reinit 仍失敗 */
	Invalidated;

	/** 外部主動中止 */
	Aborted;

	/** Composite 的子節點失敗導致整體失敗 */
	ChildFailed;

	/** 自訂訊息 */
	Custom(message:String);
}

/**
 * 目標規格 (composite 巢狀結構, immutable 宣告式)
 *
 * 慣例:
 *   - Leaf:     原子目標, 由 LeafBehavior 提供 init / validate / tick 三段生命週期
 *   - Sequence: 順序執行所有子目標, 任一失敗則整體 Failed(ChildFailed)
 *   - Selector: 嘗試子目標直到一個成功; 全部失敗才整體 Failed(ChildFailed)
 *               (你說的 fallback / 上層重新規劃即由此形成)
 *   - Custom:   由 GoalPlanner 任意算法決定下一個子目標 (例: GOAP / A*)
 *
 * 注意:
 *   - 暫不提供 Parallel, 待真正需要再擴充本 enum
 *   - GoalSpec 是宣告式樹狀資料, 執行時態由同構的 GoalNode 追蹤
 */
enum GoalSpec {
	Leaf(behavior:LeafBehavior);
	Sequence(children:Array<GoalSpec>);
	Selector(children:Array<GoalSpec>);
	Custom(planner:GoalPlanner, children:Array<GoalSpec>);
}

/**
 * Leaf 目標的生命週期契約
 *
 * 執行循環 (由 runtime 引擎負責):
 *   1. 進入 Running 前: 呼叫 initialize
 *      - true  → 進入 Running
 *      - false → 整體 Failed(InitFailed) → 通知上層重新規劃
 *
 *   2. Running 每 frame:
 *      a. 呼叫 validate
 *         - true  → 進入步驟 b
 *         - false → 重新呼叫 initialize (re-init)
 *                   - true  → 回到步驟 b
 *                   - false → Failed(Invalidated)
 *      b. 呼叫 tick(dt) → 結果即此 frame 的新 GoalStatus
 *
 * 關於 state:
 *   - 由 runtime 為每個 leaf 節點維護一個 Dynamic 容器, 透過參數傳入
 *   - initialize 可自行決定要重設或保留 state 中的欄位 (runtime 不會自動清空)
 *   - 暫以 Dynamic 簡化; 若日後想要強型別可換 generic 或 typedef 結構繼承
 */
typedef LeafBehavior = {
	var name:String;
	var initialize:(ctx:GoalContext, state:Dynamic) -> Bool;
	var validate:(ctx:GoalContext, state:Dynamic) -> Bool;
	var tick:(ctx:GoalContext, state:Dynamic, dt:Float) -> GoalStatus;
}

/**
 * Custom composite 的 planner
 *
 * 由 runtime 引擎於以下時機呼叫:
 *   - 首次進入: lastIndex = -1
 *   - 上一個子目標失敗: lastIndex = 失敗的 index
 *
 * 回傳:
 *   - 0 ~ children.length-1: 下一個要執行的子目標 index
 *   - -1: 無解 → 整體 Failed(ChildFailed)
 */
typedef GoalPlanner = (ctx:GoalContext, children:Array<GoalSpec>, lastIndex:Int) -> Int;

/**
 * 目標執行的上下文
 *
 * - actor: 執行此目標的主體 (機體)
 * - world: 戰場世界狀態 (機體 / 武器 / 發射物 / 碰撞箱列表)
 */
typedef GoalContext = {
	var actor:Machine;
	var world:World;
}

/**
 * 目標執行時節點 (與 GoalSpec 同構)
 *
 * runtime 引擎為每個 GoalSpec 子節點建立對應的 GoalNode 子節點, 用以追蹤執行狀態:
 *   - status:           當前生命週期狀態
 *   - children:         與 spec 的 children 對應的子節點 (composite 用)
 *   - activeChildIndex: 目前正在跑的子節點 index (Sequence / Selector / Custom 用)
 *   - leafState:        Leaf 用的 Dynamic 狀態容器, 由 LeafBehavior 自管欄位
 */
typedef GoalNode = {
	var spec:GoalSpec;
	var status:GoalStatus;
	var children:Array<GoalNode>;
	var activeChildIndex:Int;
	var ?leafState:Dynamic;
}
