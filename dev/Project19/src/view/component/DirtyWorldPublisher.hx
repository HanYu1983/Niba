package view.component;

import domain.World;
import view.EventCenter;
import view.EventCenter.Event;

/**
 * 在每幀 P5Tick 收尾時批次把「本幀被弄髒的 world」推給 worldSubject 的 view 元件。
 *
 * 不變式 (對應 domain.World.isDirty doc):
 *   - System (impl/*) 只在「對 world 的陣列 push / splice」時翻 isDirty;
 *     單純修改既有元素 (machine.position / projectile.age 等) 不翻 — 那些變化
 *     透過 RenderWorld 的 shallow .copy() 共用 reference 自動反映到後續幀
 *   - View 元件 (view/component/*) 在影響 render snapshot 但不屬陣列增刪的修改
 *     (例: world.cameraPos.*, 會被算進 viewMatrix 快取) 仍應翻 isDirty
 *   - 本元件是唯一在常駐迴圈中呼叫 eventCenter.nextWorld 的元件;
 *     其他地方只翻 flag, 不直接 emit
 *   - 每個 P5Tick 結束時, 若 isDirty 為 true:
 *       1. 先 eventCenter.nextWorld(world) (此時 isDirty 仍為 true, 訂閱者通常不會讀此欄位)
 *       2. 再把 world.isDirty 設為 false, 結束本幀的髒狀態
 *     若為 false: 整幀無任何 render emit (但 SceneRenderer 仍會收到 P5Tick 帶上一個
 *     最新 RenderWorld snapshot 重繪 — 因為元素 reference 共用, 屬性變化會顯現)
 *
 * 訂閱位置:
 *   建議在 HelloWorld 把所有 system 訂閱 (dispatchEventToSystems) 完成「之後」再呼叫
 *   createDirtyWorldPublisher; Observable.subscribe 內部保留 FIFO 訂閱順序,
 *   能保證本元件的 callback 在「同一個 P5Tick 事件」中於所有 system 之後執行,
 *   也就是 system 已經完成本幀 mutation 與翻 isDirty 之後才檢查 flag。
 *
 * 直接持有 world 參考的理由:
 *   - 從 BehaviorSubject<World>.getValue() 取值在初始化階段會拿到 createEmptyWorld()
 *     的初始 world (與 HelloWorld 實際持有的 world 不是同一個物件), 必須等到
 *     第一次 nextWorld 之後 BehaviorSubject 的 current 才會切到正確的參考。
 *   - 直接從外部注入 world reference 可避免這個 bootstrap window, 也避免和
 *     worldSubject.switchMap pattern 串在一起增加心智負擔。
 */
function createDirtyWorldPublisher(eventCenter:EventCenter, world:World):Void {
	eventCenter.eventSubject.subscribe(event -> handleEvent(eventCenter, world, event));
}

private function handleEvent(eventCenter:EventCenter, world:World, event:Event):Void {
	switch (event) {
		case P5Tick(_, _):
			if (!world.isDirty)
				return;

			// 順序刻意先 emit 後 reset:
			//   subscribers 讀的是 world (參考相同), 在 emit 期間若有人讀 world.isDirty
			//   會看到 true; emit 同步回來後我們再把 flag 翻回 false。
			//   即使 emit 期間有人再去翻 isDirty=true (例如下游同步觸發了另一個 mutation),
			//   本行重置仍會把它蓋掉; 預期不會發生這種同步迴圈, 若日後需要再考慮重排序。
			eventCenter.nextWorld(world);
			world.isDirty = false;
		default:
	}
}
