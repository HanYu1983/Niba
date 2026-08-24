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
		// 只在本幀 world.goalNodes 「實際被增刪」時翻 isDirty
		// (對應 World.isDirty 的「增刪才翻」收斂規則):
		//   - tickGoals 內部會把 isFinal 的節點從陣列 splice 掉, 此時 length 會減少
		//   - leaf lifecycle 透過 actor.velocity 等寫入的修改不算增刪, 由參考經 MovementSystem
		//     傳遞到 render snapshot, 不需要重新發 nextWorld
		var prevGoalCount = world.goalNodes.length;
		tickGoals(world, dt, leafFactory, plannerFactory);
		if (world.goalNodes.length != prevGoalCount)
			world.isDirty = true;
	}

	public function onMousePressed(x:Float, y:Float):Void {}

	public function onMouseRelease():Void {}

	public function onMouseMoved(x:Float, y:Float):Void {}

	public function onMouseDragged(x:Float, y:Float):Void {}

	public function onCollide(a:CollidableObject, b:CollidableObject):Void {}

	public function onHitboxCollide(hitbox:Hitbox, target:CollidableObject):Void {}

	public function onDamage(hitbox:Hitbox, target:CollidableObject):Void {}
}
