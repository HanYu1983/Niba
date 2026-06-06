package debug;

import domain.Damage.DamageType;
import domain.Geometry.Shape;
import domain.Geometry.normalizeAngle;
import domain.Machine.createEmptyMachine;
import domain.Projectile.OnHit;
import domain.Projectile.Projectile;
import domain.Projectile.ProjectileObject;
import domain.Projectile.ProjectileStage;
import domain.World;
import domain.World.createEmptyWorld;
import impl.HomingSystem;

/**
 * HomingSystem 與 normalizeAngle 的純邏輯驗證 (browser-free)。
 *
 * 不仰賴 p5 / view 層, 直接構造 World + ProjectileObject + Machine,
 * 呼叫 HomingSystem.onTick 觀察 facing / velocity 變化。
 *
 * 驗證項目:
 *   - Geometry.normalizeAngle: 各角度 wrap 到 [-π, π] 是否正確
 *   - HomingSystem:
 *     - 目標位置正前方 → 不轉向
 *     - 目標位置 90°   → 一次 dt 內 step 受 turnRate * dt 限制
 *     - turnRate 極大 → 一次轉到目標方向 (snap-lock)
 *     - tracking == null → 不動 facing / velocity
 *     - 目標 id 找不到 → 不動 facing / velocity (預期: 直線繼續飛)
 *     - stage != Flying → 不動 facing / velocity
 *     - 標量速度保留: |velocity| 在 onTick 前後一致
 */
class HomingProjectileTest {
	static inline final EPS = 1e-6;

	public static function run():Void {
		trace("=== Homing Projectile Test ===");
		testNormalizeAngle();
		testNoTurnWhenAligned();
		testStepClampedByTurnRate();
		testSnapLockWithLargeTurnRate();
		testIgnoreWhenNoTracking();
		testIgnoreWhenTargetMissing();
		testIgnoreWhenNotFlying();
		testSpeedPreserved();
		trace("=== Homing Projectile Test DONE ===");
	}

	// ====================================================================
	// normalizeAngle: 純函式測試
	// ====================================================================

	static function testNormalizeAngle():Void {
		trace("--- [normalizeAngle] wrap to [-π, π] ---");
		assertNear("0",       normalizeAngle(0.0),                   0.0);
		assertNear("2π → 0",  normalizeAngle(2.0 * Math.PI),         0.0);
		assertNear("-2π → 0", normalizeAngle(-2.0 * Math.PI),        0.0);
		// π / -π 在數學上代表同一方向; normalizeAngle 採 [-π, π) 半開區間, π 會落到 -π
		assertNear("π → -π",      normalizeAngle(Math.PI),           -Math.PI);
		assertNear("-π → -π",     normalizeAngle(-Math.PI),          -Math.PI);
		assertNear("3π/2 → -π/2", normalizeAngle(1.5 * Math.PI),     -0.5 * Math.PI);
		assertNear("-3π/2 → π/2", normalizeAngle(-1.5 * Math.PI),    0.5 * Math.PI);
		assertNear("5π → -π",     normalizeAngle(5.0 * Math.PI),     -Math.PI);
	}

	// ====================================================================
	// HomingSystem.onTick: 行為測試
	// ====================================================================

	/** 目標就在 +X 方向, 與 proj.facing=0 對齊 → 不應有任何轉向 */
	static function testNoTurnWhenAligned():Void {
		trace("--- [HomingSystem] target ahead → no turn ---");
		var world = createEmptyWorld();
		var target = makeTarget("t1", 100.0, 0.0);
		world.machines.push(target);
		var proj = makeHomingProjectile("p1", 0.0, 0.0, 0.0, 100.0, "t1", Math.PI);
		world.projectiles.push(proj);

		var hs = new HomingSystem(world);
		hs.onTick(0, 1000.0); // dt = 1.0s

		assertNear("facing unchanged", proj.facing, 0.0);
		assertNear("velocity.x unchanged", proj.velocity.x, 100.0);
		assertNear("velocity.y unchanged", proj.velocity.y, 0.0);
	}

	/** 目標在 +Y (90°), turnRate=0.5 rad/s, dt=1.0s → 一次最多轉 0.5 rad (受 turnRate clamp) */
	static function testStepClampedByTurnRate():Void {
		trace("--- [HomingSystem] step clamped to turnRate * dt ---");
		var world = createEmptyWorld();
		var target = makeTarget("t1", 0.0, 100.0);
		world.machines.push(target);
		var proj = makeHomingProjectile("p1", 0.0, 0.0, 0.0, 100.0, "t1", 0.5);
		world.projectiles.push(proj);

		var hs = new HomingSystem(world);
		hs.onTick(0, 1000.0); // dt = 1.0s, maxStep = 0.5 rad

		// desired=π/2≈1.5708, maxStep=0.5 → facing=0+0.5=0.5
		assertNear("facing clamped to maxStep", proj.facing, 0.5);
		// velocity 大小應該保留 100, 方向跟著 facing
		assertNear("velocity.x = 100·cos(0.5)", proj.velocity.x, 100.0 * Math.cos(0.5));
		assertNear("velocity.y = 100·sin(0.5)", proj.velocity.y, 100.0 * Math.sin(0.5));
	}

