package domain;

import domain.Collision.Hitbox;
import domain.FieldObject;
import domain.Machine;
import domain.Projectile.ProjectileObject;
import domain.Weapon.WeaponOnField;
import domain.Weapon.WeaponOnMachine;

/**
 * 戰場世界狀態 (執行時態)
 *
 * 此 typedef 收納目前一定會有的核心扁平列表;
 * 之後若需要再擴充 (時間 / 戰場邊界 / 觸發器 / 狀態效果等), 直接加欄位即可。
 *
 * 列表用途:
 *   - machines:         場上的所有機體
 *   - weaponsOnMachine: 所有裝備於機體上的武器實例
 *   - weaponsOnField:   所有掉落 / 部署 / 砲塔等場上武器
 *   - projectiles:      所有飛行 / 場域中的發射物實例
 *   - hitboxes:         所有目前存活的碰撞箱
 *
 * 設計注意:
 *   weaponsOnMachine 與 Machine.weapons 是同一批 WeaponOnMachine 物件的兩種視角
 *   (Haxe 物件參考, 不會複製), 戰鬥系統需在 add / remove 時兩處同步更新。
 *   一邊代表「歸屬」(machine.weapons), 一邊代表「全域查詢」(world.weaponsOnMachine)。
 *
 *   為了使「全部碰撞箱在一個列表」, Hitbox 雖然概念上可由武器 / 招式 / 場域產生,
 *   但生成後皆登記到 world.hitboxes; 來源資訊可放在 Hitbox 自身的 id / name 中或日後擴充欄位。
 */
typedef World = {
	var machines:Array<Machine>;
	var weaponsOnMachine:Array<WeaponOnMachine>;
	var weaponsOnField:Array<WeaponOnField>;
	var projectiles:Array<ProjectileObject>;
	var hitboxes:Array<Hitbox>;
}

/**
 * World 查詢工具
 */
class WorldQuery {
	/**
	 * 取得所有實際存在於場上的物件。
	 *
	 * 包含:
	 *   - machines
	 *   - weaponsOnField
	 *   - projectiles
	 *   - hitboxes
	 *
	 * 不包含 weaponsOnMachine, 因為它們是 MountedObject,
	 * 世界座標需由 owner 機體的 position / facing 推導, 不直接視為 FieldObject。
	 */
	public static function getFieldObjects(world:World):Array<FieldObject> {
		var objects:Array<FieldObject> = [];

		for (machine in world.machines)
			objects.push(machine);

		for (weapon in world.weaponsOnField)
			objects.push(weapon);

		for (projectile in world.projectiles)
			objects.push(projectile);

		for (hitbox in world.hitboxes)
			objects.push(hitbox);

		return objects;
	}
}
