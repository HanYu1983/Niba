package sample;

import domain.Collision.Hitbox;
import domain.Collision.HitReaction;
import domain.Damage.Damage;
import domain.Damage.DamageType;
import domain.Geometry.Shape;
import domain.Projectile;
import domain.Skill.Skill;
import domain.Skill.MovementType;
import domain.Weapon.Weapon;
import domain.Weapon.WeaponCategory;
import domain.Weapon.PowerSource;
import domain.Weapon.FireMode;

/**
 * 範例: 衝刺斬 (Dash + Slash)
 *
 * 用於驗證領域模型的可組裝性, 也作為文件用途的使用範例
 *
 * 流程:
 *   1. 衝刺進場 (純位移)
 *   2. 衝刺中揮刀 (位移 + 武器使用)
 *   3. 收招硬直 (純等待)
 *
 * 同時示範:
 *   - Weapon: 近戰武器以 Projectile.Field([Hitbox]) 表達 (不飛行, 直接在揮舞處生成 Hitbox)
 *   - Hitbox: 一次性命中 (cooldownPerTarget = ∞) + Knockback 反應
 *   - Skill:  純位移 / 位移+武器 / 純等待 三種 SkillStep 型態
 *   - SkillStep.WeaponUse 只用倍率調整武器數值, 形狀由武器自身的 Hitbox 擁有
 */
class DashSlash {
	/**
	 * 電漿刀 (Plasma Blade) - 近戰武器
	 *
	 * - Melee 類別: 對應 dashSlash.requiredCategory
	 * - power = NativeEnergy(8): 每揮一次扣機體本機能源 8 點
	 * - fire  = Single: 單發
	 * - projectile = Field([1 顆 Hitbox]): 不飛行, 揮舞處立即生成 Hitbox
	 *     shape:             機體前方 0.5~2.0, 寬 0.8 的條狀矩形 (本機座標)
	 *     duration:          0.10s (一閃即逝)
	 *     cooldownPerTarget: ∞    (同目標只會被打到一次)
	 *     damage:            Energy 30
	 *     reactions:         Knockback(8)
	 */
	public static final plasmaBlade:Weapon = {
		id: "blade_a",
		name: "Plasma Blade",
		category: Melee,
		power: NativeEnergy(8.0),
		fire: Single,
		projectile: Field([
			{
				shape: Rect(0.5, -0.4, 1.5, 0.8),
				duration: 0.10,
				cooldownPerTarget: Math.POSITIVE_INFINITY,
				damage: {type: Energy, amount: 30.0},
				reactions: [Knockback(8.0)]
			}
		]),
		baseAccuracy: 1.0
	}

	/**
	 * 招式: 衝刺斬 (Dash Slash)
	 *
	 * - requiredCategory = Melee → 須裝備 Melee 類武器才能施展
	 * - 三步驟結構:
	 *
	 *   步驟 1 (0.25s) 純位移 - Dash 倍率 2.0 (進場)
	 *   步驟 2 (0.20s) 輕度 Dash 0.6 倍 + 使用 Plasma Blade
	 *                  形狀沿用武器自身的 Hitbox.shape (Rect 0.5~2.0, 寬 0.8)
	 *                  energyCostMul = 1.2 / damageMul = 1.5 / accuracyMul = 1.0
	 *   步驟 3 (0.30s) 純等待 - 收招硬直 (movement 與 weaponUse 皆 null)
	 */
	public static final dashSlash:Skill = {
		id: "dash_slash",
		name: "衝刺斬",
		requiredCategory: Melee,
		steps: [
			{
				duration: 0.25,
				movement: {type: Dash, multiplier: 2.0}
			},
			{
				duration: 0.20,
				movement: {type: Dash, multiplier: 0.6},
				weaponUse: {
					weaponId: "blade_a",
					energyCostMul: 1.2,
					damageMul: 1.5,
					accuracyMul: 1.0
				}
			},
			{
				duration: 0.30
			}
		]
	}
}
