package view;

import domain.World;
import view.EventCenter.Event;

private typedef CameraControllerInput = {
	var world:World;
	var event:Event;
}

/**
 * 處理 view event 對 world cameraPos 的控制。
 */
function createCameraController(eventCenter:EventCenter, step:Float = 10.0):Void {
	eventCenter.worldSubject
		.switchMap(world -> eventCenter.eventSubject.map(event -> {world: world, event: event}))
		.subscribe(input -> handleCameraEvent(eventCenter, input, step));
}

private function handleCameraEvent(eventCenter:EventCenter, input:CameraControllerInput, step:Float):Void {
	switch (input.event) {
		case OnClick(id):
			if (!moveCamera(input.world, id, step))
				return;

			eventCenter.nextWorld(input.world);
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
