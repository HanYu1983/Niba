package impl;

import domain.Collision.Hitbox;
import domain.FieldObject.CollidableObject;
import domain.FieldObject.mountWorldFacing;
import domain.FieldObject.mountWorldPosition;
import domain.Geometry.Shape;
import domain.Machine;
import domain.Projectile.Projectile;
import domain.Projectile.ProjectileObject;
import domain.Projectile.ProjectileStage;
import domain.Weapon.FireMode;
import domain.Weapon.PowerSource;
import domain.Weapon.WeaponOnMachine;
import domain.World;
import domain.World.findMachineById;

/**
 * 處理 world.weaponsOnMachine 的擊發邏輯。
 *
 * 輸入 (玩家 / AI 每幀寫進來):
 *   - WeaponOnMachine.isTrigger:Bool — 本幀的扳機意圖 (true = 想開火)
 *
 * 輸出:
 *   - 新的 ProjectileObject push 進 world.projectiles
 *   - 對應扣 PowerSource: magazineLeft (Magazine) / ammoLeft (Ammo);
 *     NativeEnergy 因為 Machine 目前還沒有 currentEnergy 欄位, 暫時直接通過 (見 consumePower TODO)
 *   - 在 onTick 末尾把 weapon.prevTrigger 同步成本幀的 isTrigger, 給下一幀做 edge detection
 *
 * FireMode 行為:
 *   - Single:
 *       rising edge (上幀 false → 本幀 true) 觸發單發.
 *       按住扳機不會連發, 直到放開再按下才會再開一發.
 *   - Burst(count, interval):
 *       rising edge 立即發射一發 (對應「先發射一次並記錄時間」),
 *       之後只要扳機持續按住, 每 interval 秒再發射一發 (level-triggered auto-fire).
 *       現階段 count 未被使用 — Burst 在「按住期間」持續開火直到放開, TODO 後續再加 count 上限
 *       (例: 一次扣下扳機最多噴 count 顆, 達上限後即使還按著也停火).
 *   - Spread(count, spreadAngle):
 *       rising edge 觸發一次「擊發」, 一發消耗一次 PowerSource, 同時噴出 count 顆子彈,
 *       散佈在 [-spreadAngle/2, +spreadAngle/2] (度) 均分.
 *       語意對齊散彈槍: 一發 shell 對應一次彈藥消耗, 不論 pellet 數量.
 *
 * PowerSource:
 *   - NativeEnergy(costPerShot): 永遠允許 (TODO 待 Machine.currentEnergy 上線後改為精確判斷)
 *   - Magazine(capacity, costPerShot):
 *       需要 magazineLeft ≥ costPerShot 才能開火, 開火後扣 costPerShot.
 *       reloadTime 已從模板移除, 「補匣 / 補能」交給上層 (例如未來的 ReloadSystem) 寫回 magazineLeft.
 *   - Ammo(rounds): 需要 ammoLeft ≥ 1 才能開火, 開火後扣 1.
 *
 * 系統執行順序 (HelloWorld systems 陣列):
 *   GoalSystem → WeaponFireSystem → HomingSystem → MovementSystem → HitboxSystem → CollisionSystem → ProjectileSystem
 *
 *   - 排在 HomingSystem 之前: 同一幀內新發射的彈藥若有 tracking, 也能立刻被 HomingSystem 轉向
 *   - 排在 MovementSystem 之前: 同一幀內新彈藥就能進入 MovementSystem 推進一個 dt, 避免停在槍口
 *   - 排在 ProjectileSystem 之前: 新彈藥下一幀進入 ProjectileSystem 才開始 age 累加 / OnHit 判斷
 *
 * isDirty:
 *   只在「本幀有彈藥被 push 到 world.projectiles」時翻 isDirty (對應 World.isDirty 的「增刪才翻」規則).
 *   單純修改 weapon.isTrigger / magazineLeft / lastFireTime 等屬性不翻 —
 *   weapon 物件參考透過 weaponsOnMachine 陣列已包含在 render snapshot, 屬性變化會自動穿透.
 */
class WeaponFireSystem implements ISystem {
	static inline final MS_PER_SECOND = 1000.0;

