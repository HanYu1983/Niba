package view.component;

import domain.Geometry.Shape;
import domain.Geometry.Vec2;
import view.EventCenter;
import view.EventCenter.P5RenderFrame;
import view.Matrix2D.Mat3;
import view.Matrix2D.transformPoint;
import view.RenderWorld.RenderHitbox;
import view.RenderWorld.RenderMachine;
import view.RenderWorld.RenderMarker;
import view.RenderWorld.RenderProjectileObject;
import view.RenderWorld.RenderWeaponOnField;

/**
 * 場景物件繪製元件。
 *
 * 訂閱 EventCenter.p5RenderSubject, 把 RenderWorld 中的場上物件畫到 canvas。
 *
 * ===== LOD (Level of Detail) =====
 * 依 camera.zoom 切兩段, 避免縮小視野時被細節塞滿並節省 draw call:
 *   - zoom >= lodThreshold (NEAR / 近景):
 *       Machine        畫旋轉後 shape + facing 線 + id 標籤
 *       Marker         畫十字 + name 標籤
 *       Projectile     畫小圓 + velocity 線
 *       Hitbox         畫紅色 shape outline
 *       WeaponOnField  畫小方塊 + name 標籤
 *   - zoom <  lodThreshold (FAR / 遠景):
 *       一律以彩色色點代表 (顏色與近景 stroke 對齊以便辨認類型),
 *       不畫朝向 / 形狀邊界 / 文字
 *
 * lodThreshold 預設 1.0, 對應 camera.zoom = 1.0 (世界單位:像素 = 1:1)。
 * 玩家在 CameraControlPanel 按 Z-/Z+ 即可在兩個模式間切換 (參見 Camera.hx 對 cameraPos.z → zoom 的換算)。
 */
function createSceneRenderer(eventCenter:EventCenter, lodThreshold:Float = 1.0):Void {
	eventCenter.p5RenderSubject.subscribe(frame -> drawScene(frame, lodThreshold));
}

private function drawScene(frame:P5RenderFrame, lodThreshold:Float):Void {
	var p5 = frame.p5;
	var renderWorld = frame.renderWorld;
	var matrix = renderWorld.viewProjectionMatrix;
	var zoom = renderWorld.camera.zoom;
	var isNear = zoom >= lodThreshold;

	p5.push();

	for (marker in renderWorld.markers) {
		if (isNear)
			drawMarkerNear(p5, matrix, marker);
		else
			drawDot(p5, matrix, marker.position, 255, 220, 120);
	}

	for (weapon in renderWorld.weaponsOnField) {
		if (isNear)
			drawWeaponOnFieldNear(p5, matrix, weapon);
		else
			drawDot(p5, matrix, weapon.position, 255, 160, 80);
	}

	for (machine in renderWorld.machines) {
		if (isNear)
			drawMachineNear(p5, matrix, zoom, machine);
		else
			drawDot(p5, matrix, machine.position, 120, 230, 120);
	}

	for (projectile in renderWorld.projectiles) {
		if (isNear)
			drawProjectileNear(p5, matrix, projectile);
		else
			drawDot(p5, matrix, projectile.position, 120, 220, 255);
	}

	for (hitbox in renderWorld.hitboxes) {
		if (isNear)
			drawHitboxNear(p5, matrix, zoom, hitbox);
		else
			drawDot(p5, matrix, hitbox.position, 255, 100, 100);
	}

	drawLodLabel(p5, isNear, zoom, lodThreshold);

	p5.pop();
}

// ---------- 共用工具 ----------

/** 本機座標 → 世界座標 (套用機體 facing 與 position) */
private function localToWorld(origin:Vec2, facing:Float, local:Vec2):Vec2 {
	var c = Math.cos(facing);
	var s = Math.sin(facing);
	return {
		x: origin.x + local.x * c - local.y * s,
		y: origin.y + local.x * s + local.y * c
	};
}

/** 遠景共用色點繪製: 螢幕固定 5px 圓點, 不受 zoom 影響 */
private function drawDot(p5:Dynamic, matrix:Mat3, position:Vec2, r:Int, g:Int, b:Int):Void {
	var screen = transformPoint(matrix, position);
	p5.noStroke();
	p5.fill(r, g, b);
	p5.circle(screen.x, screen.y, 5.0);
}

