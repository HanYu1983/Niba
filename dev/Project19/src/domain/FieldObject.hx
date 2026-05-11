package domain;

import domain.Geometry.Shape;
import domain.Geometry.Vec2;

/**
 * 場上物 - 任何實際存在於戰場座標系中的物件
 *
 * 使用 typedef 結構繼承 (`> FieldObject`) 讓機體、場上武器、
 * 發射物實例、碰撞箱都共享同一組「場上存在」欄位。
 *
 * 規則:
 *   - position: 世界座標位置
 *   - facing:   世界座標朝向, 單位為弧度 (radian)
 *               慣例: 0 = +X 方向, 逆時針為正
 *
 * 注意:
 *   Projectile enum 是「發射物模板」, 不直接繼承 FieldObject;
 *   真正在場上飛行的發射物使用 ProjectileObject。
 */
typedef FieldObject = {
	var id:String;
	var name:String;
	var position:Vec2;
	var facing:Float;
}

/**
 * 可移動場上物
 *
 * - position 來自 FieldObject, 表示當前世界座標
 * - velocity 表示世界座標速度, 單位由 runtime 決定 (例: 每秒世界單位)
 *
 * 具體移動規則由 World.moveMovableObject 提供最小實作:
 *   position += velocity * dt
 */
typedef MovableObject = {
	> FieldObject,
	var velocity:Vec2;
}

/**
 * 場上物種類。
 *
 * 搭配 FieldObjectRef 使用, 讓 renderer / 系統能以 kind + id 從 World 的正確列表
 * 取回完整 domain object。
 */
enum FieldObjectKind {
	MachineKind;
	WeaponOnFieldKind;
	ProjectileKind;
	HitboxKind;
	MarkerKind;
}

/**
 * 場上物參照。
 *
 * id 可只保證在同一種 FieldObjectKind 內唯一; kind 負責指出要到 World 的哪個列表查找。
 */
typedef FieldObjectRef = {
	var kind:FieldObjectKind;
	var id:String;
}

/**
 * 可繪圖目標。
 *
 * DrawableObject 是繪圖層的「參照」, 不是 domain object 本體。
 * Drawer 取得 world + target 後, 可依 target.kind 從 World 的對應列表取回完整物件。
 */
typedef DrawableObject = {
	var target:FieldObjectRef;
}

/**
 * 可碰撞場上物
 *
 * - position / facing 來自 FieldObject, 表示此碰撞形狀的世界座標基準
 * - shape 為「本機座標」形狀, 實際判定前由 ShapeResolver 依 position / facing 轉成世界座標
 *
 * 此抽象只描述「可被碰撞系統讀取的幾何資訊」, 不包含傷害、命中冷卻或碰撞反應。
 * 例如 Hitbox 會在此基礎上再增加戰鬥規則欄位。
 */
typedef CollidableObject = {
	> FieldObject,
	var shape:Shape;
}

/**
 * 裝備於機體上的物件
 *
 * 與 FieldObject 對比:
 *   - FieldObject 擁有世界座標 position / facing
 *   - MountedObject 擁有相對機體的 localPosition / localFacing
 *
 * 實際世界座標由戰鬥系統透過 owner 機體轉換:
 *   worldPosition = owner.position + rotate(localPosition, owner.facing)
 *   worldFacing   = owner.facing + localFacing
 *
 * 武器、盾牌、外掛模組等裝備都應優先使用此結構,
 * 只有掉到地上、被部署、或脫離機體後才成為 FieldObject。
 */
typedef MountedObject = {
	var id:String;
	var name:String;
	var ownerMachineId:String;
	var localPosition:Vec2;
	var localFacing:Float;
}

/**
 * 場上地點標記
 *
 * 結構與 FieldObject 一致, 純粹以 typedef 名稱區分用途。
 *
 * 應用場景:
 *   - 出生點 / 重生點
 *   - 巡邏路徑點
 *   - 任務 / 目標位置 (例: Goal 系統的「接近 A」中的 A)
 *   - 相機錨點 / 鏡頭觸發
 *
 * 不擁有戰鬥屬性 (HP / 武器 / 防禦), 也不會被碰撞系統視為可打擊目標,
 * 但仍可被 getFieldObjects(world) 取得以做為位置查詢來源。
 */
typedef Marker = {
	> FieldObject,
}

/**
 * 建立欄位都為預設值的空 Marker。
 *
 * 用途:
 *   - sample / test 不必逐欄位手刻 literal
 *   - 後續若 FieldObject 增欄位, 一處補預設即可
 *
 * 慣例:
 *   - id / name 為空字串
 *   - position 為原點 (0, 0)
 *   - facing 為 0 弧度 (+X 方向)
 */
function createEmptyMarker():Marker {
	return {
		id: "",
		name: "",
		position: {x: 0.0, y: 0.0},
		facing: 0.0
	};
}
