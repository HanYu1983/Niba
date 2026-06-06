package debug;

import domain.Damage.DamageType;
import domain.Geometry.Shape;
import domain.Machine;
import domain.Machine.createEmptyMachine;
import domain.Skill.Skill;
import domain.Skill.createMachineCurrentSkill;
import domain.Weapon.FireMode;
import domain.Weapon.PowerSource;
import domain.Weapon.WeaponCategory;
import domain.Weapon.WeaponDefinition;
import domain.Weapon.createWeaponOnMachine;
import domain.World;
import domain.World.createEmptyWorld;
import impl.MachineCurrentSkillSystem;
import impl.SimpleMovementResolver.simpleMovementResolver;

/**
 * MachineCurrentSkillSystem 的純邏輯驗證 (browser-free).
 *
 * 驗證項目:
 *   - step 進度推進 (stepElapsed 累加, t = elapsed/duration)
 *   - Dash movement 把 machine.position 套到 stepStartPosition + t·baseDistance·multiplier·facing
 *   - step 切換時 stepStartPosition / stepStartFacing 取「上一 step 套完 t=1.0 後的位置」
 *   - weaponUse 期間相符武器 isTrigger=true, 其它武器 isTrigger=false
 *   - skill 結束: currentSkill=null, 所有武器 isTrigger=false
 *   - skill 期間 machine.velocity 被清零 (即使外部寫了, 系統覆蓋)
 *   - skill 找不到 → 立刻結束招式
 */
class CurrentSkillTest {
	static inline final EPS = 1e-6;
	static inline final BASE = 50.0;

	public static function run():Void {
		trace("=== Current Skill Test ===");
		testStepProgressAndPosition();
		testStepTransitionStartsFromPrevEnd();
		testWeaponUseTriggersOnlyMatchingWeapon();
		testSkillEndClearsTriggersAndNullsCurrentSkill();
		testVelocityCleared();
		testMissingSkillEndsImmediately();
		testEmptyStepsEndImmediately();
		trace("=== Current Skill Test DONE ===");
	}

	// ====================================================================
	// step 推進 / movement 套用
	// ====================================================================

	/** 一個 step (1s, Dash mult=1), facing=0, dt=0.5s → position 應在 stepStart + (BASE × 0.5, 0). */
	static function testStepProgressAndPosition():Void {
		trace("--- [step] Dash progress puts machine at stepStart + t·base·mult·dir ---");
		var setup = build([
			{duration: 1.0, movement: {type: Dash, multiplier: 1.0}}
		]);
		setup.machine.position = {x: 10.0, y: 20.0};
		setup.machine.facing = 0.0;
		setup.machine.currentSkill = createMachineCurrentSkill("test_skill", setup.machine);

		setup.system.onTick(0, 500.0); // dt = 0.5s, t = 0.5

		assertNear("position.x = 10 + 0.5·50·1·cos(0) = 35", setup.machine.position.x, 35.0);
		assertNear("position.y = 20 + 0 = 20", setup.machine.position.y, 20.0);
	}

	/** Two-step skill: step1 Dash mult=2 (1s), step2 Dash mult=1 (1s).
	 *  跑 1.5s 後應在 step2 進行中 — step2 起點為 step1 終點 (= 100 wu 前方). */
	static function testStepTransitionStartsFromPrevEnd():Void {
		trace("--- [step transition] step2 starts from step1 end position ---");
		var setup = build([
			{duration: 1.0, movement: {type: Dash, multiplier: 2.0}},
			{duration: 1.0, movement: {type: Dash, multiplier: 1.0}}
		]);
		setup.machine.position = {x: 0.0, y: 0.0};
		setup.machine.facing = 0.0;
		setup.machine.currentSkill = createMachineCurrentSkill("test_skill", setup.machine);

		// 1.5s 一次跨步: dt 同時跨過 step1 全長 (1.0s) + 進 step2 (0.5s)
		setup.system.onTick(0, 1500.0);

		// step1 結束時走了 0+1·50·2 = 100 wu → step2 起點 (100, 0)
		// step2 進行 0.5s, t=0.5, 走 0.5·50·1 = 25 wu
		// 結果 machine.position.x = 125
		assertNear("position.x = 100 (step1 end) + 25 (step2 t=0.5)", setup.machine.position.x, 125.0);
		assertEq("stepIndex advanced to 1", 1, setup.machine.currentSkill.stepIndex);
		assertNear("stepStartPosition.x = 100 (step1 終點)", setup.machine.currentSkill.stepStartPosition.x, 100.0);
	}

	// ====================================================================
	// weaponUse → isTrigger
	// ====================================================================