/** 近景共用形狀繪製: Circle 與 Rect (含 facing 旋轉) */
private function drawShapeOutline(p5:Dynamic, matrix:Mat3, zoom:Float, origin:Vec2, facing:Float, shape:Shape):Void {
	switch (shape) {
		case Circle(cx, cy, radius):
			var worldCenter = localToWorld(origin, facing, {x: cx, y: cy});
			var screen = transformPoint(matrix, worldCenter);
			p5.circle(screen.x, screen.y, Math.max(4.0, radius * 2.0 * zoom));
		case Rect(rx, ry, rw, rh):
			var corners:Array<Vec2> = [
				{x: rx, y: ry},
				{x: rx + rw, y: ry},
				{x: rx + rw, y: ry + rh},
				{x: rx, y: ry + rh}
			];
			p5.beginShape();
			for (corner in corners) {
				var world = localToWorld(origin, facing, corner);
				var screen = transformPoint(matrix, world);
				p5.vertex(screen.x, screen.y);
			}
			p5.endShape(p5.CLOSE);
	}
}

// ---------- Machine ----------

private function drawMachineNear(p5:Dynamic, matrix:Mat3, zoom:Float, machine:RenderMachine):Void {
	p5.noFill();
	p5.stroke(120, 230, 120);
	p5.strokeWeight(2);
	drawShapeOutline(p5, matrix, zoom, machine.position, machine.facing, machine.shape);

	var center = transformPoint(matrix, machine.position);
	var aheadWorld = localToWorld(machine.position, machine.facing, {x: 20.0, y: 0.0});
	var aheadScreen = transformPoint(matrix, aheadWorld);
	p5.stroke(255, 200, 0);
	p5.strokeWeight(2);
	p5.line(center.x, center.y, aheadScreen.x, aheadScreen.y);

	p5.noStroke();
	p5.fill(255);
	p5.textSize(11);
	p5.text(machine.id, center.x + 8.0, center.y - 8.0);
}

// ---------- Marker ----------

private function drawMarkerNear(p5:Dynamic, matrix:Mat3, marker:RenderMarker):Void {
	var screen = transformPoint(matrix, marker.position);
	p5.stroke(255, 220, 120);
	p5.strokeWeight(2);
	p5.line(screen.x - 6.0, screen.y, screen.x + 6.0, screen.y);
	p5.line(screen.x, screen.y - 6.0, screen.x, screen.y + 6.0);

	p5.noStroke();
	p5.fill(255, 220, 120);
	p5.textSize(11);
	p5.text(marker.name, screen.x + 8.0, screen.y - 8.0);
}

// ---------- Projectile ----------

private function drawProjectileNear(p5:Dynamic, matrix:Mat3, projectile:RenderProjectileObject):Void {
	var screen = transformPoint(matrix, projectile.position);
	p5.noStroke();
	p5.fill(120, 220, 255);
	p5.circle(screen.x, screen.y, 5.0);

	var aheadWorld:Vec2 = {
		x: projectile.position.x + projectile.velocity.x * 0.1,
		y: projectile.position.y + projectile.velocity.y * 0.1
	};
	var aheadScreen = transformPoint(matrix, aheadWorld);
	p5.stroke(120, 220, 255);
	p5.strokeWeight(1);
	p5.line(screen.x, screen.y, aheadScreen.x, aheadScreen.y);
}

// ---------- Hitbox ----------

private function drawHitboxNear(p5:Dynamic, matrix:Mat3, zoom:Float, hitbox:RenderHitbox):Void {
	p5.noFill();
	p5.stroke(255, 100, 100);
	p5.strokeWeight(2);
	drawShapeOutline(p5, matrix, zoom, hitbox.position, hitbox.facing, hitbox.shape);
}

// ---------- WeaponOnField ----------

private function drawWeaponOnFieldNear(p5:Dynamic, matrix:Mat3, weapon:RenderWeaponOnField):Void {
	var screen = transformPoint(matrix, weapon.position);
	p5.noFill();
	p5.stroke(255, 160, 80);
	p5.strokeWeight(2);
	p5.rectMode(p5.CENTER);
	p5.rect(screen.x, screen.y, 8.0, 8.0);

	p5.noStroke();
	p5.fill(255, 160, 80);
	p5.textSize(10);
	p5.text(weapon.name, screen.x + 6.0, screen.y - 6.0);
}

// ---------- LOD label (debug 用, 印在 status 文字下方) ----------

private function drawLodLabel(p5:Dynamic, isNear:Bool, zoom:Float, threshold:Float):Void {
	p5.noStroke();
	p5.fill(255);
	p5.textSize(11);
	var mode = isNear ? "NEAR" : "FAR";
	p5.text('LOD: $mode  zoom=${oneDecimal(zoom)}  threshold=${oneDecimal(threshold)}', 16.0, 204.0);
}

private function oneDecimal(value:Float):Float {
	return Math.round(value * 10.0) / 10.0;
}
