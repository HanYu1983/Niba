import debug.PathfinderTest;
import debug.WorldSerializeTest;
import domain.Collision.Hitbox;
import domain.FieldObject.CollidableObject;
import domain.Geometry.Shape;
import domain.Machine;
import domain.Machine.createEmptyMachine;
import domain.World;
import domain.World.createEmptyWorld;
import impl.CollisionSystem;
import impl.GoalSystem;
import impl.ICollisionListener;
import impl.ISystem;
import impl.MoveToPointsGoal.createMoveToPointsGoal;
import impl.MovementSystem;
import impl.ProjectileSystem;
import impl.SharedLeafFactory.sharedLeafFactory;
import sample.GoalDemo;
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
		WorldSerializeTest.run();

		var world = createEmptyWorld();
		var demoMachine = createDemoMachine();
		world.machines.push(demoMachine);
		// 給 demo 機體掛一個「依序走過多個點」的 Sequence goal, 由 GoalSystem 每幀
		// 重新計算 velocity (內部由 MoveToPoint leaf 完成), 再由 MovementSystem 推進 position
		world.goalNodes.push(createMoveToPointsGoal(demoMachine.id, [
			{x: 200.0, y: 100.0},
			{x: 0.0, y: 200.0},
			{x: -200.0, y: 100.0},
			{x: -150.0, y: 0.0}
		]));

		var eventCenter = new EventCenter();

		// 系統執行順序:
		//   1. GoalSystem       — 更新 velocity (依 goal 目標重新規劃)
		//   2. MovementSystem   — 套用 velocity 推 position
		//   3. CollisionSystem  — 對最新 position 做碰撞偵測, 透過 listener 廣播
		//   4. ProjectileSystem — 跟蹤 projectile 階段, 依 onCollide 結果完成 OnHit
		//                         (必須排在 CollisionSystem 之後, 才能在同一幀內收到
		//                          onCollide 設好 stage, 再於 onTick 跑完 OnHit)
		//
		// CollisionSystem 需要 listener 才能建構, 但 listener 又需要看到 systems 陣列
		// (要 fan-out 給所有系統), 故先建陣列 + GoalSystem + MovementSystem, 再以
		// 該陣列建 fan-out listener, 最後把後續系統推進同一個陣列。
		// 由於 listener 持有的是 systems 陣列的參考, push 後新加入的系統也會被廣播。
		var systems:Array<ISystem> = [
			new GoalSystem(world, sharedLeafFactory, GoalDemo.plannerFactory),
			new MovementSystem(world)
		];
		var collisionListener:ICollisionListener = new FanOutCollisionListener(systems);
		systems.push(new CollisionSystem(world, collisionListener));
		systems.push(new ProjectileSystem(world));
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

/**
 * 碰撞事件 fan-out listener。
 *
 * CollisionSystem 偵測到碰撞時呼叫此 listener, 由本類別把同一筆事件廣播給
 * 整個 systems 陣列裡每一個 ISystem (因為 ISystem extends ICollisionListener,
 * 每個系統皆有 onCollide / onHitboxCollide 接口)。
 *
 * 設計動機:
 *   - CollisionSystem 不直接持有 systems 陣列, 而是只依賴 ICollisionListener 介面,
 *     避免「事件源」與「消費者集合」緊耦合
 *   - 不關心系統的具體型別; 任何 ISystem 都可以靜默忽略事件 (空實作),
 *     或在 onCollide / onHitboxCollide 內過濾自己關心的對象進行處理
 *
 * 注意:
 *   持有的是 systems 陣列「參考」, 故 CollisionSystem push 進來後也會被 fan-out 到 —
 *   但 CollisionSystem 自身的 onCollide / onHitboxCollide 為空實作 (它是事件源, 不是消費者),
 *   故對 CollisionSystem 的回呼沒有副作用。
 */
class FanOutCollisionListener implements ICollisionListener {
	final systems:Array<ISystem>;

	public function new(systems:Array<ISystem>) {
		this.systems = systems;
	}

	public function onCollide(a:CollidableObject, b:CollidableObject):Void {
		for (system in systems)
			system.onCollide(a, b);
	}

	public function onHitboxCollide(hitbox:Hitbox, target:CollidableObject):Void {
		for (system in systems)
			system.onHitboxCollide(hitbox, target);
	}
}
