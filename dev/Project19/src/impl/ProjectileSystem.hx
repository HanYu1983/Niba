package impl;

import domain.Collision.Hitbox;
import domain.FieldObject.CollidableObject;
import domain.Geometry.Vec2;
import domain.Projectile.OnHit;
import domain.Projectile.Projectile;
import domain.Projectile.ProjectileObject;
import domain.Projectile.ProjectileStage;
import domain.World;

/**
 * 維護 world.projectiles 的生命週期系統。
 *
 * ProjectileObject 已經是 MovableObject + CollidableObject, 因此:
 *   - 位置推進 (position += velocity * dt) 由 MovementSystem 負責
 *   - 與其他 collidable 的碰撞偵測由 CollisionSystem 負責, 透過 onCollide 通知本系統
 *
 * 本系統只負責「跟蹤階段 + 觸發 OnHit」:
 *   1. onTick:
 *      - 累加 age
 *      - Flying 且 Projectile 變體無 onHit (Beam / Field): 直接轉到 ResolvingHit(0)
 *      - ResolvingHit: 執行對應的 onHit / Field 流程, 轉為 Expired
 *      - 移除所有 Expired 的 projectile
 *   2. onCollide:
 *      - 任一邊是 Flying 的 projectile → 轉到 ResolvingHit(0)
 *      - 同幀內 CollisionSystem → ProjectileSystem 順序, 因此本幀 onTick 接著就會把它 resolve 完
 *
 * 與 CollisionSystem 的順序要求 (HelloWorld 系統陣列中):
 *   CollisionSystem 必須排在 ProjectileSystem 之前, 否則 CollisionSystem 觸發的
 *   stage 轉場要延到下一幀才會被 ProjectileSystem 處理。
 *
 * 暫不負責:
 *   - 直接接觸傷害 (Solid / Energy 的 damage 欄位): 應由日後的 DamageSystem 監聽 onCollide
 *     並以 IDamageable 介面套用; 本系統不碰 HP / defense
 *   - 「Hitbox 攔截飛行物」邏輯 (onHitboxCollide): 目前留空, 視日後設計需要再決定
 *
 * 未完成 TODO:
 *   - OnHit.SpawnProjectiles: 由 Projectile 模板建立新 ProjectileObject 需要決定
 *     id 規則 / 預設 shape / 速度導出方式, 目前留 trace 後跳過
 *   - Projectile.Beam: 沿 facing 方向以 range 長度生成 beam-shaped Hitbox 的細節
 *     (Rect 還是 Capsule, 是否帶旋轉等), 目前直接 Expired 不產生 hitbox
 */
class ProjectileSystem implements ISystem {
	static inline final MS_PER_SECOND = 1000.0;

	final world:World;

	public function new(world:World) {
		this.world = world;
	}

	public function onSetup():Void {}

	public function onClick(id:String):Void {}

	public function onTick(frameCount:Int, deltaTime:Float):Void {
		var dt = deltaTime / MS_PER_SECOND;
		var hadProjectiles = world.projectiles.length > 0;

		for (proj in world.projectiles) {
			proj.age += dt;
			switch (proj.stage) {
				case Flying:
					// 三種推進到 ResolvingHit 的條件:
					//   a. 變體無 onHit (Beam / Field) — 立即進入解析
					//   b. 變體有 lifetime 且已到期 — 視同自爆, 走同一條 onHit
					//   c. (其它情況) 等 onCollide 觸發
					if (!hasOnHit(proj.projectile) || isLifetimeExpired(proj))
						proj.stage = ResolvingHit(0);
				case ResolvingHit(_):
					executeResolve(proj);
					proj.stage = Expired;
				case Expired:
			}
		}

		var i = world.projectiles.length;
		while (i-- > 0) {
			switch (world.projectiles[i].stage) {
				case Expired:
					world.projectiles.splice(i, 1);
				default:
			}
		}

		// 本幀有 projectile 要跑 → 至少改了 age (還可能改 stage / hitboxes / projectiles 列表),
		// 統一翻 isDirty 給 DirtyWorldPublisher 收尾發送。空陣列時不翻, 保持閒置場景無 render。
		if (hadProjectiles)
			world.isDirty = true;
	}

	public function onMousePressed(x:Float, y:Float):Void {}

	public function onMouseRelease():Void {}

	public function onMouseMoved(x:Float, y:Float):Void {}

	public function onMouseDragged(x:Float, y:Float):Void {}

	public function onCollide(a:CollidableObject, b:CollidableObject):Void {
		var transitioned = transitionIfFlying(a) || transitionIfFlying(b);
		// onCollide 是 CollisionSystem 在 onTick 內回呼觸發, 本系統的 onTick 隨後會跑且
		// 由 hadProjectiles 路徑翻 isDirty。這裡仍按「mutator 自己翻」的慣例補上,
		// 讓 onCollide 不依賴後續 onTick 的順序也能維持不變式。
		if (transitioned)
			world.isDirty = true;
	}

