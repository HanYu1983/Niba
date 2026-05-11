package view;

import domain.Collision.Hitbox;
import domain.FieldObject.Marker;
import domain.Geometry.Vec2;
import domain.Geometry.Vec3;
import domain.Machine;
import domain.Projectile.ProjectileObject;
import domain.Weapon.WeaponOnField;
import domain.Weapon.WeaponOnMachine;
import view.Camera.Camera2D;
import view.Matrix2D.Mat3;

/**
 * RenderWorld 是 World 的繪圖用鏡像。
 *
 * 第一版不加入 RenderProps, 只保留 domain 物件本身可提供的資訊;
 * renderer 可直接走同名列表, 不需要回查 domain.World。
 */
typedef RenderWorld = {
	var machines:Array<RenderMachine>;
	var weaponsOnMachine:Array<RenderWeaponOnMachine>;
	var weaponsOnField:Array<RenderWeaponOnField>;
	var projectiles:Array<RenderProjectileObject>;
	var hitboxes:Array<RenderHitbox>;
	var markers:Array<RenderMarker>;
	var cameraPos:Vec3;
	var camera:Camera2D;
	var viewMatrix:Mat3;
	var projectionMatrix:Mat3;
	var viewProjectionMatrix:Mat3;
}

typedef RenderMachine = {
	> Machine,
}

/**
 * 裝備武器不是 FieldObject, 因此 render model 補上已解析的世界座標。
 */
typedef RenderWeaponOnMachine = {
	> WeaponOnMachine,
	var worldPosition:Vec2;
	var worldFacing:Float;
}

typedef RenderWeaponOnField = {
	> WeaponOnField,
}

typedef RenderProjectileObject = {
	> ProjectileObject,
}

typedef RenderHitbox = {
	> Hitbox,
}

typedef RenderMarker = {
	> Marker,
}
