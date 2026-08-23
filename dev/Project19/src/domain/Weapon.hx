package domain;

import domain.FieldObject.MountedObject;
import domain.Projectile;

/**
 * 武器類別
 * 招式會宣告所需武器類別 (Skill.requiredCategory),
 * 機體裝備中需有對應類別的武器才能施展該招式
 */
enum WeaponCategory {
	Melee;
	Beam;
	Bullet;
	Missile;
	Special;
}

/**
 * 武器能源來源
 *
 * - NativeEnergy: 共用機體本機能源 (Machine.maxEnergy), 每發消耗 costPerShot
 * - Magazine:     獨立能源匣, 容量 capacity, 每發扣 costPerShot;
 *                 「充填 / 換匣」的時間概念交由日後的 ReloadSystem 表達, 模板層不再附帶
 * - Ammo:         一次性彈藥 (例: 飛彈), 用完即無法再發射
 *
 * 注意 — Magazine 不再帶 reloadTime:
 *   舊版把「reloadTime 秒充填」寫死在 enum 上, 導致同一把武器無法依擁有者狀態
 *   (供彈手是否在場 / 後勤 buff 是否啟用 / 是否被打斷) 動態調整, 因此把這個語意
 *   從模板層拿掉, 由 WeaponOnMachine.magazineLeft 上的「補回多少」交給上層系統決定。
 */
enum PowerSource {
	NativeEnergy(costPerShot:Float);
	Magazine(capacity:Int, costPerShot:Float);
	Ammo(rounds:Int);
}

/**
 * 武器發射方式
 */
enum FireMode {
	/** 單發 */
	Single;

	/** 連發: 連續發射 count 顆, 每顆間隔 interval 秒 */
	Burst(count:Int, interval:Float);

	/** 散發: 一次擊發 count 顆, 散布角度為 spreadAngle (度) */
	Spread(count:Int, spreadAngle:Float);
}

/**
 * 武器定義 / 規格
 *
 * 描述「這是什麼武器」, 不代表它正在場上或裝在誰身上。
 * 同一份定義可以被多個 WeaponOnMachine / WeaponOnField 共用。
 *
 * - id 為武器規格 id (例: plasma_blade)
 * - projectile 為發射物模板; 巢狀爆炸 / 子母彈等行為由 Projectile 自身表達
 * - baseAccuracy 為基礎命中率, 由 SkillStep.WeaponUse.accuracyMul 乘算
 */
typedef WeaponDefinition = {
	var id:String;
	var name:String;
	var category:WeaponCategory;
	var power:PowerSource;
	var fire:FireMode;
	var projectile:Projectile;
	var baseAccuracy:Float;
}

/**
 * 裝備於機體上的武器
 *
 * - id 是裝備實例 id, 由 Skill.WeaponUse.weaponId 引用
 *   例: 同一把 rifle 規格可有 left_rifle / right_rifle 兩個實例
 * - localPosition / localFacing 來自 MountedObject, 表示掛點相對機體的位置與角度
 * - definition 指向武器規格
 *
 * runtime 欄位 (由 impl.WeaponFireSystem 讀寫, 玩家 / AI 只寫 isTrigger):
 *   - isTrigger:     本幀「扣下扳機」的意圖 (玩家輸入 / AI 控制器每幀寫入,
 *                    Single 用 edge 觸發, Burst 用 level 觸發)
 *   - prevTrigger:   上一幀的 isTrigger (由 WeaponFireSystem 在 onTick 末尾寫入),
 *                    給 Single / Spread 模式偵測 rising edge (false → true) 用,
 *                    避免按住扳機就連續觸發
 *   - lastFireTime:  上次成功擊發的時刻 (秒, 以 WeaponFireSystem 自累計的 totalElapsed 為基準),
 *                    Burst 用 (now − lastFireTime ≥ interval) 限制射速.
 *                    初始為 NEGATIVE_INFINITY, 確保第一槍不會被 interval 卡住
 *   - magazineLeft:  Magazine 變體的剩餘能源 (Float, 對應 PowerSource.Magazine.costPerShot).
 *                    其它 PowerSource 變體不使用此欄位 (留 0)
 *   - ammoLeft:      Ammo 變體的剩餘彈數 (Int, 對應 PowerSource.Ammo.rounds).
 *                    其它 PowerSource 變體不使用此欄位 (留 0)
 *
 * 為什麼 magazine / ammo 用兩個欄位而不是一個 unified count:
 *   - 型別不同 (Magazine 是能源 Float / Ammo 是發數 Int) 不能共用同一個原始型別
 *   - 把語意分開可以讓後續系統 (補給 / UI 顯示 / 序列化) 各自處理時不需要 reflect
 *     當下到底是哪一個 variant; 直接拿對應欄位即可
 *   - NativeEnergy 不在此處記狀態, 因為「機體本機能源」屬於 Machine 自身屬性
 *     (currentEnergy 之類; 目前尚未加入, 故 NativeEnergy 武器暫時 unconditionally 允許開火)
 */
typedef WeaponOnMachine = {
	> MountedObject,
	var definition:WeaponDefinition;
	var isTrigger:Bool;
	var prevTrigger:Bool;
	var lastFireTime:Float;
	var magazineLeft:Float;
	var ammoLeft:Int;
}

/**
 * 建立 WeaponOnMachine, 依 definition.power 自動填好 runtime 欄位初始值。
 *
 * 預設值:
 *   - localPosition / localFacing 為原點 + 0 (掛點由呼叫端覆寫)
 *   - isTrigger / prevTrigger = false
 *   - lastFireTime = NEGATIVE_INFINITY (第一槍不被 interval 卡)
 *   - magazineLeft = (Magazine.capacity 視為 Float; 起始為滿匣) / 其它 PowerSource 為 0
 *   - ammoLeft     = (Ammo.rounds; 起始為滿彈) / 其它 PowerSource 為 0
 *
 * 為什麼提供建構工具:
 *   - WeaponOnMachine 加入 runtime 欄位後, 沒有此 helper 的話, sample / test
 *     的每個 literal 都得手填 5 個無關業務的欄位; 集中在工廠裡是最小化變更面的方式
 *   - 之後再加 runtime 欄位 (例如「過熱程度」) 也只需要動本函式 + WeaponFireSystem
 *
 * @param definition     武器規格
 * @param ownerMachineId 掛載的機體 id (與 weapon.ownerMachineId 對齊, 而非透過參考)
 * @param instanceId     裝備實例 id (對應 Skill.WeaponUse.weaponId 用以索引)
 */
function createWeaponOnMachine(definition:WeaponDefinition, ownerMachineId:String, instanceId:String):WeaponOnMachine {
	var magazineLeft:Float = switch (definition.power) {
		case Magazine(capacity, _): capacity;
		case _: 0.0;
	};
	var ammoLeft:Int = switch (definition.power) {
		case Ammo(rounds): rounds;
		case _: 0;
	};
	return {
		id: instanceId,
		name: definition.name,
		ownerMachineId: ownerMachineId,
		localPosition: {x: 0.0, y: 0.0},
		localFacing: 0.0,
		definition: definition,
		isTrigger: false,
		prevTrigger: false,
		lastFireTime: Math.NEGATIVE_INFINITY,
		magazineLeft: magazineLeft,
		ammoLeft: ammoLeft
	};
}

/**
 * 場上武器
 *
 * 表示掉落物、部署武器、砲塔、可拾取裝備等已經有世界座標的武器實體。
 */
typedef WeaponOnField = {
	> FieldObject,
	var definition:WeaponDefinition;
}
