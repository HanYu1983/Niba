package debug;

import domain.Damage.DamageType;
import domain.Geometry.Shape;
import domain.Machine;
import domain.Machine.createEmptyMachine;
import domain.Weapon.FireMode;
import domain.Weapon.PowerSource;
import domain.Weapon.WeaponCategory;
import domain.Weapon.WeaponDefinition;
import domain.Weapon.WeaponOnMachine;
import domain.Weapon.createWeaponOnMachine;
import domain.World;
import domain.World.createEmptyWorld;
import impl.WeaponFireSystem;

/**
 * WeaponFireSystem 的純邏輯驗證 (browser-free).
 *
 * 不依賴 view / EventCenter, 直接構造 World + Machine + WeaponOnMachine,
 * 手動翻 weapon.isTrigger 並呼叫 system.onTick 觀察:
 *   - Single   是否「rising edge 才開火」
 *   - Burst    是否「按住扳機後依 interval 連發, count 目前無上限」
 *   - Spread   是否「rising edge spawn 出 count 顆 pellet」
 *   - PowerSource 是否正確消耗 (Magazine 扣 costPerShot / Ammo 扣 1)
 *   - 用盡 PowerSource 後 isTrigger=true 也不再生彈
 *
 * dt 慣例: WeaponFireSystem.onTick(deltaTime) 以毫秒為單位; 本測試用 1000ms = 1 秒.
 */
class WeaponFireTest {
	public static function run():Void {
		trace("=== Weapon Fire Test ===");
		testSingleEdge();
		testSinglePressReleasePress();
		testBurstFirstShotImmediate();
		testBurstIntervalGate();
		testMagazineDepletion();
		testAmmoDepletion();
		testSpreadCount();
		testSpreadConsumesPowerOnce();
		trace("=== Weapon Fire Test DONE ===");
	}

	// ====================================================================
	// Single
	// ====================================================================

	/** isTrigger 持續為 true 時, Single 只在第一幀 (rising edge) 開一發, 之後不再發. */
	static function testSingleEdge():Void {
		trace("--- [Single] held trigger fires once ---");
		var setup = buildSingleSetup();
		setup.weapon.isTrigger = true;

		setup.system.onTick(0, 1000.0); // frame 1: edge, fire
		setup.system.onTick(1, 1000.0); // frame 2: held, no fire
		setup.system.onTick(2, 1000.0); // frame 3: held, no fire

		assertEq("Single fires exactly 1 shot on held trigger", 1, setup.world.projectiles.length);
	}

	/** 連續「按 / 放 / 按」應觸發兩次 Single (兩個 rising edge). */
	static function testSinglePressReleasePress():Void {
		trace("--- [Single] press → release → press fires twice ---");
		var setup = buildSingleSetup();

		setup.weapon.isTrigger = true;
		setup.system.onTick(0, 1000.0); // edge → fire #1
		setup.weapon.isTrigger = false;
		setup.system.onTick(1, 1000.0); // released → no fire, prevTrigger 收回 false
		setup.weapon.isTrigger = true;
		setup.system.onTick(2, 1000.0); // edge → fire #2

		assertEq("Single re-fires after release", 2, setup.world.projectiles.length);
	}

	// ====================================================================
	// Burst
	// ====================================================================

	/** Burst rising edge 應立即發射 1 發, 不管 interval. */
	static function testBurstFirstShotImmediate():Void {
		trace("--- [Burst] rising edge fires immediately ---");
		var setup = buildBurstSetup(0.5); // interval = 0.5s
		setup.weapon.isTrigger = true;

		setup.system.onTick(0, 1.0); // 1ms = 0.001s 遠小於 interval, 但 rising edge 應立刻發

		assertEq("Burst first shot ignores interval", 1, setup.world.projectiles.length);
	}

	/** Burst 按住扳機 → 第一幀發一發, 之後每 ≥ interval 秒再發一發. */
	static function testBurstIntervalGate():Void {
		trace("--- [Burst] subsequent shots gated by interval ---");
		var setup = buildBurstSetup(0.5);
		setup.weapon.isTrigger = true;

		setup.system.onTick(0, 1000.0); // t=1.0, edge → fire #1, lastFireTime=1.0
		setup.system.onTick(1, 100.0);  // t=1.1, 0.1s < 0.5s, no fire
		setup.system.onTick(2, 200.0);  // t=1.3, 0.3s 累計 < 0.5s, no fire
		setup.system.onTick(3, 300.0);  // t=1.6, 0.6s ≥ 0.5s → fire #2

		assertEq("Burst fires 2 shots over interval gate", 2, setup.world.projectiles.length);
	}

	// ====================================================================
	// PowerSource consumption
	// ====================================================================

	/** Magazine: 開火扣 costPerShot, 扣到不足 costPerShot 時下一發不發. */
	static function testMagazineDepletion():Void {
		trace("--- [Magazine] consumes costPerShot per shot, blocks when empty ---");
		// capacity = 3, costPerShot = 1.0, Burst interval = 0 → 每幀都應該發, 直到匣空
		var setup = buildBurstSetup(0.0);
		setup.weapon.definition = withPower(setup.weapon.definition, Magazine(3, 1.0));
		setup.weapon.magazineLeft = 3.0;
		setup.weapon.isTrigger = true;

		setup.system.onTick(0, 100.0); // fire #1: magazineLeft 3 → 2
		setup.system.onTick(1, 100.0); // fire #2: 2 → 1
		setup.system.onTick(2, 100.0); // fire #3: 1 → 0
		setup.system.onTick(3, 100.0); // blocked: 0 < 1.0

		assertEq("Magazine fires exactly 3 shots before drying", 3, setup.world.projectiles.length);
		assertEqFloat("magazineLeft drained to 0", 0.0, setup.weapon.magazineLeft);
	}

