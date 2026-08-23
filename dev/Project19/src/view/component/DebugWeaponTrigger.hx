package view.component;

import domain.Weapon.WeaponOnMachine;
import domain.World;
import view.EventCenter;
import view.EventCenter.Event;

/** 'F' 鍵的 p5 keyCode — 按下視為「扣下扳機」, 釋放視為「鬆開」 */
private inline final F_KEY_CODE = 70;

/**
 * 偵錯用扳機綁定: 把 'F' 鍵狀態映射到指定機體 id 上「所有武器」的 weapon.isTrigger.
 *
 * 行為:
 *   - P5KeyPressed(F)  → 對 owner = machineId 的所有 weaponsOnMachine 設 isTrigger = true
 *   - P5KeyReleased(F) → 設 false
 *
 * 為什麼以 machineId 過濾 (而不是 weaponInstanceId):
 *   - debug 場景下機體會掛 1~N 把武器, 通常希望「一鍵測試所有武器同時扣扳機」,
 *     方便比較 FireMode (Single 一發 vs Burst 持續發 vs Spread 散彈)
 *   - 若需要單獨控制某把武器, 之後再多寫一個變體或開放 weapon id filter
 *
 * 設計選擇 (與 DebugProjectile 一致):
 *   - 不註冊為 ISystem; key 事件目前不在 ISystem 介面內 (見 ISystem doc),
 *     view 層的元件直接訂閱 eventSubject 是慣例
 *   - 訂閱模式: worldSubject.switchMap(eventSubject), 確保 owner 查找始終對到
 *     BehaviorSubject 上最新的 world 參考
 *   - 不翻 isDirty: 修改 weapon.isTrigger 屬於 weapon 物件屬性, 不是 world 陣列增刪,
 *     依 World.isDirty 「systems 只在增刪時翻 / view 元件影響 render snapshot 才翻」
 *     的規則, 扳機狀態不直接進 render (沒有對應視覺), 因此本元件不翻
 *
 * 注意:
 *   - 瀏覽器在按鍵 hold 住時會自動重複 keydown, 因而 P5KeyPressed 可能連續觸發;
 *     對 Single / Spread (rising edge) 而言 WeaponFireSystem.prevTrigger 會擋住重複擊發,
 *     對 Burst 而言 interval 比較也會擋住, 不會出問題
 *   - 按下到放開之間若沒進 P5Tick (理論上不會, 因為 p5 每幀都跑 draw), 也不影響語意
 */
function createDebugWeaponTrigger(eventCenter:EventCenter, machineId:String):Void {
	eventCenter.worldSubject
		.switchMap(world -> eventCenter.eventSubject.map(event -> {world: world, event: event}))
		.subscribe(input -> handleEvent(input.world, input.event, machineId));
}

private function handleEvent(world:World, event:Event, machineId:String):Void {
	switch (event) {
		case P5KeyPressed(_, keyCode) if (keyCode == F_KEY_CODE):
			setTriggerForMachine(world, machineId, true);
		case P5KeyReleased(_, keyCode) if (keyCode == F_KEY_CODE):
			setTriggerForMachine(world, machineId, false);
		default:
	}
}

/** 對 owner = machineId 的所有 weaponsOnMachine 設 isTrigger; 不存在的機體 / 無武器情境靜默忽略. */
private function setTriggerForMachine(world:World, machineId:String, value:Bool):Void {
	for (weapon in world.weaponsOnMachine) {
		if (weapon.ownerMachineId == machineId)
			weapon.isTrigger = value;
	}
}
