package domain;

import haxe.Serializer;
import haxe.Unserializer;
import domain.Collision.Hitbox;
import domain.FieldObject;
import domain.FieldObject.CollidableObject;
import domain.FieldObject.Marker;
import domain.FieldObject.MovableObject;
import domain.Geometry.Vec3;
import domain.Goal.GoalContext;
import domain.Goal.GoalNode;
import domain.Goal.LeafFactory;
import domain.Goal.PlannerFactory;
import domain.Goal.isFinal;
import domain.Goal.runFrame;
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
 *   - goalNodes:        場上目前正在執行的 Goal 樹根節點 (一個機體可掛多個 goal)
 *   - cameraPos:        相機在世界中的 3D 位置, 供 view/render 層建立 camera 使用
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
	var goalNodes:Array<GoalNode>;
	var cameraPos:Vec3;
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
		markers: [],
		goalNodes: [],
		cameraPos: {x: 0.0, y: 0.0, z: 0.0}
	};
}

/**
 * 將 World 序列化成字串。
 *
 * 使用 haxe.Serializer 直接序列化整個 World 結構,
 * 內含的 Array / typedef / Vec3 等都會被遞迴處理。
 *
 * 注意:
 *   - 必須顯式開啟 useCache = true。haxe.Serializer 預設只快取「具類型」物件
 *     (class instance / enum), 對匿名結構 (typedef) 不做快取;
 *     而 Machine / WeaponOnMachine 都是 typedef = 匿名結構,
 *     若不開 useCache, weaponsOnMachine 與 machine.weapons 反序列化後
 *     會是兩個內容相同但獨立的物件, 破壞「同一批物件兩種視角」的設計契約。
 *   - 僅序列化資料欄位; 函式 / 閉包 / NeighborProvider 等不會被保存。
 */
function serializeWorld(world:World):String {
	var serializer = new Serializer();
	serializer.useCache = true;
	serializer.serialize(world);
	return serializer.toString();
}

/**
 * 將字串反序列化回 World。
 *
 * 對應 serializeWorld 的逆操作; 傳入的字串必須是由
 * haxe.Serializer 產生的格式, 否則會丟出例外。
 */
function unserializeWorld(s:String):World {
	var unserializer = new Unserializer(s);
	return unserializer.unserialize();
}

/**
 * 以 id 查找場上的機體。
 *
 * 用途:
 *   - Goal lifecycle 從 leafState.actorId 取得目前要操作的機體
 *   - 戰鬥系統 / UI 透過 id 解析機體參考
 *
 * 找不到時回傳 null; 呼叫端通常將 null 視為「該機體已不存在」
 * (例如已陣亡 / 被移除), 對 Goal 而言會觸發 init / validate 失敗。
 */
function findMachineById(world:World, id:String):Null<Machine> {
	for (machine in world.machines)
		if (machine.id == id)
			return machine;
	return null;
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

/**
 * 推進 world 上所有 goal 一個 frame。
 *
 * 流程:
 *   1. 對 world.goalNodes 中每個節點呼叫 Goal.runFrame, 推進其狀態
 *   2. 已達終止狀態 (Succeeded / Failed) 的節點本幀仍會被執行 (runFrame 內部對終止狀態無動作),
 *      推進完後一次性從 world.goalNodes 移除
 *
 * 設計:
 *   - GoalContext 在這裡組裝 ({world: world}), 呼叫端只要丟 dt 與 factory 即可,
 *     不需要每個系統自己組 ctx
 *   - 推進與「清掉已完成 goal」綁在同一個函式, 避免呼叫端忘記 GC 造成
 *     終止節點越積越多
 *   - 不在這裡處理「goal 失敗時要不要重排 / 重新規劃」, 那是更上層 AI 系統的職責;
 *     此函式只是純粹推進與清理
 *
 * @param world           戰場狀態; goalNodes 將被原地修改 (推進並移除已完成項)
 * @param dt              本 frame 的時間步進 (秒)
 * @param leafFactory     leaf 名稱 → LeafLifecycle 的工廠 (通常為 impl.SharedLeafFactory.sharedLeafFactory)
 * @param plannerFactory  Custom composite planner 名稱 → GoalPlanner 的工廠
 */
function tickGoals(world:World, dt:Float, leafFactory:LeafFactory, plannerFactory:PlannerFactory):Void {
	var ctx:GoalContext = {world: world};
	for (node in world.goalNodes) {
		runFrame(node, ctx, dt, leafFactory, plannerFactory);
	}
	var i = world.goalNodes.length;
	while (i-- > 0) {
		if (isFinal(world.goalNodes[i].status))
			world.goalNodes.splice(i, 1);
	}
}
