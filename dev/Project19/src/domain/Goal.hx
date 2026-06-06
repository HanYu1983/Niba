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
 *   - Leaf:     原子目標, LeafBehavior 只持有「名稱」, 真正的 init / validate / tick
 *               函式由 runtime 透過 LeafFactory 依名稱建立 (見下方 LeafBehavior / LeafFactory)
 *   - Sequence: 順序執行所有子目標, 任一失敗則整體 Failed(ChildFailed)
 *   - Selector: 嘗試子目標直到一個成功; 全部失敗才整體 Failed(ChildFailed)
 *               (你說的 fallback / 上層重新規劃即由此形成)
 *   - Custom:   由名稱對應的 GoalPlanner 任意算法決定下一個子目標 (例: GOAP / A*)
 *               planner 字串由 runtime 透過 PlannerFactory 解析為實際函式
 *
 * 注意:
 *   - 暫不提供 Parallel, 待真正需要再擴充本 enum
 *   - GoalSpec 是純宣告式 / 可序列化的資料 (不含函式參考),
 *     真正執行邏輯由 runtime 注入的工廠方法在執行時態解析
 *   - GoalSpec 執行時態由同構的 GoalNode 追蹤
 */
enum GoalSpec {
	Leaf(behavior:LeafBehavior);
	Sequence(children:Array<GoalSpec>);
	Selector(children:Array<GoalSpec>);
	Custom(planner:String, children:Array<GoalSpec>);
}

/**
 * Leaf 目標的識別資料
 *
 * 只保留 name 作為「叫什麼名字的 leaf」; 真正的 init / validate / tick 函式
 * 由實作端提供的 LeafFactory 依此名稱建立 (見 LeafFactory / LeafLifecycle)。
 *
 * 設計動機:
 *   - GoalSpec 維持純資料 / 可序列化 (函式無法序列化)
 *   - 同一個 leaf 名稱可在不同情境注入不同實作
 *     (debug 用 mock, 戰鬥用真實邏輯)
 */
typedef LeafBehavior = {
	var name:String;
}

/**
 * Leaf 目標的生命週期函式集合
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
typedef LeafLifecycle = {
	var initialize:(ctx:GoalContext, state:Dynamic) -> Bool;
	var validate:(ctx:GoalContext, state:Dynamic) -> Bool;
	var tick:(ctx:GoalContext, state:Dynamic, dt:Float) -> GoalStatus;
}

/**
 * 由 leaf 名稱建立 LeafLifecycle 的工廠
 *
 * runtime 引擎在處理 Leaf 節點時, 會以 LeafBehavior.name 呼叫此工廠取得實際函式。
 * 找不到對應名稱時建議直接 throw, 由上層回報設定錯誤。
 */
typedef LeafFactory = (name:String) -> LeafLifecycle;

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
 * 由 planner 名稱建立 GoalPlanner 的工廠
 *
 * runtime 引擎在處理 Custom 節點時, 會以 GoalSpec.Custom 攜帶的字串呼叫此工廠取得實際函式。
 * 與 LeafFactory 同理: GoalSpec 維持純資料, 規劃函式由實作端注入。
 */
typedef PlannerFactory = (name:String) -> GoalPlanner;

/**
 * 目標執行的上下文
 *
 * 只持有「全局共享」的戰場狀態, 不放入每個目標自身的參數。
 *   - world: 戰場世界狀態 (機體 / 武器 / 發射物 / 碰撞箱列表)
 *
 * 設計動機:
 *   過去把 actor 放在 ctx 上, 等同把「目標的參數」與「戰場狀態」混在同一個物件,
 *   一個 ctx 只能服務一個 actor 的目標。
 *
 *   現在改為:
 *     - 每個目標的參數 (例如 actorId, targetId, 武器 id 等) 在 makeNode 時帶入,
 *       並由 makeNode 寫入該節點的 leafState
 *     - LeafLifecycle 從 state 取出 id, 再依 ctx.world 查表取得實際物件
 *   好處:
 *     - LeafLifecycle 自然會處理「actor 不存在 / 已陣亡 / 被移除」的情況
 *     - 同一個 LeafLifecycle 可服務不同 actor (純函式行為, 透過 state.actorId 識別)
 *     - GoalContext 維持簡單, 不需依目標數量增加欄位
 */
typedef GoalContext = {
	var world:World;
}

/**
 * 目標執行時節點 (與 GoalSpec 同構)
 *
 * runtime 引擎為每個 GoalSpec 子節點建立對應的 GoalNode 子節點, 用以追蹤執行狀態:
 *   - status:           當前生命週期狀態
 *   - children:         與 spec 的 children 對應的子節點 (composite 用),
 *                       由 makeNode 在建構時遞迴建立
 *   - activeChildIndex: 目前正在跑的子節點 index (Sequence / Selector / Custom 用)
 *   - leafState:        Leaf 用的 Dynamic 狀態容器
 *                       由 makeNode 將初始 params (例: actorId) 寫入,
 *                       lifecycle 的 initialize / validate / tick 可再讀寫
 */
typedef GoalNode = {
	var spec:GoalSpec;
	var status:GoalStatus;
	var children:Array<GoalNode>;
	var activeChildIndex:Int;
	var ?leafState:Dynamic;
}