	/** weaponUse.weaponId 相符的武器 isTrigger=true, 其它 false. */
	static function testWeaponUseTriggersOnlyMatchingWeapon():Void {
		trace("--- [weaponUse] toggles isTrigger only on matching weapon ---");
		var setup = build([
			{
				duration: 1.0,
				weaponUse: {weaponId: "w1", energyCostMul: 1.0, damageMul: 1.0, accuracyMul: 1.0}
			}
		]);
		var w1 = pushWeapon(setup, "w1");
		var w2 = pushWeapon(setup, "w2");
		w2.isTrigger = true; // 外部殘留
		setup.machine.currentSkill = createMachineCurrentSkill("test_skill", setup.machine);

		setup.system.onTick(0, 500.0);

		assertEq("w1 isTrigger = true (matched)", true, w1.isTrigger);
		assertEq("w2 isTrigger = false (overridden by skill)", false, w2.isTrigger);
	}

	// ====================================================================
	// skill 結束清理
	// ====================================================================

	/** skill 跑完所有 step → currentSkill 變 null, 所有武器 isTrigger=false. */
	static function testSkillEndClearsTriggersAndNullsCurrentSkill():Void {
		trace("--- [skill end] currentSkill = null, all triggers cleared ---");
		var setup = build([
			{
				duration: 0.5,
				weaponUse: {weaponId: "w1", energyCostMul: 1.0, damageMul: 1.0, accuracyMul: 1.0}
			}
		]);
		var w1 = pushWeapon(setup, "w1");
		setup.machine.currentSkill = createMachineCurrentSkill("test_skill", setup.machine);

		setup.system.onTick(0, 100.0);  // 0.1s, 進行中
		assertEq("w1 isTrigger = true while skill running", true, w1.isTrigger);

		setup.system.onTick(1, 500.0);  // 累計 0.6s ≥ 0.5s, skill 結束
		assertEq("currentSkill cleared to null", true, setup.machine.currentSkill == null);
		assertEq("w1 isTrigger = false after end", false, w1.isTrigger);
	}

	/** skill 期間, 即使外部寫了 velocity, 系統也會清零. */
	static function testVelocityCleared():Void {
		trace("--- [skill] velocity forced to (0, 0) during skill ---");
		var setup = build([
			{duration: 1.0, movement: {type: Dash, multiplier: 1.0}}
		]);
		setup.machine.velocity = {x: 999.0, y: -999.0}; // 模擬 GoalSystem 寫進來的 velocity
		setup.machine.currentSkill = createMachineCurrentSkill("test_skill", setup.machine);

		setup.system.onTick(0, 100.0);

		assertNear("velocity.x cleared", setup.machine.velocity.x, 0.0);
		assertNear("velocity.y cleared", setup.machine.velocity.y, 0.0);
	}

	/** machine.currentSkill.skillId 找不到對應 Skill → 立刻結束 (currentSkill=null). */
	static function testMissingSkillEndsImmediately():Void {
		trace("--- [skill missing] unknown skillId ends skill immediately ---");
		var setup = build([
			{duration: 1.0, movement: {type: Dash, multiplier: 1.0}}
		]);
		// 手動製造一個指向不存在 skillId 的 currentSkill
		setup.machine.currentSkill = {
			skillId: "non_existent",
			stepIndex: 0,
			stepElapsed: 0.0,
			stepStartPosition: {x: 0.0, y: 0.0},
			stepStartFacing: 0.0
		};

		setup.system.onTick(0, 100.0);

		assertEq("currentSkill cleared to null", true, setup.machine.currentSkill == null);
	}

	/** Skill 內 steps 為空 → 進來就結束. */
	static function testEmptyStepsEndImmediately():Void {
		trace("--- [skill empty] zero-step skill ends immediately ---");
		var setup = build([]);
		setup.machine.currentSkill = createMachineCurrentSkill("test_skill", setup.machine);

		setup.system.onTick(0, 100.0);

		assertEq("currentSkill cleared to null", true, setup.machine.currentSkill == null);
	}

	// ====================================================================
	// fixtures
	// ====================================================================

	static function build(steps:Array<domain.Skill.SkillStep>) {
		var world = createEmptyWorld();
		var machine = createEmptyMachine();
		machine.id = "owner";
		machine.shape = Circle(0.0, 0.0, 5.0);
		machine.skills.push({
			id: "test_skill",
			name: "Test Skill",
			requiredCategory: Bullet,
			steps: steps
		});
		world.machines.push(machine);
		var system = new MachineCurrentSkillSystem(world, simpleMovementResolver, BASE);
		return {world: world, machine: machine, system: system};
	}

	/** 在 setup 內附加一把武器, 同時掛到 machine.weapons 和 world.weaponsOnMachine. */
	static function pushWeapon(setup, id:String) {
		var def:WeaponDefinition = {
			id: 'def_$id',
			name: 'Weapon $id',
			category: Bullet,
			power: NativeEnergy(0.0),
			fire: Single,
			projectile: Solid(100.0, 1.0, {type: Physical, amount: 1.0}, None),
			baseAccuracy: 1.0
		};
		var w = createWeaponOnMachine(def, setup.machine.id, id);
		setup.machine.weapons.push(w);
		setup.world.weaponsOnMachine.push(w);
		return w;
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

	static function assertEq<T>(label:String, expected:T, actual:T):Void {
		if (expected == actual) {
			trace('  [OK] $label = $actual');
		} else {
			trace('  [FAIL] $label expected=$expected actual=$actual');
		}
	}
}
