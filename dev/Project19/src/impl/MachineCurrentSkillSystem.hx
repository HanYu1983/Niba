package impl;

import domain.Collision.Hitbox;
import domain.FieldObject.CollidableObject;
import domain.Machine;
import domain.Machine.findSkillById;
import domain.Skill.MachineCurrentSkill;
import domain.Skill.MovementResolver;
import domain.Skill.Skill;
import domain.Skill.SkillStep;
import domain.Weapon.WeaponOnMachine;
import domain.World;

/**
 * 推進每個機體的 currentSkill 流程, 把當前 step 的 movement / weaponUse 翻譯成
 * 對機體 / 武器的具體操作:
 *
 *   - movement → 覆寫 machine.position (相對 stepStartPosition 套 MovementResolver),
 *                並把 machine.velocity 清零, 避免後面 MovementSystem 再推一次造成雙重位移.
 *   - weaponUse → 對 machine.weapons 中與 step.weaponUse.weaponId 相符的武器設 isTrigger = true,
 *                 同機體其它武器 isTrigger = false.
 *                 這是 level-triggered 接管: 招式期間直接覆蓋玩家輸入 / DebugWeaponTrigger 等
 *                 來源的 trigger 狀態.
 *   - 倍率 (energyCostMul / damageMul / accuracyMul): 本系統暫不套用 (見 Skill.WeaponUse doc),
 *                 視日後加入 DamageSystem / EnergyConsumer 等後再處理.
 *
 * step 推進規則:
 *   - 每 tick 累加 stepElapsed += dt; t = clamp(stepElapsed / step.duration, [0, 1])
 *   - stepElapsed ≥ step.duration 時:
 *       1. 先把當前 step 的「終點」(t = 1.0) 套到 machine.position 上,
 *          避免 step 切換瞬間留下「沒走到位」的小破口 → 下一 step 的 stepStartPosition 就會偏掉
 *       2. stepIndex++, stepElapsed -= duration (carry over 剩餘時間)
 *       3. 若 stepIndex 越界, currentSkill = null, 清光本機體所有武器的 isTrigger (停火)
 *       4. 否則重設 stepStartPosition / stepStartFacing 為「現在的 machine.position / facing」
 *
 *   - 同一 tick 內最多跨一 step. 若 dt 巨大導致跨多 step, 後續 step 留到下一 tick 處理.
 *     對 30+ FPS 場景影響極小, 暫不為這個邊角情境寫迴圈, 避免邏輯複雜.
 *
 * 與其它系統的順序:
 *   GoalSystem → MachineCurrentSkillSystem → WeaponFireSystem → HomingSystem → MovementSystem → ...
 *
 *   - 在 GoalSystem 之後: skill 期間覆寫 velocity / position, 優先級高於 goal 規劃出的 velocity.
 *     skill 不在時則不動 velocity, goal 結果自然透到 MovementSystem.
 *   - 在 WeaponFireSystem 之前: skill 設好的 weapon.isTrigger 才會被同幀的 WeaponFireSystem 看到.
 *   - 在 MovementSystem 之前: skill 期間清掉的 velocity (= 0) 不會被 MovementSystem 再推位移;
 *     skill 完成那幀, 已套用最後 step 終點到 position, MovementSystem 也不會破壞它.
 *
 * isDirty:
 *   只在「結束招式時清掉 machine.currentSkill」這個結構轉場時翻 isDirty
 *   (對應 World.isDirty 「systems 只在增刪時翻」規則 — currentSkill 從 obj 變 null 視為刪除).
 *   日常 step 推進改的是 machine.position / weapon.isTrigger 等屬性, 不翻 isDirty,
 *   讓 RenderWorld 的 shallow array.copy() 透過 reference 自動反映變化.
 *
 * 依賴注入:
 *   - movementResolver: Skill.MovementResolver — 把 Movement (type + multiplier) 翻成位移向量
 *   - baseDistance:     機體「一格 dash 距離」的世界單位; 暫以 system-wide 常數注入,
 *                       TODO 之後可改為從 Machine 屬性讀, 讓不同機體有不同機動性
 */
class MachineCurrentSkillSystem implements ISystem {
	static inline final MS_PER_SECOND = 1000.0;

	final world:World;
	final movementResolver:MovementResolver;
	final baseDistance:Float;

	public function new(world:World, movementResolver:MovementResolver, baseDistance:Float) {
		this.world = world;
		this.movementResolver = movementResolver;
		this.baseDistance = baseDistance;
	}

