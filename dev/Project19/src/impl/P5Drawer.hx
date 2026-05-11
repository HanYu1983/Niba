package impl;

import domain.Collision.Hitbox;
import domain.FieldObject;
import domain.FieldObject.DrawableObject;
import domain.Geometry.Shape;
import domain.Machine;
import domain.Projectile.ProjectileObject;
import domain.Weapon.WeaponOnField;
import domain.World;
import domain.World.Drawer;
import js.Browser;

/**
 * 建立 p5.js 版 Drawer。
 *
 * 使用 p5.js global mode, p5.js 需先於編譯後的 Haxe JS 載入。
 * 此實作只做 debug 視覺化: 中心點、朝向線、名稱, 以及有 shape 欄位物件的簡易碰撞輪廓。
 */
function createP5Drawer():Drawer {
	var p5:Dynamic = Browser.window;

	return (world:World, object:DrawableObject) -> {
		switch (object.target.kind) {
			case MachineKind:
				for (machine in world.machines)
					if (machine.id == object.target.id) {
						drawMachine(p5, machine);
						return;
					}
			case WeaponOnFieldKind:
				for (weapon in world.weaponsOnField)
					if (weapon.id == object.target.id) {
						drawWeaponOnField(p5, weapon);
						return;
					}
			case ProjectileKind:
				for (projectile in world.projectiles)
					if (projectile.id == object.target.id) {
						drawProjectile(p5, projectile);
						return;
					}
			case HitboxKind:
				for (hitbox in world.hitboxes)
					if (hitbox.id == object.target.id) {
						drawHitbox(p5, hitbox);
						return;
					}
			case MarkerKind:
				for (marker in world.markers)
					if (marker.id == object.target.id) {
						drawObjectBase(p5, marker);
						return;
					}
		}
	};
}

private function drawMachine(p5:Dynamic, machine:Machine):Void {
	drawObjectBase(p5, machine, machine.shape);
}

private function drawWeaponOnField(p5:Dynamic, weapon:WeaponOnField):Void {
	drawObjectBase(p5, weapon);
}

private function drawProjectile(p5:Dynamic, projectile:ProjectileObject):Void {
	drawObjectBase(p5, projectile);
}

private function drawHitbox(p5:Dynamic, hitbox:Hitbox):Void {
	drawObjectBase(p5, hitbox, hitbox.shape);
}

private function drawObjectBase(p5:Dynamic, object:FieldObject, ?shape:Shape):Void {
	p5.push();
	p5.translate(object.position.x, object.position.y);
	p5.rotate(object.facing);

	if (shape != null)
		drawShape(p5, shape);

	drawFacing(p5);
	drawLabel(p5, object);

	p5.pop();
}

private function drawShape(p5:Dynamic, shape:Shape):Void {
	p5.push();
	p5.noFill();
	p5.stroke(80, 180, 255);

	switch (shape) {
		case Rect(x, y, width, height):
			p5.rect(x, y, width, height);
		case Circle(x, y, radius):
			p5.circle(x, y, radius * 2);
	}

	p5.pop();
}

private function drawFacing(p5:Dynamic):Void {
	p5.push();
	p5.stroke(255, 120, 80);
	p5.line(0, 0, 24, 0);
	p5.fill(255, 120, 80);
	p5.circle(0, 0, 4);
	p5.pop();
}

private function drawLabel(p5:Dynamic, object:FieldObject):Void {
	if (object.name == "")
		return;

	p5.push();
	p5.rotate(-object.facing);
	p5.noStroke();
	p5.fill(255);
	p5.text(object.name, 6, -6);
	p5.pop();
}
