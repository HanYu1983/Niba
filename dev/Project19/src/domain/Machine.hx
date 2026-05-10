package domain;

import domain.Damage.Damage;
import domain.Damage.DamageType;
import domain.Damage.DefenseProfile;
import domain.FieldObject.MovableObject;
import domain.Skill.Skill;
import domain.Weapon.WeaponOnMachine;

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
 *   - position: 機體當下世界座標位置
 *
 * 其他執行時狀態 (currentHp / currentEnergy / 彈匣餘量 / Projectile 階段等)
 * 可視需要再擴充, 此處僅放入相對計算必須的最小欄位
 */
typedef Machine = {
	> MovableObject,
	var maxHp:Float;
	var maxEnergy:Float;
	var energyRegen:Float;
	var defense:DefenseProfile;
	var weapons:Array<WeaponOnMachine>;
	var skills:Array<Skill>;
}

/**
 * 建立欄位都為預設值的空 Machine。
 *
 * 用途:
 *   - sample / test 不必逐欄位手刻 literal
 *   - 後續若 Machine / FieldObject 增欄位, 一處補預設即可
 *
 * 預設值:
 *   - id / name 為空字串
 *   - position / velocity 為零向量, facing = 0
 *   - 所有數值欄位為 0
 *   - defense.weights 為空 Map
 *   - weapons / skills 為空陣列
 */
function createEmptyMachine():Machine {
	return {
		id: "",
		name: "",
		position: {x: 0.0, y: 0.0},
		velocity: {x: 0.0, y: 0.0},
		facing: 0.0,
		maxHp: 0.0,
		maxEnergy: 0.0,
		energyRegen: 0.0,
		defense: {weights: new Map<DamageType, Float>()},
		weapons: [],
		skills: []
	};
}
