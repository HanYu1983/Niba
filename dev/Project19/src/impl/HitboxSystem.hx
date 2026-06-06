package impl;

import domain.Collision.Hitbox;
import domain.FieldObject.CollidableObject;
import domain.World;
import haxe.ds.ObjectMap;

/**
 * 維護 world.hitboxes 生命週期、命中記錄表與 cooldownPerTarget 的系統。
 *
 * 職責分工 (對應 domain.Collision.Hitbox 的戰鬥規則):
 *   1. 老化:        每個 Hitbox 每幀 age += dt
 *   2. 過期回收:    duration >= 0 且 age >= duration → 從 world.hitboxes 移除,
 *                   命中記錄表一併釋放 (對應戰鬥規則第 8 條)
 *      duration < 0 視為「不計時, 不會過期」(語意上同 Projectile.lifetime 的負值約定)
 *   3. 命中記錄表:  每個 Hitbox 維護「被命中過的 target → 上次命中時間」,
 *                   時間軸是該 Hitbox 自身的 age (相對時間, 不受 frameCount 影響)
 *   4. cooldownPerTarget 過濾:
 *                   CollisionSystem 透過 onHitboxCollide 通知「幾何相交」,
 *                   本系統檢查目標是否仍在冷卻內:
 *                     - 未命中過    → 立即觸發 onDamage, 登記命中時間
 *                     - 已命中且冷卻未過 (age - lastHitTime < cooldownPerTarget) → 略過
 *                     - 已命中且冷卻已過                                          → 重新觸發, 更新登記
 *
 * 暫不處理 (留 TODO):
 *   - reactions (Knockback / Stagger / Burn 等): 用戶指示先略過,
 *     接收端如有需要可自行從 hitbox.reactions 讀取
 *   - damage 套用流程 (扣 HP / defense 折抵 / 死亡判定): 由 onDamage 接收端負責
 *
 * 與其他系統的順序要求 (HelloWorld 系統陣列):
 *   HitboxSystem 應排在 CollisionSystem 之前:
 *     - HitboxSystem.onTick 先 age / 清過期 → 確保 CollisionSystem 不會對「應該已死」的
 *       Hitbox 做檢測
 *     - CollisionSystem 再跑碰撞偵測, 命中時透過 fan-out listener 呼叫
 *       HitboxSystem.onHitboxCollide
 *     - HitboxSystem.onHitboxCollide 過濾 cooldown 後 emit onDamage 給 damageListener
 *
 * 注意:
 *   - 本系統假設 world.hitboxes 的 push / splice「只由 ProjectileSystem 推進 / HitboxSystem 清除」;
 *     如果未來新增其他路徑外部 splice 了 hitbox, 內部 states map 會殘留記錄 (記憶體洩漏).
 *     若發生請改成在 onTick 開頭做 states ↔ world.hitboxes 對齊掃描
 *   - 命中記錄表用 Array<HitEntry> 線性查找; 單一 Hitbox 一輩子接觸的 target 數量
 *     在實戰中通常很小 (個位數), 不額外引入 inner Map 的記憶體開銷
 */
class HitboxSystem implements ISystem {
	static inline final MS_PER_SECOND = 1000.0;

	final world:World;
	final listener:IHitboxDamageListener;

	/** Hitbox 參考 → 本系統為它維護的執行期狀態 (age / 命中記錄表) */
	final states:ObjectMap<Hitbox, HitboxState>;

	public function new(world:World, listener:IHitboxDamageListener) {
		this.world = world;
		this.listener = listener;
		this.states = new ObjectMap();
	}

	public function onSetup():Void {}

	public function onClick(id:String):Void {}

	public function onTick(frameCount:Int, deltaTime:Float):Void {
		var dt = deltaTime / MS_PER_SECOND;

		for (hitbox in world.hitboxes) {
			getOrCreateState(hitbox).age += dt;
		}

		// 倒序掃描刪除已過期; duration < 0 視為「不計時」, 跳過。
		// 只在實際 splice 時翻 isDirty (對應 World.isDirty 的「增刪才翻」規則)。
		var i = world.hitboxes.length;
		while (i-- > 0) {
			var hitbox = world.hitboxes[i];
			if (hitbox.duration < 0.0)
				continue;
			var state = states.get(hitbox);
			if (state != null && state.age >= hitbox.duration) {
				states.remove(hitbox);
				world.hitboxes.splice(i, 1);
				world.isDirty = true;
			}
		}
	}

	public function onMousePressed(x:Float, y:Float):Void {}

	public function onMouseRelease():Void {}

	public function onMouseMoved(x:Float, y:Float):Void {}

	public function onMouseDragged(x:Float, y:Float):Void {}

	public function onCollide(a:CollidableObject, b:CollidableObject):Void {}

	public function onHitboxCollide(hitbox:Hitbox, target:CollidableObject):Void {
		// CollisionSystem 通知「Hitbox 與 target 幾何相交」, 由本系統決定是否實際 emit onDamage:
		//   - 第一次命中  → 登記命中時間, emit
		//   - 仍在 cooldown → 略過 (不 emit, 不更新時間)
		//   - cooldown 已過 → 更新命中時間, emit
		var state = getOrCreateState(hitbox);
		var entry = findHitEntry(state.hits, target);
		if (entry == null) {
			state.hits.push({target: target, lastHitTime: state.age});
		} else {
			var elapsed = state.age - entry.lastHitTime;
			if (elapsed < hitbox.cooldownPerTarget)
				return;
			entry.lastHitTime = state.age;
		}
		// reactions 部分暫不處理 (用戶指示先略過);
		// 後續若加入 ReactionSystem, 可以在這裡或由 onDamage 接收端解讀 hitbox.reactions
		listener.onDamage(hitbox, target);
	}

	/** 本系統是事件源, 不消費 onDamage; 空實作以滿足 ISystem extends IHitboxDamageListener */
	public function onDamage(hitbox:Hitbox, target:CollidableObject):Void {}

	// ====================================================================
	// 內部: state 表存取 / 命中表線性查找
	// ====================================================================

	function getOrCreateState(hitbox:Hitbox):HitboxState {
		var state = states.get(hitbox);
		if (state != null)
			return state;
		var newState:HitboxState = {age: 0.0, hits: []};
		states.set(hitbox, newState);
		return newState;
	}

	static function findHitEntry(hits:Array<HitEntry>, target:CollidableObject):Null<HitEntry> {
		for (entry in hits) {
			if (entry.target == target)
				return entry;
		}
		return null;
	}
}

/**
 * 單一 Hitbox 在 HitboxSystem 中維護的執行期狀態。
 *
 * @field age   此 Hitbox 自被本系統首次見到以來累計的秒數,
 *              既用於 duration 過期判定, 也作為 hits[].lastHitTime 的時間軸
 * @field hits  命中記錄表: 每一筆代表「過去曾命中過 target, 最後一次發生在 lastHitTime」
 */
private typedef HitboxState = {
	var age:Float;
	var hits:Array<HitEntry>;
}

/** 命中記錄表的一筆條目 (target + 上次命中時間, 對齊 HitboxState.age 時間軸) */
private typedef HitEntry = {
	var target:CollidableObject;
	var lastHitTime:Float;
}
