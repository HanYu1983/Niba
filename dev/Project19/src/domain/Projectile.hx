package domain;

import domain.Collision.Hitbox;
import domain.Damage.Damage;
import domain.FieldObject.MovableObject;

/**
 * 發射物本體 (enum 巢狀組合)
 *
 * 範例:
 *   實體彈 → 命中後爆炸 (一次性) + 火焰場域 (持續):
 *     Solid(speed, dmg, Spawn([
 *       { shape:Circle(0,0,3), duration:ε,   cooldownPerTarget:∞,   damage:explDmg, reactions:[] },
 *       { shape:Circle(0,0,3), duration:5.0, cooldownPerTarget:0.5, damage:fireDmg, reactions:[] }
 *     ]))
 *
 *   子母彈 → 命中後散發三顆子彈:
 *     Solid(speed, dmg, SpawnProjectiles([Solid(...), Solid(...), Solid(...)]))
 *
 *   爆炸 + 子母彈同時觸發:
 *     Solid(speed, dmg, All([Spawn([...]), SpawnProjectiles([...])]))
 *
 * 注意: Projectile 為「靜態定義」結構; 戰鬥系統需在執行階段
 *       追蹤每顆發射物目前的階段 (是否已命中, OnHit 進行到哪一層)
 */
enum Projectile {
	/** 實體彈: 直線飛行, 命中後觸發 OnHit; damage 為直接接觸的傷害 */
	Solid(speed:Float, damage:Damage, onHit:OnHit);

	/** 能量彈: 屬性偏 Energy, 飛行不受重力 */
	Energy(speed:Float, damage:Damage, onHit:OnHit);

	/** 光束: 即時命中, 無飛行階段 */
	Beam(range:Float, damage:Damage);

	/**
	 * 場域型: 不飛行, 立即在發射點生成一組 Hitbox
	 * 應用例: 部署地雷, 釋放毒霧, 召喚燃燒地板
	 * 持續時間 / 冷卻 / 範圍等皆由 Hitbox 各自控制
	 */
	Field(boxes:Array<Hitbox>);
}

/**
 * 發射物階段
 * 用於 ProjectileObject 追蹤 enum 模板在場上的執行狀態。
 */
enum ProjectileStage {
	/** 飛行中, 尚未命中或結束 */
	Flying;

	/** 已命中, 正在執行 OnHit 流程 */
	ResolvingHit(stepIndex:Int);

	/** 已結束, 可由戰鬥系統移除 */
	Expired;
}

/**
 * 場上發射物
 *
 * Projectile enum 是發射物「定義 / 模板」; ProjectileObject 才是實際存在於
 * 戰場中的發射物, 因此使用結構繼承取得 FieldObject 的 position / facing。
 *
 * - projectile: 原始發射物模板
 * - velocity:   世界座標速度
 * - maxSpeed:   繼承自 MovableObject, 飛行速度標量上限
 * - age:        已存在時間
 * - stage:      目前執行階段
 */
typedef ProjectileObject = {
	> MovableObject,
	var projectile:Projectile;
	var age:Float;
	var stage:ProjectileStage;
}

/**
 * 命中後的階段行為, 可巢狀組合
 * 由 Projectile.onHit 引用
 *
 * 取代了舊的 HitEffect 模型: 過去的 Apply / Detonate 概念現在統一以
 * Spawn(Hitbox 群) 表達, 持續時間與冷卻直接寫進 Hitbox 即可:
 *   - 瞬間命中目標 (舊 Apply)        → duration ≈ 0,   cooldown = ∞
 *   - 範圍爆炸 (舊 Detonate)         → duration ≈ 0,   cooldown = ∞, shape 為爆炸範圍
 *   - 持續性場域 (舊 Field 之 effects) → duration > 0,  cooldown = tick 間隔
 */
enum OnHit {
	/** 在命中點生成一組 Hitbox (取代舊 Apply / Detonate) */
	Spawn(boxes:Array<Hitbox>);

	/** 子母彈: 命中後衍生新的 Projectile (可再巢狀 OnHit) */
	SpawnProjectiles(children:Array<Projectile>);

	/** 同時觸發多種行為 (例: 爆炸 + 子母彈) */
	All(steps:Array<OnHit>);

	/** 穿透 / 無事 */
	None;
}
