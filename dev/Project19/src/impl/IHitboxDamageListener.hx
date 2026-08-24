package impl;

import domain.Collision.Hitbox;
import domain.FieldObject.CollidableObject;

/**
 * Hitbox 套傷害事件接收者介面。
 *
 * 由 HitboxSystem 在「Hitbox 對目標確實要結算傷害」這一刻 (cooldownPerTarget 已通過、
 * 命中記錄表已登記、duration 仍有效) 呼叫, 將「傷害事件」此一語意通知出去,
 * 不關心套傷害的具體流程 (扣 HP / defense 折抵 / 死亡判定 / 視覺特效等)。
 *
 * 與 ICollisionListener.onHitboxCollide 的對比:
 *   - onHitboxCollide: 純幾何「包圍圓相交」事件, 由 CollisionSystem 廣播,
 *                      每幀只要相交就會回呼, 不考慮 cooldownPerTarget 與命中記錄表
 *   - onDamage:        經過 HitboxSystem 過濾後的「應該結算這次傷害」事件, 由 HitboxSystem 廣播,
 *                      同一目標在 cooldown 內不會重複, duration 過期後也不會再發
 *
 * 與 ISystem 的關係:
 *   ISystem extends IHitboxDamageListener — 任何系統皆可同時消費傷害事件,
 *   不必額外宣告 implements IHitboxDamageListener。
 *   讓多個系統 (未來的 HP 系統 / 計分系統 / 命中特效系統) 共享同一份傷害判定結果,
 *   各系統再自行決定要不要對該事件做事 (例如過濾關心的 target 才扣 HP)。
 */
interface IHitboxDamageListener {
	/**
	 * Hitbox 對目標套傷害的瞬間。
	 *
	 * @param hitbox 攻擊源 (帶 damage / reactions / cooldownPerTarget)
	 * @param target 被攻擊目標 (目前主要是機體 / 發射物)
	 *
	 * 注意:
	 *   - cooldownPerTarget 與命中記錄表的維護由 HitboxSystem 負責;
	 *     接收端拿到的 onDamage 已經是「應該結算的這次傷害」, 不需要自己再去重
	 *   - reactions (Knockback / Stagger / Burn 等) 目前由 HitboxSystem 暫不處理,
	 *     接收端如需可自行從 hitbox.reactions 讀取
	 */
	public function onDamage(hitbox:Hitbox, target:CollidableObject):Void;
}
