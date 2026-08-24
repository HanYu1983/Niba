package impl;

import domain.Collision.Hitbox;
import domain.FieldObject.CollidableObject;
import domain.Geometry.Vec2;
import domain.World;
import domain.World.getCollidableObjects;

/**
 * 碰撞偵測系統。
 *
 * 每個 tick 對 world 內所有 CollidableObject 做兩類偵測, 並透過 listener 通知:
 *   1. 一般 collidable 對碰   → listener.onCollide(a, b)
 *      對象取自 World.getCollidableObjects (目前為 machines + projectiles),
 *      每對 (i, j) i<j 只通知一次以避免重複
 *   2. Hitbox 對 collidable  → listener.onHitboxCollide(hitbox, target)
 *      把 world.hitboxes × getCollidableObjects(world) 都跑一輪
 *
 *   兩條路徑明確分流: getCollidableObjects 不含 hitboxes, world.hitboxes 不含一般物,
 *   故同一筆碰撞不會同時觸發 onCollide 與 onHitboxCollide。
 *
 * 偵測精度:
 *   每個 CollidableObject 取「世界座標下的包圍圓 (bounding circle)」做圓 vs 圓相交測試。
 *     - Circle: 直接使用本機座標的 (cx, cy) 與半徑
 *     - Rect:   取矩形中心點為包圍圓圓心, 對角線一半為半徑
 *   再以 facing 將本機座標的圓心旋轉到世界座標。
 *
 *   這是粗略近似 (對長條 Rect 過於寬鬆), 但統一了 Rect / Circle 的處理, 適合作為
 *   broad-phase. 日後若需精確碰撞 (SAT / GJK / 圓-矩形分案討論等) 可擴充
 *   overlap / shape 的對應 case.
 *
 * 設計選擇:
 *   - 不在本系統做傷害結算 / 推擠 / Hitbox cooldownPerTarget 記帳 — 那些是接收 listener
 *     的戰鬥 / 物理系統的職責。本系統純粹「找出本幀有碰撞的物件對, 並通知」。
 *   - CollisionSystem 本身也 implements ISystem, 故繼承了 onCollide / onHitboxCollide,
 *     但這兩個方法給空實作: 它是事件源, 不是消費者。
 *
 * 系統執行順序 (在 HelloWorld 的 systems 陣列):
 *   GoalSystem (更新 velocity) → MovementSystem (套用 velocity 推 position)
 *   → CollisionSystem (對最新 position 做碰撞偵測)
 *
 *   這樣偵測對齊的是「本幀套用 velocity 之後」的位置, 與玩家視覺一致。
 */
class CollisionSystem implements ISystem {
	final world:World;
	final listener:ICollisionListener;

	public function new(world:World, listener:ICollisionListener) {
		this.world = world;
		this.listener = listener;
	}

	public function onSetup():Void {}

	public function onClick(id:String):Void {}

	public function onTick(frameCount:Int, deltaTime:Float):Void {
		var collidables = getCollidableObjects(world);
		var hitboxes = world.hitboxes;

		for (i in 0...collidables.length) {
			for (j in (i + 1)...collidables.length) {
				if (overlap(collidables[i], collidables[j]))
					listener.onCollide(collidables[i], collidables[j]);
			}
		}

		for (hitbox in hitboxes) {
			for (target in collidables) {
				if (overlap(hitbox, target))
					listener.onHitboxCollide(hitbox, target);
			}
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
	// 內部: 世界座標包圍圓相交測試
	// ====================================================================

	/** 兩個 CollidableObject 的世界座標包圍圓是否相交 (含相切) */
	static function overlap(a:CollidableObject, b:CollidableObject):Bool {
		var ca = worldBoundingCircle(a);
		var cb = worldBoundingCircle(b);
		var dx = ca.center.x - cb.center.x;
		var dy = ca.center.y - cb.center.y;
		var radiusSum = ca.radius + cb.radius;
		return (dx * dx + dy * dy) <= radiusSum * radiusSum;
	}

	/**
	 * 由 CollidableObject 計算世界座標的包圍圓 (center, radius)。
	 *
	 * 流程:
	 *   1. 依 shape 取出本機座標的圓心 (localCx, localCy) 與半徑 radius
	 *      - Circle: 直接使用 enum 攜帶的 (cx, cy, r)
	 *      - Rect:   圓心 = (rx + w/2, ry + h/2); 半徑 = 對角線一半
	 *   2. 依 obj.facing 將本機圓心旋轉, 再以 obj.position 平移到世界座標
	 */
	static function worldBoundingCircle(obj:CollidableObject):{center:Vec2, radius:Float} {
		var localCx:Float;
		var localCy:Float;
		var radius:Float;
		switch (obj.shape) {
			case Circle(cx, cy, r):
				localCx = cx;
				localCy = cy;
				radius = r;
			case Rect(rx, ry, w, h):
				localCx = rx + w * 0.5;
				localCy = ry + h * 0.5;
				radius = Math.sqrt(w * w + h * h) * 0.5;
		}
		var cos = Math.cos(obj.facing);
		var sin = Math.sin(obj.facing);
		return {
			center: {
				x: obj.position.x + localCx * cos - localCy * sin,
				y: obj.position.y + localCx * sin + localCy * cos
			},
			radius: radius
		};
	}
}
