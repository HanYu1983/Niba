package impl;

import domain.Collision.Hitbox;
import domain.FieldObject.CollidableObject;
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
 *   由 ISystem.onTick 帶進來的 deltaTime (毫秒, 來自 p5.deltaTime)。
 *   本系統內部轉換為秒 (deltaTime / 1000) 後再交給 moveMovableObject,
 *   讓 velocity / maxSpeed 以「每秒世界單位」為單位閱讀, 與 game design 慣例一致。
 *
 * 其他 ISystem callback (click / mouse / setup) 對此系統無作用, 留空實作。
 */
class MovementSystem implements ISystem {
	static inline final MS_PER_SECOND = 1000.0;

	final world:World;

	public function new(world:World) {
		this.world = world;
	}

	public function onSetup():Void {}

	public function onClick(id:String):Void {}

	public function onTick(frameCount:Int, deltaTime:Float):Void {
		var dt = deltaTime / MS_PER_SECOND;
		for (object in getMovableObjects(world)) {
			applyMaxSpeed(object);
			moveMovableObject(object, dt);
		}
		// 不翻 world.isDirty: MovementSystem 只改 object.position / velocity 等屬性,
		// 並未在 world 的陣列上增刪元素。RenderWorld 對陣列做 .copy() 是 shallow copy,
		// 元素仍是同一份 reference, 因此位置變化會透過參考即時反映到下一個 P5Tick 的 render frame,
		// 不需要重新發 nextWorld 來重建 snapshot。
		// (世界級增刪 → 翻 isDirty 的規則見 domain.World.isDirty doc)
	}

	public function onMousePressed(x:Float, y:Float):Void {}

	public function onMouseRelease():Void {}

	public function onMouseMoved(x:Float, y:Float):Void {}

	public function onMouseDragged(x:Float, y:Float):Void {}

	public function onCollide(a:CollidableObject, b:CollidableObject):Void {}

	public function onHitboxCollide(hitbox:Hitbox, target:CollidableObject):Void {}

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
