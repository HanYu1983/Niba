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

// ==================================================================
// Runtime engine (從 GoalSpec 建立 GoalNode 並推進)
//
// 設計重點:
//   - makeNode 在建立 GoalNode 時就遞迴展開 spec 樹, 並把初始 params (例: actorId)
//     淺拷貝到每個 Leaf 的 leafState; composite 節點不存 leafState, 子節點共享同一份 params
//   - runFrame 是同步、單執行緒的單幀推進函式; 不持有任何外部狀態
//   - LeafLifecycle / GoalPlanner 的實際函式由呼叫端注入的 LeafFactory / PlannerFactory
//     依名稱解析; runtime engine 本身對「leaf/planner 怎麼實作」一無所知
// ==================================================================

/**
 * 從 spec 建立對應的 runtime node。
 *
 * params 為「目標的初始參數」, 由呼叫端在 makeNode 時帶入,
 * 例如 {actorId: "m1"} 指定此 goal 是哪個機體在執行;
 * makeNode 會把 params 的所有欄位淺拷貝到該節點 (與所有子節點) 的 leafState,
 * Leaf 的 initialize / validate / tick 之後再讀寫 state 上的其他欄位。
 *
 * 設計:
 *   - actor 不放在 GoalContext 上, 改由 state.actorId 帶 id,
 *     LeafLifecycle 內透過 findMachineById 查表得到實際物件,
 *     順便處理「actor 不存在 / 已陣亡」的情境
 *   - children 在 makeNode 時就遞迴建立並繼承同一份 params,
 *     讓整棵樹共享 actorId 等識別資訊
 */
function makeNode(spec:GoalSpec, ?params:Dynamic):GoalNode {
	return switch (spec) {
		case Leaf(_):
			{
				spec: spec,
				status: Pending,
				children: [],
				activeChildIndex: 0,
				leafState: copyParams(params)
			};
		case Sequence(children) | Selector(children) | Custom(_, children):
			{
				spec: spec,
				status: Pending,
				children: [for (c in children) makeNode(c, params)],
				activeChildIndex: 0,
				leafState: null
			};
	}
}

/** 將 params 的欄位淺拷貝到新的 Dynamic state 上; params 為 null 時回傳空物件 */
private function copyParams(params:Dynamic):Dynamic {
	var state:Dynamic = {};
	if (params != null) {
		for (field in Reflect.fields(params)) {
			Reflect.setField(state, field, Reflect.field(params, field));
		}
	}
	return state;
}

/** status 是否為終止狀態 (Succeeded 或任一 Failed) */
function isFinal(status:GoalStatus):Bool {
	return switch (status) {
		case Succeeded | Failed(_): true;
		default: false;
	}
}

/**
 * 推進一個 frame。
 *
 * 流程:
 *   - Pending  → 初始化 (leaf 跑 initialize; composite 進入 Running)
 *   - Running  → leaf 走 validate-reinit-tick; composite 推進子節點
 *
 * leafFactory / plannerFactory 為工廠方法, runtime 在每次需要呼叫
 * leaf lifecycle / custom planner 時才透過名稱解析出實際函式,
 * 這讓 GoalSpec 保持純資料 / 可序列化 (見上方 GoalSpec / LeafBehavior 註解)。
 */
function runFrame(node:GoalNode, ctx:GoalContext, dt:Float, leafFactory:LeafFactory, plannerFactory:PlannerFactory):Void {
	switch (node.status) {
		case Pending:
			switch (node.spec) {
				case Leaf(beh):
					var lifecycle = leafFactory(beh.name);
					if (lifecycle.initialize(ctx, node.leafState)) {
						node.status = Running;
					} else {
						node.status = Failed(InitFailed);
					}
				case Sequence(_) | Selector(_):
					node.activeChildIndex = 0;
					node.status = Running;
				case Custom(plannerName, children):
					var planner = plannerFactory(plannerName);
					var idx = planner(ctx, children, -1);
					if (idx < 0) {
						node.status = Failed(ChildFailed);
					} else {
						node.activeChildIndex = idx;
						node.status = Running;
					}
			}

		case Running:
			switch (node.spec) {
				case Leaf(beh):
					var lifecycle = leafFactory(beh.name);
					if (!lifecycle.validate(ctx, node.leafState)) {
						if (!lifecycle.initialize(ctx, node.leafState)) {
							node.status = Failed(Invalidated);
							return;
						}
					}
					node.status = lifecycle.tick(ctx, node.leafState, dt);

				case Sequence(_):
					var child = node.children[node.activeChildIndex];
					runFrame(child, ctx, dt, leafFactory, plannerFactory);
					switch (child.status) {
						case Succeeded:
							node.activeChildIndex++;
							if (node.activeChildIndex >= node.children.length) {
								node.status = Succeeded;
							}
						case Failed(_):
							node.status = Failed(ChildFailed);
						default:
					}

				case Selector(_):
					var child = node.children[node.activeChildIndex];
					runFrame(child, ctx, dt, leafFactory, plannerFactory);
					switch (child.status) {
						case Succeeded:
							node.status = Succeeded;
						case Failed(_):
							node.activeChildIndex++;
							if (node.activeChildIndex >= node.children.length) {
								node.status = Failed(ChildFailed);
							}
						default:
					}

				case Custom(plannerName, children):
					var child = node.children[node.activeChildIndex];
					runFrame(child, ctx, dt, leafFactory, plannerFactory);
					switch (child.status) {
						case Succeeded:
							node.status = Succeeded;
						case Failed(_):
							var planner = plannerFactory(plannerName);
							var nextIdx = planner(ctx, children, node.activeChildIndex);
							if (nextIdx < 0) {
								node.status = Failed(ChildFailed);
							} else {
								node.activeChildIndex = nextIdx;
							}
						default:
					}
			}

		case _:
	}
}
