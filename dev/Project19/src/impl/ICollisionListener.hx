package impl;

import domain.Collision.Hitbox;
import domain.FieldObject.CollidableObject;

/**
 * 碰撞事件接收者介面。
 *
 * 由 CollisionSystem 在偵測到碰撞時呼叫, 將「碰撞發生」此一事實
 * 透過此介面通知出去, 不關心後續處置 (傷害計算 / 推擠 / 銷毀等)。
 *
 * 與 ISystem 的關係:
 *   ISystem extends ICollisionListener — 任何系統皆可同時消費碰撞事件,
 *   不必額外宣告 implements ICollisionListener。
 *   讓多個系統 (machine ↔ machine 推擠 / hitbox ↔ damageable 套傷害) 共享同一份
 *   碰撞偵測結果, 各系統再於 onCollide / onHitboxCollide 過濾自己關心的對象。
 *
 * 兩種回呼的語意分工:
 *   - onCollide:       兩個一般 CollidableObject (例: 機體 vs 機體) 的碰撞,
 *                      雙方對稱, 無主動 / 被動之分
 *   - onHitboxCollide: 「主動傷害源」Hitbox 命中一個 CollidableObject,
 *                      Hitbox 在語意上是攻擊 / 場域, 與一般 collidable 用不同回呼以
 *                      讓接收端能對應戰鬥規則 (套 damage / reactions / cooldown)
 */
interface ICollisionListener {
	/**
	 * 兩個一般 CollidableObject 發生碰撞。
	 *
	 * @param a 碰撞對之一 (無主動 / 被動語意)
	 * @param b 碰撞對之另一
	 *
	 * 注意:
	 *   - 每對 (a, b) 每幀僅通知一次, 不會以 (b, a) 重複觸發
	 *     (CollisionSystem 內部以 i<j 去重)
	 *   - 接收端若要過濾 (例: 只關心兩個機體碰撞), 自行比對 instance / id 即可
	 */
	public function onCollide(a:CollidableObject, b:CollidableObject):Void;

	/**
	 * Hitbox 命中一個 CollidableObject。
	 *
	 * @param hitbox 主動傷害源 (帶 damage / cooldown / 持續時間)
	 * @param target 被動 collidable (目前主要是機體)
	 *
	 * 注意:
	 *   - cooldownPerTarget 等「同一目標多次命中」邏輯由接收端 (戰鬥系統)
	 *     自行記帳; CollisionSystem 不維護命中表
	 *   - 同一個 hitbox 在一幀內可命中多個不同 target → 會分次回呼
	 */
	public function onHitboxCollide(hitbox:Hitbox, target:CollidableObject):Void;
}
