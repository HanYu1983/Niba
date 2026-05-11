import debug.PathfinderTest;
import debug.WaypointGoalTest;
import domain.World.createEmptyWorld;
import view.EventCenter;
import view.EventCenter.P5RenderFrame;
import view.P5App.createP5App;
import view.component.CameraControlPanel.createCameraControlPanel;
import view.component.CameraController.createCameraController;

class HelloWorld {
	static public function main():Void {
		PathfinderTest.run();
		WaypointGoalTest.run();

		var eventCenter = new EventCenter();
		createCameraControlPanel(eventCenter);
		eventCenter.p5RenderSubject.subscribe(renderP5Frame);
		createCameraController(eventCenter);
		eventCenter.nextWorld(createEmptyWorld());
		createP5App(eventCenter);
	}

	static function renderP5Frame(frame:P5RenderFrame):Void {
		var p5 = frame.p5;
		var world = frame.renderWorld;

		p5.background(17);
		p5.noStroke();
		p5.fill(255);
		p5.text("Project19 p5 render smoke test", 16, 24);
		p5.text('frame: ${frame.frameCount}', 16, 44);
		p5.text('machines: ${world.machines.length}', 16, 64);
		p5.text('weaponsOnMachine: ${world.weaponsOnMachine.length}', 16, 84);
		p5.text('weaponsOnField: ${world.weaponsOnField.length}', 16, 104);
		p5.text('projectiles: ${world.projectiles.length}', 16, 124);
		p5.text('hitboxes: ${world.hitboxes.length}', 16, 144);
		p5.text('markers: ${world.markers.length}', 16, 164);
		p5.text('camera: (${world.camera.position.x}, ${world.camera.position.y}) zoom=${world.camera.zoom}', 16, 184);
	}
}