	/** turnRate 很大, 一次 dt 就足以轉到 desired (delta < maxStep) → snap 到 π/2 */
	static function testSnapLockWithLargeTurnRate():Void {
		trace("--- [HomingSystem] large turnRate → snap to desired ---");
		var world = createEmptyWorld();
		var target = makeTarget("t1", 0.0, 100.0);
		world.machines.push(target);
		var proj = makeHomingProjectile("p1", 0.0, 0.0, 0.0, 100.0, "t1", 1e9);
		world.projectiles.push(proj);

		var hs = new HomingSystem(world);
		hs.onTick(0, 1000.0);

		assertNear("facing snapped to π/2", proj.facing, 0.5 * Math.PI);
		assertNear("velocity.x ≈ 0", proj.velocity.x, 0.0);
		assertNear("velocity.y ≈ 100", proj.velocity.y, 100.0);
	}

	/** tracking == null → HomingSystem 不該動 facing / velocity */
	static function testIgnoreWhenNoTracking():Void {
		trace("--- [HomingSystem] tracking == null → ignored ---");
		var world = createEmptyWorld();
		world.machines.push(makeTarget("t1", 0.0, 100.0));
		var proj = makePlainProjectile("p1", 0.0, 0.0, 0.0, 100.0);
		world.projectiles.push(proj);

		var hs = new HomingSystem(world);
		hs.onTick(0, 1000.0);

		assertNear("facing unchanged", proj.facing, 0.0);
		assertNear("velocity.x unchanged", proj.velocity.x, 100.0);
		assertNear("velocity.y unchanged", proj.velocity.y, 0.0);
	}

	/** target id 找不到 → HomingSystem 保留原 velocity 直線飛 */
	static function testIgnoreWhenTargetMissing():Void {
		trace("--- [HomingSystem] target missing → keep original velocity ---");
		var world = createEmptyWorld();
		// 不放任何 machine, 故 t1 不存在
		var proj = makeHomingProjectile("p1", 0.0, 0.0, 0.0, 100.0, "missing_id", Math.PI);
		world.projectiles.push(proj);

		var hs = new HomingSystem(world);
		hs.onTick(0, 1000.0);

		assertNear("facing unchanged", proj.facing, 0.0);
		assertNear("velocity.x unchanged", proj.velocity.x, 100.0);
		assertNear("velocity.y unchanged", proj.velocity.y, 0.0);
	}

	/** stage != Flying → 不轉向 (避免結算 / 過期前一瞬間還在甩) */
	static function testIgnoreWhenNotFlying():Void {
		trace("--- [HomingSystem] stage != Flying → ignored ---");
		var world = createEmptyWorld();
		world.machines.push(makeTarget("t1", 0.0, 100.0));
		var proj = makeHomingProjectile("p1", 0.0, 0.0, 0.0, 100.0, "t1", Math.PI);
		proj.stage = ResolvingHit(0);
		world.projectiles.push(proj);

		var hs = new HomingSystem(world);
		hs.onTick(0, 1000.0);

		assertNear("facing unchanged", proj.facing, 0.0);
		assertNear("velocity.x unchanged", proj.velocity.x, 100.0);
	}

	/** 任意轉向後 |velocity| 仍應等於初始 speed */
	static function testSpeedPreserved():Void {
		trace("--- [HomingSystem] |velocity| preserved across steer ---");
		var world = createEmptyWorld();
		world.machines.push(makeTarget("t1", 50.0, 50.0)); // 與初速 (100, 0) 形成銳角
		var proj = makeHomingProjectile("p1", 0.0, 0.0, 0.0, 100.0, "t1", 1.0);
		world.projectiles.push(proj);
		var initialSpeed = Math.sqrt(proj.velocity.x * proj.velocity.x + proj.velocity.y * proj.velocity.y);

		var hs = new HomingSystem(world);
		hs.onTick(0, 100.0); // dt = 0.1s
		var newSpeed = Math.sqrt(proj.velocity.x * proj.velocity.x + proj.velocity.y * proj.velocity.y);

		assertNear("|velocity| preserved", newSpeed, initialSpeed);
	}

	// ====================================================================
	// fixtures
	// ====================================================================

	static function makeTarget(id:String, x:Float, y:Float) {
		var m = createEmptyMachine();
		m.id = id;
		m.name = id;
		m.position = {x: x, y: y};
		m.shape = Circle(0.0, 0.0, 5.0);
		return m;
	}

	/** 構造一顆「直線飛行」的 demo projectile (tracking = null), 給「忽略」案例用 */
	static function makePlainProjectile(id:String, x:Float, y:Float, facing:Float, speed:Float):ProjectileObject {
		return {
			id: id,
			name: id,
			position: {x: x, y: y},
			facing: facing,
			velocity: {x: speed * Math.cos(facing), y: speed * Math.sin(facing)},
			maxSpeed: speed,
			shape: Circle(0.0, 0.0, 2.0),
			projectile: Solid(speed, -1.0, {type: Physical, amount: 0.0}, None),
			age: 0.0,
			stage: Flying
		};
	}

	/** 構造一顆追蹤彈, tracking 指向 targetId, 機動性由 turnRate (rad/s) 決定 */
	static function makeHomingProjectile(id:String, x:Float, y:Float, facing:Float, speed:Float, targetId:String, turnRate:Float):ProjectileObject {
		var proj = makePlainProjectile(id, x, y, facing, speed);
		proj.tracking = {targetId: targetId, turnRate: turnRate};
		return proj;
	}

	// ====================================================================
	// assertions
	// ====================================================================

	static function assertNear(label:String, actual:Float, expected:Float):Void {
		if (Math.abs(actual - expected) <= EPS) {
			trace('  [OK] $label = $actual');
		} else {
			trace('  [FAIL] $label expected=$expected actual=$actual');
		}
	}
}
