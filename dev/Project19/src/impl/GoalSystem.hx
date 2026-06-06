package impl;

import domain.Collision.Hitbox;
import domain.FieldObject.CollidableObject;
import domain.Goal.LeafFactory;
import domain.Goal.PlannerFactory;
import domain.World;
import domain.World.tickGoals;

/**
 * 推進所有 Goal 的系統。
 *
 * 每個 tick 內呼叫 World.tickGoals, 對 world.goalNodes 中的每個根節點
 * 跑一次 runFrame, 並將已完成 (Succeeded / Failed) 的節點從列表移除。
 *
 * dt 來源:
 *   由 ISystem.onTick 帶進來的 deltaTime (毫秒, 來自 p5.deltaTime)。
 *   本系統內部轉換為秒 (deltaTime / 1000) 後再交給 tickGoals,
 *   讓 LeafLifecycle.tick 的 dt 與 game design / MovementSystem 使用一致的「秒」單位。
 *
 * 依賴注入:
 *   - leafFactory:    leaf 名稱 → LeafLifecycle 的解析器, 通常是 impl.SharedLeafFactory.sharedLeafFactory
 *   - plannerFactory: Custom composite planner 名稱 → GoalPlanner 的解析器
 *   由建構式注入, 讓不同 runtime / 測試環境可以接入不同實作 (例如 mock 工廠)。
 *
 * 與 MovementSystem 的關係:
 *   Goal (例如 MoveToPointGoal) 只負責「設定 velocity 表達意圖」,
 *   實際位移由 MovementSystem 在同一個 tick 內讀 velocity 推 position。
 *   建議的執行順序: GoalSystem → MovementSystem,
 *   讓本幀新計算出的 velocity 同幀就被 MovementSystem 套用,
 *   而非晚一幀; 在 HelloWorld 組裝 systems 陣列時注意這個順序。
 *
 * 其他 ISystem callback (click / mouse / setup) 對此系統無作用, 留空實作。
 */
class GoalSystem implements ISystem {
	static inline final MS_PER_SECOND = 1000.0;

	final world:World;
	final leafFactory:LeafFactory;
	final plannerFactory:PlannerFactory;

	public function new(world:World, leafFactory:LeafFactory, plannerFactory:PlannerFactory) {
		this.world = world;
		this.leafFactory = leafFactory;
		this.plannerFactory = plannerFactory;
	}

	public function onSetup():Void {}

	public function onClick(id:String):Void {}

	public function onTick(frameCount:Int, deltaTime:Float):Void {
		var dt = deltaTime / MS_PER_SECOND;
		// 在 tickGoals 之前先讀取「本幀是否有 goal 要跑」, 因為 tickGoals 可能會把
		// 已完成的節點移除而導致 length 變 0, 失去翻 isDirty 的依據。
		// 任一 goal 跑 runFrame 都可能更新 leafState / status, 並且絕大多數 lifecycle
		// 會寫 actor.velocity 等 world 衍生欄位, 故統一視為本幀有 mutation。
		var hadGoals = world.goalNodes.length > 0;
		tickGoals(world, dt, leafFactory, plannerFactory);
		if (hadGoals)
			world.isDirty = true;
	}

	public function onMousePressed(x:Float, y:Float):Void {}

	public function onMouseRelease():Void {}

	public function onMouseMoved(x:Float, y:Float):Void {}

	public function onMouseDragged(x:Float, y:Float):Void {}

	public function onCollide(a:CollidableObject, b:CollidableObject):Void {}

	public function onHitboxCollide(hitbox:Hitbox, target:CollidableObject):Void {}
}
