package domain;

import domain.Collision.Hitbox;
import domain.FieldObject;
import domain.FieldObject.CollidableObject;
import domain.FieldObject.Marker;
import domain.FieldObject.MovableObject;
import domain.Machine;
import domain.Projectile.ProjectileObject;
import domain.Weapon.WeaponOnField;
import domain.Weapon.WeaponOnMachine;
import domain.WorldNode.NodeCost;
import domain.WorldNode.WorldNode;

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
 *   - markers:          場上的地點標記 (出生點 / 任務點 / 巡邏點等)
 *
 * 世界節點化:
 *   尋路 / 圖搜尋以 WorldNode + NeighborProvider 為介面 (見下方 typedef)。
 *   NeighborProvider 不放在 World 上, 因為成本計算是「全息」的
 *   (鄰居 / 成本可能依其他機體位置 / 動態障礙物 / 戰場狀態而變),
 *   故由呼叫方在需要時把 World 與節點一併傳入。
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
	var markers:Array<Marker>;
}

/**
 * 取得指定節點的相連節點 (與成本) 的函式型別
 *
 * 契約:
 *   - 第一參數 world 為「全息上下文」, 成本計算可能依機體位置 / 發射物 / 動態障礙等變動,
 *     故必須帶入完整 World
 *   - 對方格節點 (Cell) 通常回傳 4 個方向 (上下左右) 的鄰居;
 *     8 連通由實作端決定
 *   - 不可通過的鄰居 (例如 Wall / 被機體佔據的格子) 由實作端選擇省略, 或標 cost = ∞
 *   - 邊界外的鄰居應省略
 *   - cost 為「從目前節點移動到該鄰居」的成本, 由地形 / 距離 / 高低差 / 動態狀態等決定
 */
typedef NeighborProvider = (world:World, node:WorldNode) -> Array<NodeCost>;

/**
 * 建立沒有任何場上物的空世界。
 *
 * 用途:
 *   - sample / test 的起點
 *   - runtime 初始化戰場狀態
 *   - 避免每次 World 新增列表欄位時, 各處手刻 literal 都要同步補欄位
 */
function createEmptyWorld():World {
	return {
		machines: [],
		weaponsOnMachine: [],
		weaponsOnField: [],
		projectiles: [],
		hitboxes: [],
		markers: []
	};
}

/**
 * 取得所有實際存在於場上的物件。
 *
 * 包含:
 *   - machines
 *   - weaponsOnField
 *   - projectiles
 *   - hitboxes
 *   - markers
 *
 * 不包含 weaponsOnMachine, 因為它們是 MountedObject,
 * 世界座標需由 owner 機體的 position / facing 推導, 不直接視為 FieldObject。
 */
function getFieldObjects(world:World):Array<FieldObject> {
	var objects:Array<FieldObject> = [];

	for (machine in world.machines)
		objects.push(machine);

	for (weapon in world.weaponsOnField)
		objects.push(weapon);

	for (projectile in world.projectiles)
		objects.push(projectile);

	for (hitbox in world.hitboxes)
		objects.push(hitbox);

	for (marker in world.markers)
		objects.push(marker);

	return objects;
}

/**
 * 取得所有可碰撞物件。
 *
 * 目前包含:
 *   - machines: 機體自身碰撞體積
 *   - hitboxes: 戰鬥中實際參與碰撞判定的最小實體
 */
function getCollidableObjects(world:World):Array<CollidableObject> {
	var objects:Array<CollidableObject> = [];

	for (machine in world.machines)
		objects.push(machine);

	for (hitbox in world.hitboxes)
		objects.push(hitbox);

	return objects;
}

/**
 * 取得所有可移動物件。
 *
 * 目前包含:
 *   - machines: 機體具備速度, 可由 movement / physics 系統推進
 *   - projectiles: 場上發射物具備速度, 可由飛行系統推進
 */
function getMovableObjects(world:World):Array<MovableObject> {
	var objects:Array<MovableObject> = [];

	for (machine in world.machines)
		objects.push(machine);

	for (projectile in world.projectiles)
		objects.push(projectile);

	return objects;
}

/**
 * 可移動物件的最小具象移動規則。
 *
 * 規則:
 *   position += velocity * dt
 *
 * 加速度、碰撞阻擋、尋路轉向、摩擦、最大速度等較複雜規則
 * 應由更上層系統先更新 velocity 或另寫 movement resolver。
 */
function moveMovableObject(object:MovableObject, dt:Float):Void {
	object.position = {
		x: object.position.x + object.velocity.x * dt,
		y: object.position.y + object.velocity.y * dt
	};
}
