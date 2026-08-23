package view.component;

import domain.Machine.findSkillById;
import domain.Skill.createMachineCurrentSkill;
import domain.World;
import view.EventCenter;
import view.EventCenter.Event;

/** 'K' 鍵的 p5 keyCode — 用來觸發 demo 機體的招式發動 */
private inline final K_KEY_CODE = 75;

/**
 * 偵錯用招式啟動器: 按 'K' 鍵讓指定機體開始施展指定 skill.
 *
 * 行為:
 *   - P5KeyPressed(K) → 若 machine.currentSkill == null 且 machine.skills 內有 skillId,
 *                       set machine.currentSkill = createMachineCurrentSkill(...).
 *   - 已經在跑招式時: 忽略 (避免按住 K 連續重置 stepIndex / stepStart).
 *     之後若要做「立即取消重啟」「銜接連段」可在此擴充.
 *   - P5KeyReleased(K): 無動作. 招式本身有時長, 不靠按鍵維持.
 *
 * 設計選擇 (與 DebugWeaponTrigger / DebugProjectile 一致):
 *   - 不註冊為 ISystem; key 事件目前不在 ISystem 介面內 (見 ISystem doc),
 *     view 層的元件直接訂閱 eventSubject 是慣例.
 *   - 訂閱模式: worldSubject.switchMap(eventSubject), 確保 machine 查找對到
 *     BehaviorSubject 上最新的 world 參考.
 *
 * isDirty:
 *   設 machine.currentSkill 從 null 到實際物件, 是 runtime 物件的「新增」,
 *   翻 world.isDirty 讓 DirtyWorldPublisher 在本幀末 emit 一次新 render snapshot.
 *
 * 注意:
 *   - 瀏覽器按鍵 hold 住會 repeat keydown, P5KeyPressed 可能連續觸發;
 *     上面 `currentSkill == null` 的 guard 同時也擋掉重啟, 故不會每幀 reset stepIndex.
 *   - 機體 / skill id 找不到時靜默忽略 (debug 用, 不丟例外).
 */
function createDebugSkillLauncher(eventCenter:EventCenter, machineId:String, skillId:String):Void {
	eventCenter.worldSubject
		.switchMap(world -> eventCenter.eventSubject.map(event -> {world: world, event: event}))
		.subscribe(input -> handleEvent(input.world, input.event, machineId, skillId));
}

private function handleEvent(world:World, event:Event, machineId:String, skillId:String):Void {
	switch (event) {
		case P5KeyPressed(_, keyCode) if (keyCode == K_KEY_CODE):
			launchSkill(world, machineId, skillId);
		default:
	}
}

private function launchSkill(world:World, machineId:String, skillId:String):Void {
	for (machine in world.machines) {
		if (machine.id != machineId)
			continue;
		if (machine.currentSkill != null)
			return; // 已在施展, 忽略以免每幀重啟
		if (findSkillById(machine, skillId) == null)
			return;
		machine.currentSkill = createMachineCurrentSkill(skillId, machine);
		world.isDirty = true;
		return;
	}
}
