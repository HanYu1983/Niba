package view.component;

import domain.Damage.DamageType;
import domain.Geometry.Shape;
import domain.Projectile.OnHit;
import domain.Projectile.Projectile;
import domain.Projectile.ProjectileObject;
import domain.Projectile.ProjectileStage;
import domain.World;
import view.EventCenter;
import view.EventCenter.Event;

/** 空白鍵的 p5 keyCode (browser KeyboardEvent.keyCode) */
private inline final SPACE_KEY_CODE = 32;

/**
 * 偵錯用發射物產生器。
 *
 * 在使用者按下空白鍵 (P5KeyPressed.keyCode == 32) 時, 從世界原點朝 +X 方向
 * 射出一顆 Solid Projectile, 用來驗證:
 *   - MovementSystem 是否正確推進 ProjectileObject.position (velocity * dt)
 *   - CollisionSystem 是否在飛行物碰到其他 collidable 時發 onCollide
 *   - ProjectileSystem 是否把 stage 從 Flying → ResolvingHit → Expired
 *   - OnHit.Spawn 是否能在命中點生出新的 Hitbox
 *
 * 設計選擇:
 *   - 不註冊為 ISystem; key 事件目前不在 ISystem 介面內 (見 ISystem doc),
 *     view 層的元件直接訂閱 eventSubject 是現有慣例 (參考 CameraController)
 *   - 訂閱模式: worldSubject.switchMap(eventSubject), 與 CameraController 一致;
 *     確保產生 projectile 時拿到的是 BehaviorSubject 上最新的 world 參考
 *   - 產生後呼叫 eventCenter.nextWorld(world) 觸發 render world 更新, 讓畫面立即看到
 *
 * 注意:
 *   - 瀏覽器在按鍵 hold 住時會自動重複 keydown, 因而連續產生多顆 projectile;
 *     若覺得太多, 可在此處加 cooldown 或 rate-limit. 目前留作 debug 用途的自然行為
 *   - id 用一個 closure-local counter 保證單一 session 內遞增唯一
 */
function createDebugProjectile(eventCenter:EventCenter):Void {
	var counter = {value: 0};
	eventCenter.worldSubject
		.switchMap(world -> eventCenter.eventSubject.map(event -> {world: world, event: event}))
		.subscribe(input -> handleEvent(eventCenter, input.world, input.event, counter));
}

private typedef Counter = {value:Int};

private function handleEvent(eventCenter:EventCenter, world:World, event:Event, counter:Counter):Void {
	switch (event) {
		case P5KeyPressed(_, keyCode) if (keyCode == SPACE_KEY_CODE):
			counter.value++;
			world.projectiles.push(buildDebugProjectile(counter.value));
			eventCenter.nextWorld(world);
		default:
	}
}

/**
 * 建立一顆 demo projectile。
 *
 * 屬性 (寫死於此, 不對外暴露):
 *   - position (0, 0), velocity (200, 0), maxSpeed 200 → 朝 +X 方向飛行
 *   - shape Circle(0, 0, 4)                            → 半徑 4 的圓
 *   - projectile = Solid(200, Physical 10,
 *                        Spawn([explosionHitbox]))     → 命中後留下半徑 30 / duration 0.1 的爆炸 Hitbox
 *
 * @param sequence 此次 session 內的順序編號, 用來組出唯一 id
 */
private function buildDebugProjectile(sequence:Int):ProjectileObject {
	return {
		id: 'debug_projectile_$sequence',
		name: "Debug Projectile",
		position: {x: 0.0, y: 0.0},
		facing: 0.0,
		velocity: {x: 200.0, y: 0.0},
		maxSpeed: 200.0,
		shape: Circle(0.0, 0.0, 4.0),
		projectile: Solid(200.0, {type: Physical, amount: 10.0}, Spawn([
			{
				id: 'debug_explosion_$sequence',
				name: "Debug Explosion",
				position: {x: 0.0, y: 0.0},
				facing: 0.0,
				shape: Circle(0.0, 0.0, 30.0),
				duration: 0.1,
				cooldownPerTarget: Math.POSITIVE_INFINITY,
				damage: {type: Explosion, amount: 50.0},
				reactions: []
			}
		])),
		age: 0.0,
		stage: Flying
	};
}
