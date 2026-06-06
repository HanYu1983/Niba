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

/** 'C' 鍵的 p5 keyCode — 用來射子母彈 (cluster munition) */
private inline final C_KEY_CODE = 67;

/**
 * 偵錯用發射物產生器。
 *
 * 按鍵對應:
 *   - 空白鍵 (keyCode 32): 普通 Solid + Spawn(爆炸 Hitbox) — 驗證基本飛行 / 命中 / 爆炸流
 *   - 'C'    (keyCode 67): 子母彈 — Solid + SpawnProjectiles(4 顆子彈, 每顆再 Spawn 小爆炸),
 *                          驗證 ProjectileSystem.SpawnProjectiles 的 360° 散佈 + 子彈鏈式爆炸
 *
 * 共同驗證項目:
 *   - MovementSystem 是否正確推進 ProjectileObject.position (velocity * dt)
 *   - CollisionSystem 是否在飛行物碰到其他 collidable 時發 onCollide
 *   - ProjectileSystem 是否把 stage 從 Flying → ResolvingHit → Expired
 *   - OnHit.Spawn / SpawnProjectiles 是否能在命中點分別生出新的 Hitbox / 子 ProjectileObject
 *
 * 設計選擇:
 *   - 不註冊為 ISystem; key 事件目前不在 ISystem 介面內 (見 ISystem doc),
 *     view 層的元件直接訂閱 eventSubject 是現有慣例 (參考 CameraController)
 *   - 訂閱模式: worldSubject.switchMap(eventSubject), 與 CameraController 一致;
 *     確保產生 projectile 時拿到的是 BehaviorSubject 上最新的 world 參考
 *   - 產生後翻 world.isDirty = true; 實際 render 發送由
 *     view.component.DirtyWorldPublisher 在下一 P5Tick 收尾批次處理 (見 World.hx 不變式)
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
			world.isDirty = true;
		case P5KeyPressed(_, keyCode) if (keyCode == C_KEY_CODE):
			counter.value++;
			world.projectiles.push(buildClusterProjectile(counter.value));
			world.isDirty = true;
		default:
	}
}

/**
 * 建立一顆 demo projectile。
 *
 * 屬性 (寫死於此, 不對外暴露):
 *   - position (0, 0), velocity (200, 0), maxSpeed 200 → 朝 +X 方向飛行
 *   - shape Circle(0, 0, 4)                            → 半徑 4 的圓
 *   - projectile = Solid(speed 200, lifetime 1.0,
 *                        Physical 10,
 *                        Spawn([explosionHitbox]))     → 命中或飛行 1 秒未命中皆觸發爆炸
 *                                                        (半徑 30 / duration 0.1 的 Hitbox)
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
		projectile: Solid(200.0, 1.0, {type: Physical, amount: 10.0}, Spawn([
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

/** 子母彈會散出的子彈顆數 (寫死 4 顆, 由 ProjectileSystem 均分到 360°) */
private inline final CLUSTER_CHILD_COUNT = 4;

/**
 * 建立一顆「子母彈」(cluster munition) 形式的 demo projectile。
 *
 * 流程:
 *   1. 母彈從世界原點朝 +X 方向飛, lifetime 0.6 秒 → 約 120 世界單位後自爆 (或更早命中時提前觸發)
 *   2. 母彈 onHit = SpawnProjectiles(CLUSTER_CHILD_COUNT 顆 Solid 子彈)
 *      ProjectileSystem.spawnChildProjectiles 會把這些子彈以「母彈朝向 + i/N * 2π」均分 360° 散開
 *   3. 每顆子彈再以 Solid + Spawn(小爆炸 Hitbox) 飛 0.8 秒後自爆 →
 *      期望畫面上會看到母彈飛一小段後爆出 4 顆子彈, 各自呈放射狀飛行, 再各自爆出小爆炸
 *
 * 屬性對比 (與 buildDebugProjectile):
 *   - shape 較大 (半徑 6), 視覺上一眼分辨「這是母彈」
 *   - 母彈本身的接觸 damage 較小 (子彈才是主要傷害輸出), 用 Physical 5
 *
 * @param sequence 此次 session 內的順序編號, 用來組出唯一 id (避免 push 多顆時 id 重複)
 */
private function buildClusterProjectile(sequence:Int):ProjectileObject {
	return {
		id: 'debug_cluster_$sequence',
		name: "Debug Cluster",
		position: {x: 0.0, y: 0.0},
		facing: 0.0,
		velocity: {x: 200.0, y: 0.0},
		maxSpeed: 200.0,
		shape: Circle(0.0, 0.0, 6.0),
		projectile: Solid(200.0, 0.6, {type: Physical, amount: 5.0}, SpawnProjectiles(
			buildClusterChildren(sequence)
		)),
		age: 0.0,
		stage: Flying
	};
}

/** 組出 CLUSTER_CHILD_COUNT 顆子彈模板; 每顆模板長一樣, 散佈方向由 ProjectileSystem 計算 */
private function buildClusterChildren(sequence:Int):Array<Projectile> {
	return [for (index in 0...CLUSTER_CHILD_COUNT) buildClusterChild(sequence, index)];
}

/**
 * 建立子母彈的一顆「子彈模板」(Projectile enum).
 *
 * 注意 Projectile 模板本身不帶 position / facing / shape 等場上屬性 — 那些由
 * ProjectileSystem.buildChildProjectile 在 SpawnProjectiles 解析時, 依母彈狀態 + 散佈索引導出。
 * 這裡只決定:
 *   - speed:     子彈標量速度 (世界單位/秒)
 *   - lifetime:  子彈飛多久後自爆
 *   - damage:    接觸傷害
 *   - onHit:     命中或自爆時生成的 Hitbox 模板 (小爆炸)
 *
 * id 命名規則包含 sequence 與 index 以避免不同次 / 不同方向的子彈生出的 Hitbox 共用 id —
 * ProjectileSystem.cloneHitboxAt 目前不重新命名 Hitbox.id, 命名衝突要由模板層先排除。
 */
private function buildClusterChild(sequence:Int, index:Int):Projectile {
	return Solid(140.0, 3.0, {type: Physical, amount: 8.0}, Spawn([
		{
			id: 'debug_cluster_${sequence}_child_${index}_explosion',
			name: "Debug Cluster Sub-Explosion",
			position: {x: 0.0, y: 0.0},
			facing: 0.0,
			shape: Circle(0.0, 0.0, 15.0),
			duration: 0.1,
			cooldownPerTarget: Math.POSITIVE_INFINITY,
			damage: {type: Explosion, amount: 20.0},
			reactions: []
		}
	]));
}
