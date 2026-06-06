package impl;

import domain.Collision.Hitbox;
import domain.FieldObject.CollidableObject;
import domain.Geometry.normalizeAngle;
import domain.Projectile.ProjectileObject;
import domain.Projectile.ProjectileStage;
import domain.World;
import domain.World.findCollidableObjectById;

/**
 * 維護 ProjectileObject.tracking (追蹤彈) 的轉向行為。
 *
 * 與 GoalSystem 對機體 velocity 的處理對齊:
 *   - GoalSystem    → 改 machine.velocity (依 goal 重新規劃)
 *   - HomingSystem  → 改 projectile.velocity / facing (依目標位置重新規劃)
 *   - 兩者皆只表達「意圖」, 實際 position 推進統一由 MovementSystem 在後面做。
 *
 * 因此系統執行順序應為:
 *   GoalSystem → HomingSystem → MovementSystem → HitboxSystem → CollisionSystem → ProjectileSystem
 *
 * 每幀演算 (對每個 stage = Flying 且 tracking != null 的 projectile):
 *   1. 查目標物 (machine / projectile by id);
 *      找不到 (目標已死亡 / 暫時離場) → 保留原 velocity 直線飛行, 不清 tracking,
 *      讓「目標短暫離場後又回場」也能繼續追
 *   2. desired = atan2(target.y - proj.y, target.x - proj.x)
 *      delta   = normalizeAngle(desired - proj.facing)         (wrap 到 [-π, π], 取短弧)
 *      maxStep = turnRate * dt
 *      step    = clamp(delta, [-maxStep, maxStep])
 *   3. proj.facing += step
 *      speed = |proj.velocity|                                  保留標量速度
 *      proj.velocity = { speed * cos(facing), speed * sin(facing) }
 *
 * 為什麼只改 Flying:
 *   ResolvingHit / Expired 都已經進入「結算 / 待清除」階段, 再轉向沒有意義,
 *   且這時 velocity 對視覺也已經不再重要 (馬上會生爆炸 / 被 splice)。
 *
 * 為什麼保留原 |velocity| 而不去取模板 speed:
 *   - 子母彈生出的 child 已經套用 buildChildProjectile 算出的初始速度,
 *     再去抓模板 speed 反而會覆蓋掉散布方向的力學設定
 *   - 想做「加速 / 減速彈」可以在這層之外動 velocity, 不會被 HomingSystem 覆蓋大小
 *   - 副作用: 若 velocity 起始就是 (0, 0), 追蹤系統不會幫忙加速; 由發射方保證初速 > 0
 *
 * isDirty 處理:
 *   只改 projectile 既有欄位 (facing / velocity), 非陣列增刪 → 不翻 isDirty,
 *   符合「systems 只在增刪時翻」的規則 (見 World.isDirty doc)。
 *   位置變化由後續 MovementSystem 推進, RenderWorld 透過 shallow copy 共用 reference
 *   會自動反映到下一個 P5Tick 的 render frame。
 */
class HomingSystem implements ISystem {
	static inline final MS_PER_SECOND = 1000.0;

	final world:World;

	public function new(world:World) {
		this.world = world;
	}

	public function onSetup():Void {}

	public function onClick(id:String):Void {}

	public function onTick(frameCount:Int, deltaTime:Float):Void {
		var dt = deltaTime / MS_PER_SECOND;
		for (proj in world.projectiles) {
			steer(proj, dt);
		}
	}

	public function onMousePressed(x:Float, y:Float):Void {}

	public function onMouseRelease():Void {}

	public function onMouseMoved(x:Float, y:Float):Void {}

	public function onMouseDragged(x:Float, y:Float):Void {}

	public function onCollide(a:CollidableObject, b:CollidableObject):Void {}

	public function onHitboxCollide(hitbox:Hitbox, target:CollidableObject):Void {}

	public function onDamage(hitbox:Hitbox, target:CollidableObject):Void {}

	// ====================================================================
	// 內部: 單顆追蹤彈的本幀轉向
	// ====================================================================

	function steer(proj:ProjectileObject, dt:Float):Void {
		var tracking = proj.tracking;
		if (tracking == null)
			return;
		// 已在結算 / 結束階段就不再轉向, 避免爆炸前一瞬間還在甩 velocity
		switch (proj.stage) {
			case Flying:
			case _:
				return;
		}
		var target = findCollidableObjectById(world, tracking.targetId);
		if (target == null)
			return; // 目標已不在場上 → 維持原 velocity 直線飛, 不清 tracking
		var desired = Math.atan2(target.position.y - proj.position.y, target.position.x - proj.position.x);
		var delta = normalizeAngle(desired - proj.facing);
		var maxStep = tracking.turnRate * dt;
		var step = if (delta > maxStep) maxStep
			else if (delta < -maxStep) -maxStep
			else delta;
		proj.facing += step;
		var vx = proj.velocity.x;
		var vy = proj.velocity.y;
		var speed = Math.sqrt(vx * vx + vy * vy);
		if (speed <= 0.0)
			return; // 沒初速就沒法只靠方向飛; 由發射方保證 velocity != 0
		proj.velocity = {
			x: speed * Math.cos(proj.facing),
			y: speed * Math.sin(proj.facing)
		};
	}
}