	/**
	 * 武器發射的子彈包圍圓預設半徑 (本機座標).
	 *
	 * 為什麼寫死在 system:
	 *   - Projectile enum 模板層目前不攜帶 shape (只描述「飛/不飛 + 命中行為」),
	 *     而 ProjectileObject 才掛 shape; spawn 端必須決定一個值.
	 *   - DebugProjectile / ProjectileSystem.SpawnProjectiles 都採同一個慣例「源頭決定」.
	 * TODO: 若日後想讓武器決定子彈大小, 在 WeaponDefinition 加一個 projectileShape:Shape 欄位即可.
	 */
	static inline final DEFAULT_PROJECTILE_RADIUS = 3.0;

	final world:World;

	/** 系統自累計的經過秒數, 用以做 Burst interval 的時間比對. 由 onTick 推進. */
	var totalElapsed:Float = 0.0;

	/**
	 * 序號計數器, 用來為每顆生出來的彈藥組成獨一無二的 id.
	 *
	 * 不重置: 即使武器換、彈藥消失, 也讓序號單調遞增, 避免「兩顆彈藥共用同一 id」
	 * 在序列化 / 命中表 / debug log 處造成混淆.
	 */
	var spawnCounter:Int = 0;

	public function new(world:World) {
		this.world = world;
	}

	public function onSetup():Void {}

	public function onClick(id:String):Void {}

	public function onTick(frameCount:Int, deltaTime:Float):Void {
		var dt = deltaTime / MS_PER_SECOND;
		totalElapsed += dt;

		var anyFired = false;
		for (weapon in world.weaponsOnMachine) {
			if (tryFire(weapon))
				anyFired = true;
			// edge detection 用的「上一幀」值在本幀計算完畢後寫入,
			// 下一幀 tryFire 進入時讀到的就是本幀的 isTrigger.
			weapon.prevTrigger = weapon.isTrigger;
		}
		// 只有實際 push 進 world.projectiles 才翻 isDirty (對應 World.isDirty 的「增刪才翻」規則).
		// weapon 自身屬性 (isTrigger / magazineLeft / lastFireTime / prevTrigger) 變動不翻 —
		// 它們透過 weaponsOnMachine 陣列同一份參考自動進入下一幀 render snapshot.
		if (anyFired)
			world.isDirty = true;
	}

	public function onMousePressed(x:Float, y:Float):Void {}

	public function onMouseRelease():Void {}

	public function onMouseMoved(x:Float, y:Float):Void {}

	public function onMouseDragged(x:Float, y:Float):Void {}

	public function onCollide(a:CollidableObject, b:CollidableObject):Void {}

	public function onHitboxCollide(hitbox:Hitbox, target:CollidableObject):Void {}

	public function onDamage(hitbox:Hitbox, target:CollidableObject):Void {}

	// ====================================================================
	// 內部: 擊發判斷 / PowerSource 消耗 / ProjectileObject 生成
	// ====================================================================

	/**
	 * 對單一武器做本幀擊發判斷. 回傳「本幀是否真的有至少一發子彈被 spawn」(供 isDirty 統計用).
	 *
	 * 流程:
	 *   1. isTrigger=false → 立刻 false
	 *   2. 找不到 owner machine → 立刻 false (例: 機體已陣亡, 武器之後會由其它系統 GC)
	 *   3. 依 FireMode 決定:
	 *      Single / Spread → 只有 rising edge 才開
	 *      Burst           → rising edge 或 (now − lastFireTime ≥ interval) 兩者其一
	 *   4. consumePower 過關後實際 spawn
	 */
	function tryFire(weapon:WeaponOnMachine):Bool {
		if (!weapon.isTrigger)
			return false;
		var owner = findMachineById(world, weapon.ownerMachineId);
		if (owner == null)
			return false;
		var isRisingEdge = !weapon.prevTrigger;
		return switch (weapon.definition.fire) {
			case Single:
				if (!isRisingEdge) false
				else fireOnce(weapon, owner, 0.0);
			case Burst(_, interval):
				if (isRisingEdge || (totalElapsed - weapon.lastFireTime) >= interval) {
					fireOnce(weapon, owner, 0.0);
				} else {
					false;
				};
			case Spread(count, spreadAngle):
				if (!isRisingEdge) false
				else fireSpread(weapon, owner, count, spreadAngle);
		};
	}

