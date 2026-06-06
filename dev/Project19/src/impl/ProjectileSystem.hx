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

		// 只在 splice 實際發生時翻 isDirty (對應 World.isDirty 的「增刪才翻」規則):
		// proj.age / stage 修改不翻 — RenderWorld 透過 array.copy() 的 shallow snapshot
		// 持有同一份 projectile 參考, 屬性變化會自然反映到下一個 P5Tick 的 render frame。
		var i = world.projectiles.length;
		while (i-- > 0) {
			switch (world.projectiles[i].stage) {
				case Expired:
					world.projectiles.splice(i, 1);
					world.isDirty = true;
				default:
			}
		}
	}

	public function onMousePressed(x:Float, y:Float):Void {}

	public function onMouseRelease():Void {}

	public function onMouseMoved(x:Float, y:Float):Void {}

	public function onMouseDragged(x:Float, y:Float):Void {}

	public function onCollide(a:CollidableObject, b:CollidableObject):Void {
		// 只是把 projectile.stage 從 Flying 轉成 ResolvingHit, 不對 world 陣列做增刪,
		// 因此不翻 isDirty (見 World.isDirty 的「只在增刪時翻」規則)。
		// 同幀稍後的 ProjectileSystem.onTick 會把 ResolvingHit → executeResolve (可能 push hitbox),
		// 真正影響 render snapshot 的 hitbox 新增由那邊翻 flag。
		transitionIfFlying(a);
		transitionIfFlying(b);
	}

	public function onHitboxCollide(hitbox:Hitbox, target:CollidableObject):Void {}

	// ====================================================================
	// 內部: 階段轉場 / OnHit 解析 / Hitbox 複製
	// ====================================================================

	/** 若 c 是 world.projectiles 中某個 stage=Flying 的 projectile, 推進到 ResolvingHit(0) */
	function transitionIfFlying(c:CollidableObject):Void {
		for (proj in world.projectiles) {
			if (sameRef(proj, c)) {
				switch (proj.stage) {
					case Flying:
						proj.stage = ResolvingHit(0);
					default:
				}
				return;
			}
		}
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

	/**
	 * 把一組 Hitbox 模板複製到世界座標 (取 origin/facing) 後 push 進 world.hitboxes。
	 *
	 * 實際 push 任一筆即視為「在 world 陣列上發生增刪」, 翻 world.isDirty,
	 * 讓 DirtyWorldPublisher 在本幀末 emit, 確保新 hitbox 進入下一個 render snapshot。
	 * 空 templates 不翻 (沒有實際增刪)。
	 */
	function spawnHitboxes(templates:Array<Hitbox>, origin:Vec2, facing:Float):Void {
		if (templates.length == 0)
			return;
		for (template in templates)
			world.hitboxes.push(cloneHitboxAt(template, origin, facing));
		world.isDirty = true;
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
