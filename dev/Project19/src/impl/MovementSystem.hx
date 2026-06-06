package impl;

import domain.FieldObject.MovableObject;
import domain.World;
import domain.World.getMovableObjects;
import domain.World.moveMovableObject;

/**
 * 推進所有 MovableObject 位置的系統。
 *
 * 每個 tick 內:
 *   1. 從 world 取出所有 MovableObject (見 World.getMovableObjects)
 *   2. 套用 maxSpeed: 若 |velocity| > maxSpeed, 將 velocity 等比縮放到 maxSpeed,
 *      並寫回 object.velocity (對應 World.moveMovableObject doc 所述「最大速度等規則
 *      應由更上層系統先更新 velocity」的契約)
 *   3. 呼叫 World.moveMovableObject(object, dt) 推進 position
 *
 * dt 來源:
 *   ISystem.onTick 簽名僅有 frameCount, 因此 dt 由 constructor 注入,
 *   預設 1/60 秒 (對應 P5App.frameRate(60))。
 *   如需動態 dt (依實際幀間隔), 可改為傳入函式 / 由 view 層另行廣播。
 *
 * 其他 ISystem callback (click / mouse / setup) 對此系統無作用, 留空實作。
 */
class MovementSystem implements ISystem {
	final world:World;
	final dt:Float;

	public function new(world:World, dt:Float = 1.0 / 60.0) {
		this.world = world;
		this.dt = dt;
	}

	public function onSetup():Void {}

	public function onClick(id:String):Void {}

	public function onTick(frameCount:Int):Void {
		for (object in getMovableObjects(world)) {
			applyMaxSpeed(object);
			moveMovableObject(object, dt);
		}
	}

	public function onMousePressed(x:Float, y:Float):Void {}

	public function onMouseRelease():Void {}

	public function onMouseMoved(x:Float, y:Float):Void {}

	public function onMouseDragged(x:Float, y:Float):Void {}

	/**
	 * 將 object.velocity 等比縮放到不超過 object.maxSpeed。
	 *
	 *   - maxSpeed <= 0:           視為「禁止移動」, 直接清為 (0, 0)
	 *   - |velocity| <= maxSpeed:  無動作 (velocity 已在合法範圍內)
	 *   - |velocity| > maxSpeed:   等比縮放, 方向保持不變
	 *
	 * 為避免 Math.sqrt, 先用平方比較; 只在需要縮放時才算一次 sqrt。
	 */
	static function applyMaxSpeed(object:MovableObject):Void {
		var vx = object.velocity.x;
		var vy = object.velocity.y;
		var speedSq = vx * vx + vy * vy;
		var maxSpeed = object.maxSpeed;

		if (maxSpeed <= 0.0) {
			if (speedSq > 0.0) {
				object.velocity = {x: 0.0, y: 0.0};
			}
			return;
		}

		var maxSpeedSq = maxSpeed * maxSpeed;
		if (speedSq <= maxSpeedSq)
			return;

		var scale = maxSpeed / Math.sqrt(speedSq);
		object.velocity = {x: vx * scale, y: vy * scale};
	}
}
