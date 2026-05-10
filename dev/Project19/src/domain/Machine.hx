package domain;

import domain.Damage.Damage;
import domain.Damage.DefenseProfile;
import domain.Weapon.Weapon;
import domain.Skill.Skill;

/**
 * 可受傷實體的契約
 * 由具體的機體執行時態實作; 戰鬥系統透過此介面套用傷害
 */
interface IDamageable {
	/** 防禦比重 (例: 防火 100, 防電 20) */
	public var defense:DefenseProfile;

	/** 承受一筆傷害, 實作端應依 defense 折抵後再扣血 */
	public function applyDamage(damage:Damage):Void;
}

/**
 * 機體 (機器) 原型 + 執行時必要狀態
 *
 * 設計時欄位:
 *   - maxHp / maxEnergy / energyRegen: 數值上限與回復
 *   - defense:                         各屬性的防禦比重
 *   - weapons + skills:                戰鬥能力 (Skill 須有對應 WeaponCategory)
 *
 * 執行時欄位 (2D 俯角):
 *   - facing: 機體當下的朝向, 單位為弧度 (radian)
 *             慣例: 0 = +X 方向 (右), 逆時針為正
 *             供 MovementResolver / ShapeResolver 做相對到世界座標的轉換
 *
 * 其他執行時狀態 (currentHp / currentEnergy / 彈匣餘量 / Projectile 階段等)
 * 可視需要再擴充, 此處僅放入相對計算必須的最小欄位
 */
typedef Machine = {
	var id:String;
	var name:String;
	var maxHp:Float;
	var maxEnergy:Float;
	var energyRegen:Float;
	var defense:DefenseProfile;
	var weapons:Array<Weapon>;
	var skills:Array<Skill>;
	var facing:Float;
}
