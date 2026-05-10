package domain;

import domain.Geometry.Vec2;
import domain.Weapon.WeaponCategory;

/**
 * 位移類型 (招式步驟中的機體運動軌跡形狀)
 *
 * - None:        不位移
 * - Dash:        直線向前衝刺
 * - Arc(angle):  弧形, angle 為弧線的轉折弧度 (radian)
 *                正值向左彎, 負值向右彎 (右手座標系下)
 * - SCurve:      S 型曲線 (左右各一次小幅偏轉後回到延伸方向)
 */
enum MovementType {
	None;
	Dash;
	Arc(angle:Float);
	SCurve;
}

/**
 * 位移指令
 * multiplier 以機體基礎位移量為單位 (例: 1.0 = 一格 dash 距離)
 */
typedef Movement = {
	var type:MovementType;
	var multiplier:Float;
}

/**
 * 位移計算函式型別 (遊戲規則: 相對機體朝向)
 *
 * 規則:
 *   MovementType 描述的軌跡, 是以「機體面向 facing 為前方」的本機座標形狀,
 *   亦即軌跡定義時假設機體 facing = 0 (面朝 +X), 之後再依當下 facing 旋轉到世界座標。
 *
 *   例子:
 *     - Dash 1.0  + facing = π/2 → 沿 +Y 方向走 1 倍 dash 距離
 *     - Arc(π/4) + facing = 0    → 從 +X 出發, 邊走邊往左 (+Y) 偏 π/4
 *     - SCurve   + facing = π    → 沿 -X 為主軸的 S 形曲線
 *
 * 輸入:
 *   - movement:     Movement 設計值 (類型 + multiplier)
 *   - facing:       機體當下弧度 (Machine.facing)
 *   - baseDistance: 機體基礎位移量 (例: 一格 dash 距離)
 *   - t:            正規化進度 [0, 1]; t = 0 為起點, t = 1 為終點
 *
 * 輸出:
 *   相對機體「起始位置」的世界座標位移向量
 *   (對應位置 = startPosition + 此向量)
 */
typedef MovementResolver = (movement:Movement, facing:Float, baseDistance:Float, t:Float) -> Vec2;

/**
 * 步驟中的武器使用宣告
 *
 * 設計慣例:
 *   碰撞形狀本身由武器自己擁有 (Weapon.projectile 內的 Hitbox.shape),
 *   招式步驟「不再覆寫 hitbox」, 只透過倍率對武器原始數值做縮放。
 *   如此可避免招式 / 武器兩處對形狀的描述不一致。
 *
 * - weaponId:      對應 Machine.weapons 中的武器
 * - energyCostMul: 對該武器原始能量成本的倍率
 * - damageMul:     對該武器 Hitbox.damage.amount 的倍率
 * - accuracyMul:   對該武器 baseAccuracy 的倍率
 */
typedef WeaponUse = {
	var weaponId:String;
	var energyCostMul:Float;
	var damageMul:Float;
	var accuracyMul:Float;
}

/**
 * 招式流程的單一步驟 (流程列表中的元素)
 *
 * 三種典型型態:
 *   1. 純位移: 只填 movement, 不填 weaponUse
 *      → 例: 第一個元素「衝刺進場」
 *   2. 武器攻擊 (可同時位移): 兩者皆填
 *      → 例: 第二個元素「使用 A 武器並前進」
 *   3. 純等待: 兩者皆 null, 由 duration 撐時間
 */
typedef SkillStep = {
	var duration:Float;
	var ?movement:Movement;
	var ?weaponUse:WeaponUse;
}

/**
 * 招式定義 (機體技能)
 * - requiredCategory: 必須有對應類型的武器, 否則無法施展
 * - steps: 由 SkillStep 組成的流程列表, 戰鬥系統依序執行
 */
typedef Skill = {
	var id:String;
	var name:String;
	var requiredCategory:WeaponCategory;
	var steps:Array<SkillStep>;
}
