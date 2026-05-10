package domain;

import domain.Damage.Damage;
import domain.Geometry.Shape;

/**
 * 碰撞反應 - Hitbox 成功命中目標後對目標的附加效果
 *
 * 注意:
 *   - 主傷害數值由 Hitbox.damage 直接處理 (含類型 + 數值)
 *   - 此 enum 僅描述「非主傷害」的反應, 例如位移效果或狀態類效果
 *   - 觸發時機與 cooldownPerTarget 一致: 同一個 Hitbox 在冷卻內
 *     不會對同一目標重複觸發 reactions
 */
enum HitReaction {
	/** 擊退: 沿命中方向施加 force 單位的速度衝擊 */
	Knockback(force:Float);

	/** 異常狀態: 硬直 / 麻痺等, 由戰鬥系統登記到目標的狀態列 */
	Stagger(duration:Float);

	/**
	 * 持續傷害 (DOT)
	 * 由戰鬥系統登記到目標的狀態列, 與此 Hitbox 的 cooldownPerTarget 解耦
	 * (本 Hitbox 消滅後 DOT 仍可繼續, 直到 duration 結束)
	 */
	Burn(damage:Damage, duration:Float);
}

/**
 * 碰撞箱 (Hitbox) - 戰鬥中的碰撞最小實體, 同時也是場上物
 *
 * ===== 戰鬥規則 =====
 *   1. Hitbox 由觸發源 (招式步驟 / Projectile.OnHit / Projectile.Field)
 *      在世界中生成, 存活 duration 秒
 *   2. position / facing 來自 FieldObject, 表示 Hitbox 的世界座標基準
 *   3. shape 為「本機座標」(參見 Shape / ShapeResolver),
 *      由戰鬥系統依此 Hitbox 的 facing / position 轉換到世界座標進行碰撞偵測
 *   4. 期間每 frame 對所有 IDamageable 偵測碰撞
 *   5. 命中目標 T 時:
 *      a. 對 T 套用 damage (依 IDamageable.defense 折抵)
 *      b. 對 T 套用 reactions
 *      c. 將 T 加入此 Hitbox 的「命中記錄表」, 鎖定 cooldownPerTarget 秒
 *   6. 鎖定期間此 Hitbox 不會再次命中 T
 *      (但仍可命中其他未鎖定的目標)
 *   7. cooldownPerTarget 到期 → T 從記錄移除 → 可再次被本 Hitbox 命中
 *      (DOT 場域 / 連斬等的循環觸發機制即是此規則)
 *   8. duration 結束 → Hitbox 消滅, 所有命中記錄一併釋放
 *
 * ===== 設計對照表 =====
 *   一次性近戰刀光:
 *     duration=0.10, cooldownPerTarget=Math.POSITIVE_INFINITY
 *     → 0.1 秒生效期內每個目標只會被打到一次
 *
 *   連斬 (3 hit / 0.6s):
 *     duration=0.60, cooldownPerTarget=0.20
 *     → 同一目標最多被打到 0.6/0.2 = 3 次
 *
 *   火焰場域 (5s, 每 0.5s 一跳):
 *     duration=5.00, cooldownPerTarget=0.50
 *     → 5 秒內範圍內目標每 0.5 秒被命中一次
 *
 *   瞬間爆炸 (一個 frame 結算):
 *     duration=ε,  cooldownPerTarget=Math.POSITIVE_INFINITY
 *     → 同 frame 內把範圍內所有目標各打一次後消失
 */
typedef Hitbox = {
	> FieldObject,
	var shape:Shape;
	var duration:Float;
	var cooldownPerTarget:Float;
	var damage:Damage;
	var reactions:Array<HitReaction>;
}
