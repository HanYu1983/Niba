import debug.PathfinderTest;
import debug.WaypointGoalTest;
import debug.WorldSerializeTest;
import domain.Geometry.Shape;
import domain.Machine;
import domain.Machine.createEmptyMachine;
import domain.World;
import domain.World.createEmptyWorld;
import impl.ISystem;
import impl.MovementSystem;
import view.EventCenter;
import view.EventCenter.Event;
import view.EventCenter.P5RenderFrame;
import view.P5App.createP5App;
import view.component.CameraControlPanel.createCameraControlPanel;
import view.component.CameraController.createCameraController;
import view.component.SceneRenderer.createSceneRenderer;

class HelloWorld {
	static public function main():Void {
		PathfinderTest.run();
		WaypointGoalTest.run();
		WorldSerializeTest.run();

		var world = createEmptyWorld();
		world.machines.push(createDemoMachine());

		var eventCenter = new EventCenter();

		var systems:Array<ISystem> = [new MovementSystem(world)];
		eventCenter.eventSubject.subscribe(event -> dispatchEventToSystems(systems, event));

		createCameraControlPanel(eventCenter);
		eventCenter.p5RenderSubject.subscribe(renderP5Frame);
		createCameraController(eventCenter);
		createSceneRenderer(eventCenter);
		eventCenter.nextWorld(world);
		createP5App(eventCenter);
	}

	/**
	 * 建立一個朝向 +X (facing=0) 並具備速度的示範機體。
	 *
	 * velocity (30, 10) 與 maxSpeed 50 — |v| ≈ 31.6 小於 maxSpeed,
	 * 因此 MovementSystem.applyMaxSpeed 不會裁切, 每秒實際位移為 (30, 10) 世界單位。
	 *
	 * shape Circle(0, 0, 15) — 讓 SceneRenderer 在近景模式下能畫出可見輪廓。
	 */
	static function createDemoMachine():Machine {
		var machine = createEmptyMachine();
		machine.id = "demo_machine";
		machine.name = "Demo Machine";
		machine.position = {x: -150.0, y: 0.0};
		machine.velocity = {x: 30.0, y: 10.0};
		machine.maxSpeed = 50.0;
		machine.shape = Circle(0.0, 0.0, 15.0);
		return machine;
	}

	/**
	 * 將 EventCenter 的 Event 依種類分派到所有 ISystem 的對應 callback。
	 *
	 * 對應關係 (與 impl.ISystem 文件保持一致):
	 *   OnClick(id)                       → onClick(id)
	 *   P5Setup(_)                        → onSetup()
	 *   P5Tick(frameCount, deltaTime)     → onTick(frameCount, deltaTime)
	 *   P5MousePressed(x,y)               → onMousePressed(x, y)
	 *   P5MouseReleased                   → onMouseRelease()
	 *   P5MouseMoved(x,y)                 → onMouseMoved(x, y)
	 *   P5MouseDragged(x,y)               → onMouseDragged(x, y)
	 *
	 * P5Touch* 系列尚未對應到 ISystem callback, 暫時略過。
	 */
	static function dispatchEventToSystems(systems:Array<ISystem>, event:Event):Void {
		for (system in systems) {
			switch (event) {
				case OnClick(id):
					system.onClick(id);
				case P5Setup(_):
					system.onSetup();
				case P5Tick(frameCount, deltaTime):
					system.onTick(frameCount, deltaTime);
				case P5MousePressed(x, y):
					system.onMousePressed(x, y);
				case P5MouseReleased:
					system.onMouseRelease();
				case P5MouseMoved(x, y):
					system.onMouseMoved(x, y);
				case P5MouseDragged(x, y):
					system.onMouseDragged(x, y);
				case P5TouchStarted(_, _) | P5TouchEnded | P5TouchMoved(_, _):
			}
		}
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