	public function onHitboxCollide(hitbox:Hitbox, target:CollidableObject):Void {}

	// ====================================================================
	// 內部: 階段轉場 / OnHit 解析 / Hitbox 複製
	// ====================================================================

	/**
	 * 若 c 是 world.projectiles 中某個 stage=Flying 的 projectile, 推進到 ResolvingHit(0)。
	 *
	 * @return  是否實際發生 stage 轉場 (用於外部決定要不要翻 world.isDirty)
	 */
	function transitionIfFlying(c:CollidableObject):Bool {
		for (proj in world.projectiles) {
			if (sameRef(proj, c)) {
				switch (proj.stage) {
					case Flying:
						proj.stage = ResolvingHit(0);
						return true;
					default:
				}
				return false;
			}
		}
		return false;
	}

	/** 兩個 CollidableObject 是否為同一個 JS 物件參考 (跳過型別檢查直接比 reference) */
	static inline function sameRef(a:Dynamic, b:Dynamic):Bool {
		return a == b;
	}

	/** Projectile 變體是否帶有 onHit 欄位 (Solid / Energy 有, Beam / Field 沒有) */
	static function hasOnHit(p:Projectile):Bool {
		return switch (p) {
			case Solid(_, _, _, _) | Energy(_, _, _): true;
			case Beam(_, _) | Field(_): false;
		}
	}

	/**
	 * 此 projectile 是否因 lifetime 到期而應該觸發 onHit (自爆)。
	 *
	 * 規則:
	 *   - 僅 Solid 攜帶 lifetime 欄位; 其它變體一律回傳 false
	 *   - Solid.lifetime < 0 表示「不計時, 不會因時間到期觸發」, 也回傳 false
	 *   - Solid.lifetime >= 0 且 proj.age >= lifetime: 視為已到期, 回傳 true
	 */
	static function isLifetimeExpired(proj:ProjectileObject):Bool {
		return switch (proj.projectile) {
			case Solid(_, lifetime, _, _):
				lifetime >= 0.0 && proj.age >= lifetime;
			case _:
				false;
		}
	}

	/**
	 * 進入 ResolvingHit 後的本幀執行內容。
	 *   - Solid / Energy: 把 onHit 樹完整跑完一次 (Spawn / SpawnProjectiles / All / None)
	 *   - Field:          直接把 boxes 依 projectile 位置 / 朝向轉為世界 Hitbox
	 *   - Beam:           TODO — 目前不產生 hitbox, 留作日後實作
	 */
	function executeResolve(proj:ProjectileObject):Void {
		switch (proj.projectile) {
			case Solid(_, _, _, onHit) | Energy(_, _, onHit):
				executeOnHit(onHit, proj);
			case Beam(_, _):
				trace('  [ProjectileSystem] Beam resolve TODO: id=${proj.id}');
			case Field(boxes):
				spawnHitboxes(boxes, proj.position, proj.facing);
		}
	}

	/**
	 * 遞迴跑 OnHit 樹。
	 *
	 * 一律在「同一幀」內把樹完整跑完 — ResolvingHit(stepIndex) 的 stepIndex
	 * 目前未用來跨幀分段, 留作日後若要做「多幀延遲效果」時的擴充點。
	 */
	function executeOnHit(onHit:OnHit, proj:ProjectileObject):Void {
		switch (onHit) {
			case Spawn(boxes):
				spawnHitboxes(boxes, proj.position, proj.facing);
			case SpawnProjectiles(children):
				trace('  [ProjectileSystem] SpawnProjectiles TODO: parent=${proj.id} children=${children.length}');
			case All(steps):
				for (step in steps)
					executeOnHit(step, proj);
			case None:
		}
	}

	/** 把一組 Hitbox 模板複製到世界座標 (取 origin/facing) 後 push 進 world.hitboxes */
	function spawnHitboxes(templates:Array<Hitbox>, origin:Vec2, facing:Float):Void {
		for (template in templates)
			world.hitboxes.push(cloneHitboxAt(template, origin, facing));
	}

	/**
	 * 由 Hitbox 模板複製一份, 重設 position / facing 為觸發點。
	 *
	 * shape / damage / reactions 與模板共享參考 (假設為不可變的設定值);
	 * position 必須是新物件, 否則同模板生出的多份 Hitbox 會共用同一個 Vec2 而互相干擾。
	 */
	static function cloneHitboxAt(template:Hitbox, origin:Vec2, facing:Float):Hitbox {
		return {
			id: template.id,
			name: template.name,
			position: {x: origin.x, y: origin.y},
			facing: facing,
			shape: template.shape,
			duration: template.duration,
			cooldownPerTarget: template.cooldownPerTarget,
			damage: template.damage,
			reactions: template.reactions
		};
	}
}
