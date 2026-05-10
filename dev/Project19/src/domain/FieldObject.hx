package domain;

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
