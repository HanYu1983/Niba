package domain;

import domain.Projectile;

/**
 * 武器類別
 * 招式會宣告所需武器類別 (Skill.requiredCategory),
 * 機體裝備中需有對應類別的武器才能施展該招式
 */
enum WeaponCategory {
	Melee;
	Beam;
	Bullet;
	Missile;
	Special;
}

/**
 * 武器能源來源
 *
 * - NativeEnergy: 共用機體本機能源 (Machine.maxEnergy), 每發消耗 costPerShot
 * - Magazine:     獨立能源匣, 容量 capacity, 用完需 reloadTime 秒充填
 * - Ammo:         一次性彈藥 (例: 飛彈), 用完即無法再發射
 */
enum PowerSource {
	NativeEnergy(costPerShot:Float);
	Magazine(capacity:Int, costPerShot:Float, reloadTime:Float);
	Ammo(rounds:Int);
}

/**
 * 武器發射方式
 */
enum FireMode {
	/** 單發 */
	Single;

	/** 連發: 連續發射 count 顆, 每顆間隔 interval 秒 */
	Burst(count:Int, interval:Float);

	/** 散發: 一次擊發 count 顆, 散布角度為 spreadAngle (度) */
	Spread(count:Int, spreadAngle:Float);
}

/**
 * 武器原型
 * - id 為機體中的唯一鍵, 由 Skill.WeaponUse.weaponId 引用
 * - projectile 為發射物模板; 巢狀爆炸 / 子母彈等行為由 Projectile 自身表達
 * - baseAccuracy 為基礎命中率, 由 SkillStep.WeaponUse.accuracyMul 乘算
 */
typedef Weapon = {
	var id:String;
	var name:String;
	var category:WeaponCategory;
	var power:PowerSource;
	var fire:FireMode;
	var projectile:Projectile;
	var baseAccuracy:Float;
}