	public function onSetup():Void {}

	public function onClick(id:String):Void {}

	public function onTick(frameCount:Int, deltaTime:Float):Void {
		var dt = deltaTime / MS_PER_SECOND;
		for (machine in world.machines) {
			advanceMachine(machine, dt);
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
	// 內部: 單一機體的 step 推進
	// ====================================================================

	function advanceMachine(machine:Machine, dt:Float):Void {
		var cs = machine.currentSkill;
		if (cs == null)
			return;
		var skill = findSkillById(machine, cs.skillId);
		if (skill == null) {
			// skill 定義找不到 (例如熱更新後 id 失效): 直接結束招式 + 釋放扳機, 翻 isDirty
			endSkill(machine);
			return;
		}
		// 邊界: 空 steps 直接結束
		if (skill.steps.length == 0) {
			endSkill(machine);
			return;
		}

		cs.stepElapsed += dt;

		var step = skill.steps[cs.stepIndex];
		// 1. step 到期 → 套用終點 (t=1.0) 後切到下一步
		if (cs.stepElapsed >= step.duration) {
			// 套用 step 終點. 若沒設 movement, 自然沿用當下 position
			applyMovement(machine, cs, step, 1.0);

			cs.stepElapsed -= step.duration;
			cs.stepIndex += 1;
			if (cs.stepIndex >= skill.steps.length) {
				endSkill(machine);
				return;
			}
			// 新 step: 從套完 t=1.0 後的位置 / 當下 facing 重新 snapshot
			cs.stepStartPosition = {x: machine.position.x, y: machine.position.y};
			cs.stepStartFacing = machine.facing;
			step = skill.steps[cs.stepIndex];
		}

		// 2. 套用「進行中」step 的當前 t 對應的 position
		var t = if (step.duration > 0.0) Math.min(1.0, cs.stepElapsed / step.duration) else 1.0;
		applyMovement(machine, cs, step, t);

		// 3. 套用 weaponUse → 本機體 weapons 的 isTrigger
		applyWeaponUse(machine, step);
	}

	/**
	 * 把 step.movement 在進度 t 對應的位移套到 machine.position.
	 *
	 * 即使 movement = null 也會把 machine.velocity 清零 — 招式 step 期間整體上由本系統
	 * 接管 position, 沒理由讓 MovementSystem 推 velocity 把機體往別處帶
	 * (例如純等待 step 期間機體應該停下來收招, 而不是繼續 GoalSystem 算出的 velocity).
	 */
	function applyMovement(machine:Machine, cs:MachineCurrentSkill, step:SkillStep, t:Float):Void {
		machine.velocity = {x: 0.0, y: 0.0};
		if (step.movement == null)
			return;
		var offset = movementResolver(step.movement, cs.stepStartFacing, baseDistance, t);
		machine.position = {
			x: cs.stepStartPosition.x + offset.x,
			y: cs.stepStartPosition.y + offset.y
		};
	}

	/**
	 * 同機體 weapons 中對 step.weaponUse.weaponId 設 isTrigger = true, 其它為 false.
	 *
	 * 為什麼把不相關武器也清為 false:
	 *   skill 是強接管語意, 期間「沒被指定的武器」不該還被別處 (例: DebugWeaponTrigger) 維持扣扳機,
	 *   否則跑 skill 時也會莫名其妙打到別把武器.
	 *   skill 結束後 (endSkill) 全部清為 false 才放手, 之後 view event 來源才有機會重設.
	 */
	function applyWeaponUse(machine:Machine, step:SkillStep):Void {
		var weaponId = step.weaponUse == null ? null : step.weaponUse.weaponId;
		for (weapon in machine.weapons) {
			weapon.isTrigger = (weaponId != null && weapon.id == weaponId);
		}
	}

	/**
	 * 招式正常 / 異常結束的收尾:
	 *   - machine.currentSkill = null
	 *   - 清光本機體所有武器的 isTrigger = false (停火)
	 *   - 翻 world.isDirty: currentSkill obj→null 視為「runtime 物件被移除」, 跟 spawn / despawn
	 *     處於同個層級 (見 World.isDirty doc 的 systems 規則)
	 */
	function endSkill(machine:Machine):Void {
		machine.currentSkill = null;
		for (weapon in machine.weapons)
			weapon.isTrigger = false;
		world.isDirty = true;
	}
}