	/**
	 * 消耗一次 PowerSource 並 spawn 一發, 回傳是否真的擊發. PowerSource 不足時不 spawn 也不更新 lastFireTime.
	 *
	 * @param facingOffset 相對武器世界朝向的偏角 (弧度). Single / Burst 一律 0, Spread 由 fireSpread 提供.
	 */
	function fireOnce(weapon:WeaponOnMachine, owner:Machine, facingOffset:Float):Bool {
		if (!consumePower(weapon))
			return false;
		spawnProjectile(weapon, owner, facingOffset);
		weapon.lastFireTime = totalElapsed;
		return true;
	}

	/**
	 * Spread 擊發: 一發 PowerSource → count 顆 pellet, 角度均分於 [-spreadRad/2, +spreadRad/2].
	 *
	 * count=1 視為一發直線彈; count≥2 時最外側兩顆剛好落在 ±spreadRad/2 邊界.
	 * 若 PowerSource 不足, 整把 spread 都不發射 (不會「打一半」).
	 */
	function fireSpread(weapon:WeaponOnMachine, owner:Machine, count:Int, spreadAngleDeg:Float):Bool {
		if (count <= 0)
			return false;
		if (!consumePower(weapon))
			return false;
		var spreadRad = spreadAngleDeg * Math.PI / 180.0;
		if (count == 1) {
			spawnProjectile(weapon, owner, 0.0);
		} else {
			for (i in 0...count) {
				var t = i / (count - 1); // 0..1
				var offset = (t - 0.5) * spreadRad;
				spawnProjectile(weapon, owner, offset);
			}
		}
		weapon.lastFireTime = totalElapsed;
		return true;
	}

	/**
	 * 嘗試扣一次 PowerSource. 過關回 true 並完成扣款; 不過則回 false 且不變動狀態.
	 *
	 * 各變體:
	 *   - NativeEnergy: 暫時 always 通過 (TODO: Machine.currentEnergy 上線後改判斷與扣款).
	 *   - Magazine(_, costPerShot): magazineLeft ≥ costPerShot 才過, 過後 magazineLeft -= costPerShot.
	 *   - Ammo(_): ammoLeft ≥ 1 才過, 過後 ammoLeft -= 1.
	 */
	function consumePower(weapon:WeaponOnMachine):Bool {
		return switch (weapon.definition.power) {
			case NativeEnergy(_):
				true;
			case Magazine(_, costPerShot):
				if (weapon.magazineLeft < costPerShot) false;
				else {
					weapon.magazineLeft -= costPerShot;
					true;
				};
			case Ammo(_):
				if (weapon.ammoLeft <= 0) false;
				else {
					weapon.ammoLeft -= 1;
					true;
				};
		};
	}

	/**
	 * 把武器的 Projectile 模板 → 實際 ProjectileObject, 並 push 進 world.projectiles.
	 *
	 * 位置 / 朝向計算:
	 *   - 出生點: mountWorldPosition(weapon, owner) — 掛點的世界座標
	 *   - 朝向: mountWorldFacing(weapon, owner) + facingOffset — 機體 + 掛點本機 + 散佈偏角
	 *
	 * 速度:
	 *   依模板 variant 取 scalar speed (見 projectileSpeed). Beam / Field 速度為 0,
	 *   ProjectileSystem.onTick 會在下一幀把它從 Flying → ResolvingHit, 立即 resolve.
	 */
	function spawnProjectile(weapon:WeaponOnMachine, owner:Machine, facingOffset:Float):Void {
		var template = weapon.definition.projectile;
		var speed = projectileSpeed(template);
		var pos = mountWorldPosition(weapon, owner);
		var facing = mountWorldFacing(weapon, owner) + facingOffset;
		var cos = Math.cos(facing);
		var sin = Math.sin(facing);
		spawnCounter++;
		var projectile:ProjectileObject = {
			id: '${weapon.id}_shot_$spawnCounter',
			name: '${weapon.definition.name} shot $spawnCounter',
			position: pos,
			facing: facing,
			velocity: {x: speed * cos, y: speed * sin},
			maxSpeed: speed,
			shape: Circle(0.0, 0.0, DEFAULT_PROJECTILE_RADIUS),
			projectile: template,
			age: 0.0,
			stage: Flying
		};
		world.projectiles.push(projectile);
	}

	/** 取得 Projectile 模板的 scalar speed; Beam / Field 不具速度概念, 一律回 0. */
	static function projectileSpeed(p:Projectile):Float {
		return switch (p) {
			case Solid(speed, _, _, _): speed;
			case Energy(speed, _, _): speed;
			case Beam(_, _): 0.0;
			case Field(_): 0.0;
		};
	}
}
