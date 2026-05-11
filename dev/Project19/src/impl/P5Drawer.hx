package impl;

import domain.FieldObject.DrawableObject;
import domain.Geometry.Shape;
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
		p5.push();
		p5.translate(object.position.x, object.position.y);
		p5.rotate(object.facing);

		drawShapeIfPresent(p5, object);
		drawFacing(p5);
		drawLabel(p5, object);

		p5.pop();
	};
}

private function drawShapeIfPresent(p5:Dynamic, object:DrawableObject):Void {
	if (!Reflect.hasField(object, "shape"))
		return;

	var shape:Shape = cast Reflect.field(object, "shape");

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

private function drawLabel(p5:Dynamic, object:DrawableObject):Void {
	if (object.name == "")
		return;

	p5.push();
	p5.rotate(-object.facing);
	p5.noStroke();
	p5.fill(255);
	p5.text(object.name, 6, -6);
	p5.pop();
}