	/** Ammo: 每發扣 1, 扣到 0 不能再發. */
	static function testAmmoDepletion():Void {
		trace("--- [Ammo] consumes 1 per shot, blocks when empty ---");
		var setup = buildBurstSetup(0.0);
		setup.weapon.definition = withPower(setup.weapon.definition, Ammo(2));
		setup.weapon.ammoLeft = 2;
		setup.weapon.isTrigger = true;

		setup.system.onTick(0, 100.0); // fire #1
		setup.system.onTick(1, 100.0); // fire #2
		setup.system.onTick(2, 100.0); // blocked
		setup.system.onTick(3, 100.0); // blocked

		assertEq("Ammo fires exactly 2 shots", 2, setup.world.projectiles.length);
		assertEq("ammoLeft drained to 0", 0, setup.weapon.ammoLeft);
	}

	// ====================================================================
	// Spread
	// ====================================================================

	/** Spread rising edge → 同幀 spawn 出 count 顆彈. */
	static function testSpreadCount():Void {
		trace("--- [Spread] rising edge spawns count pellets ---");
		var setup = buildSpreadSetup(5, 30.0); // 5 pellets within 30°
		setup.weapon.isTrigger = true;

		setup.system.onTick(0, 1000.0);

		assertEq("Spread spawns 5 pellets in 1 trigger pull", 5, setup.world.projectiles.length);
	}

	/** Spread 一次扣下扳機 = 一次 PowerSource 消耗 (一發 shell), 不論 pellet 數. */
	static function testSpreadConsumesPowerOnce():Void {
		trace("--- [Spread] consumes PowerSource once per trigger pull ---");
		var setup = buildSpreadSetup(5, 30.0);
		setup.weapon.definition = withPower(setup.weapon.definition, Ammo(2));
		setup.weapon.ammoLeft = 2;

		// 兩次「按 / 放」應分別觸發兩次散彈, 共 2 × 5 = 10 顆 pellet, ammoLeft 從 2 扣到 0
		setup.weapon.isTrigger = true;
		setup.system.onTick(0, 1000.0); // edge → 5 pellets, ammo 2 → 1
		setup.weapon.isTrigger = false;
		setup.system.onTick(1, 1000.0);
		setup.weapon.isTrigger = true;
		setup.system.onTick(2, 1000.0); // edge → 5 pellets, ammo 1 → 0
		setup.weapon.isTrigger = false;
		setup.system.onTick(3, 1000.0);
		setup.weapon.isTrigger = true;
		setup.system.onTick(4, 1000.0); // edge, ammo 0 → blocked

		assertEq("Spread fired twice spawns 10 pellets", 10, setup.world.projectiles.length);
		assertEq("Ammo deducted once per shell, not per pellet", 0, setup.weapon.ammoLeft);
	}

	// ====================================================================
	// fixtures
	// ====================================================================

	static function buildSingleSetup() {
		return buildSetup(Single, NativeEnergy(0.0));
	}

	static function buildBurstSetup(interval:Float) {
		return buildSetup(Burst(99, interval), NativeEnergy(0.0));
	}

	static function buildSpreadSetup(count:Int, spreadAngleDeg:Float) {
		return buildSetup(Spread(count, spreadAngleDeg), NativeEnergy(0.0));
	}

	static function buildSetup(fire:FireMode, power:PowerSource) {
		var world = createEmptyWorld();
		var machine = createEmptyMachine();
		machine.id = "owner";
		machine.position = {x: 0.0, y: 0.0};
		machine.shape = Circle(0.0, 0.0, 5.0);
		world.machines.push(machine);

		var def:WeaponDefinition = {
			id: "test_weapon_def",
			name: "Test Weapon",
			category: Bullet,
			power: power,
			fire: fire,
			projectile: Solid(100.0, 5.0, {type: Physical, amount: 1.0}, None),
			baseAccuracy: 1.0
		};
		var weapon = createWeaponOnMachine(def, machine.id, "test_weapon");
		machine.weapons.push(weapon);
		world.weaponsOnMachine.push(weapon);

		var system = new WeaponFireSystem(world);
		return {world: world, machine: machine, weapon: weapon, system: system};
	}

	/** 重新組一份 WeaponDefinition, 只覆蓋 power 變體 (給 magazine / ammo 測試臨時換 PowerSource 用). */
	static function withPower(def:WeaponDefinition, power:PowerSource):WeaponDefinition {
		return {
			id: def.id,
			name: def.name,
			category: def.category,
			power: power,
			fire: def.fire,
			projectile: def.projectile,
			baseAccuracy: def.baseAccuracy
		};
	}

	// ====================================================================
	// assertions
	// ====================================================================

	static function assertEq<T>(label:String, expected:T, actual:T):Void {
		if (expected == actual) {
			trace('  [OK] $label = $actual');
		} else {
			trace('  [FAIL] $label expected=$expected actual=$actual');
		}
	}

	static function assertEqFloat(label:String, expected:Float, actual:Float):Void {
		if (Math.abs(actual - expected) <= 1e-9) {
			trace('  [OK] $label = $actual');
		} else {
			trace('  [FAIL] $label expected=$expected actual=$actual');
		}
	}
}
