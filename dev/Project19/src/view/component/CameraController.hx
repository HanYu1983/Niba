package view.component;

import domain.Geometry.Vec2;
import domain.World;
import view.EventCenter;
import view.EventCenter.Event;
import view.EventCenter.P5RenderFrame;
import view.Matrix2D.transformPoint;

private typedef CameraControllerInput = {
	var world:World;
	var event:Event;
}

/**
 * 處理 view event 對 world cameraPos 的控制, 並繪製 camera 測試座標系。
 */
function createCameraController(eventCenter:EventCenter, step:Float = 10.0):Void {
	eventCenter.worldSubject
		.switchMap(world -> eventCenter.eventSubject.map(event -> {world: world, event: event}))
		.subscribe(input -> handleCameraEvent(eventCenter, input, step));

	eventCenter.p5RenderSubject.subscribe(drawCameraTestGrid);
}

private function handleCameraEvent(eventCenter:EventCenter, input:CameraControllerInput, step:Float):Void {
	switch (input.event) {
		case OnClick(id):
			if (!moveCamera(input.world, id, step))
				return;

			// 遵循 World.isDirty 的不變式: 修改了 world.cameraPos 即翻 flag,
			// 實際 render 發送交給 view.component.DirtyWorldPublisher 在下一 P5Tick 收尾批次處理。
			input.world.isDirty = true;
		default:
	}
}

private function moveCamera(world:World, id:String, step:Float):Bool {
	switch (id) {
		case "camera-x-dec":
			world.cameraPos.x -= step;
		case "camera-x-inc":
			world.cameraPos.x += step;
		case "camera-y-dec":
			world.cameraPos.y -= step;
		case "camera-y-inc":
			world.cameraPos.y += step;
		case "camera-z-dec":
			world.cameraPos.z -= step;
		case "camera-z-inc":
			world.cameraPos.z += step;
		default:
			return false;
	}

	return true;
}

private function drawCameraTestGrid(frame:P5RenderFrame):Void {
	var p5 = frame.p5;
	var matrix = frame.renderWorld.viewProjectionMatrix;

	p5.push();
	p5.noStroke();

	for (x in -10...11) {
		for (y in -10...11) {
			var worldPoint:Vec2 = {x: x * 10.0, y: y * 10.0};
			var screenPoint = transformPoint(matrix, worldPoint);
			var isDark = (x + y) % 2 == 0;

			p5.fill(isDark ? 80 : 180);
			p5.circle(screenPoint.x, screenPoint.y, 4);
		}
	}

	drawAxis(p5, matrix);
	p5.pop();
}

private function drawAxis(p5:Dynamic, matrix):Void {
	var origin = transformPoint(matrix, {x: 0.0, y: 0.0});
	var xEnd = transformPoint(matrix, {x: 120.0, y: 0.0});
	var yEnd = transformPoint(matrix, {x: 0.0, y: 120.0});

	p5.strokeWeight(2);
	p5.stroke(255, 80, 80);
	p5.line(origin.x, origin.y, xEnd.x, xEnd.y);
	p5.stroke(80, 255, 80);
	p5.line(origin.x, origin.y, yEnd.x, yEnd.y);
}
