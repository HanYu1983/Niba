import debug.HomingProjectileTest;
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
import impl.HitboxSystem;
import impl.HomingSystem;
import impl.ICollisionListener;
import impl.IHitboxDamageListener;
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
import view.component.DebugProjectile.createDebugProjectile;
import view.component.DirtyWorldPublisher.createDirtyWorldPublisher;
import view.component.SceneRenderer.createSceneRenderer;

class HelloWorld {
	static public function main():Void {
		PathfinderTest.run();
		WorldSerializeTest.run();
		HomingProjectileTest.run();

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
		//   1. GoalSystem       — 更新 machine.velocity (依 goal 目標重新規劃)
		//   2. HomingSystem     — 更新 projectile.velocity / facing (追蹤彈依目標位置)
		//                         必須排在 MovementSystem 之前, 與 GoalSystem 同層: 兩者只表達意圖
		//   3. MovementSystem   — 套用 velocity 推 position (一次性消化上面兩個系統的決策)
		//   4. HitboxSystem     — Hitbox age / duration 過期清除 (必須排在 CollisionSystem 之前,
		//                         確保已過期的 Hitbox 不會被本幀的碰撞偵測誤判)
		//   5. CollisionSystem  — 對最新 position 做碰撞偵測, 透過 collisionListener 廣播
		//                         (HitboxSystem 透過 onHitboxCollide 收到事件, 過濾 cooldown
		//                          後再透過 damageListener 廣播 onDamage)
		//   6. ProjectileSystem — 跟蹤 projectile 階段, 依 onCollide 結果完成 OnHit
		//                         (必須排在 CollisionSystem 之後, 才能在同一幀內收到
		//                          onCollide 設好 stage, 再於 onTick 跑完 OnHit)
		//
		// CollisionSystem / HitboxSystem 都需要 listener 才能建構, 但 listener 又需要看到
		// systems 陣列 (要 fan-out 給所有系統), 故先建陣列 + GoalSystem + HomingSystem + MovementSystem,
		// 再以該陣列建 fan-out listeners, 最後把後續系統推進同一個陣列。
		// 由於 listener 持有的是 systems 陣列的「參考」, push 後新加入的系統也會被廣播。
		var systems:Array<ISystem> = [
			new GoalSystem(world, sharedLeafFactory, GoalDemo.plannerFactory),
			new HomingSystem(world),
			new MovementSystem(world)
		];
		var collisionListener:ICollisionListener = new FanOutCollisionListener(systems);
		var damageListener:IHitboxDamageListener = new FanOutDamageListener(systems);
		systems.push(new HitboxSystem(world, damageListener));
		systems.push(new CollisionSystem(world, collisionListener));
		systems.push(new ProjectileSystem(world));
		eventCenter.eventSubject.subscribe(event -> dispatchEventToSystems(systems, event));

		createCameraControlPanel(eventCenter);
		eventCenter.p5RenderSubject.subscribe(renderP5Frame);
		createCameraController(eventCenter);
		createSceneRenderer(eventCenter);
		createDebugProjectile(eventCenter);
		// DirtyWorldPublisher 必須在 dispatchEventToSystems 訂閱「之後」才接上,
		// 以利用 Observable.subscribe 的 FIFO 訂閱順序: 同一個 P5Tick 來臨時,
		// 所有 system 先跑完 (可能翻起 world.isDirty), 接著本元件才檢查 flag 並
		// 批次 nextWorld 出去。view event 元件 (CameraController / DebugProjectile)
		// 順序排在前面對結果無影響, 它們只回應 OnClick / P5KeyPressed, 不消費 P5Tick。
		createDirtyWorldPublisher(eventCenter, world);
		// 初始 emit 一次, 把 worldSubject 的 current 從 createEmptyWorld() (BehaviorSubject
		// 內部初始值) 切到 HelloWorld 真正持有的 world 參考, 讓所有用 switchMap(worldSubject)
		// 訂閱事件的 view 元件 (CameraController / DebugProjectile) 在第一次事件來之前
		// 就已切回正確 world. 後續的 render emit 全部交給 DirtyWorldPublisher 的 isDirty 路徑。
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
				case P5KeyPressed(_, _) | P5KeyReleased(_, _):
					// 目前 ISystem 沒有 onKey* 介面; 鍵盤事件由 view/component
					// (例: DebugProjectile) 直接訂閱 eventSubject 處理
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

/**
 * 傷害事件 fan-out listener。
 *
 * HitboxSystem 在 cooldown 過濾後決定「本次相交確實要結算傷害」時呼叫此 listener,
 * 由本類別把同一筆事件廣播給整個 systems 陣列裡每一個 ISystem (因為 ISystem extends
 * IHitboxDamageListener, 每個系統皆有 onDamage 接口)。
 *
 * 設計動機 / 注意事項 與 FanOutCollisionListener 相同 — 把「事件源」與「消費者集合」
 * 透過介面解耦; HitboxSystem 自身的 onDamage 也是空實作 (它是事件源, 不是消費者)。
 *
 * 目前還沒有任何系統實際消費 onDamage (HP / 計分 / 特效 等都尚未建立),
 * 但保留 fan-out 通道讓日後加入消費者時無需動到 HitboxSystem 與本管線。
 */
class FanOutDamageListener implements IHitboxDamageListener {
	final systems:Array<ISystem>;

	public function new(systems:Array<ISystem>) {
		this.systems = systems;
	}

	public function onDamage(hitbox:Hitbox, target:CollidableObject):Void {
		for (system in systems)
			system.onDamage(hitbox, target);
	}
}
