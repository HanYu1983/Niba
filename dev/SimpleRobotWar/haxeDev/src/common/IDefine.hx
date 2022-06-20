package common;

import haxe.Exception;
import haxe.ds.StringMap;
import haxe.ds.EnumValueMap;
import haxe.Constraints;

// 機體結束前要選擇在敵人回合時的反應行為
enum RobotBattleReaction {
	// 不做任何反應
	// 敵人AI只會用這個
	DO_NOTHING;
	// 反擊
	// 有裝備反應武器時才能選，會自動選擇反擊武器
	// 反擊命中與傷害上升
	// 被擊中時氣力-1, 擊中對方時氣力+2
	COUNTER;
	// 回避
	// 攻擊方命中率下降
	// 成功時氣力+2，有裝備反擊武器時有機率反擊
	EVADE;
	// 防禦
	// 防禦方傷害下降
	// 成功時氣力+2，有裝備反擊武器時有機率反擊
	GUARD;
}

enum Position {
	POS(x:Int, y:Int);
}

enum AttackCost {
	ENERGY(v:Float);
	BULLET(v:Int);
	ACTION(v:Int);
}

enum AttachShape {
	DOT(min:Int, max:Int);
	LINE(min:Int, max:Int);
	CIRCLE(min:Int, max:Int, w:Int);
	SHAPE(pos:Array<Position>);
	SELECT(min:Int, max:Int, w:Int);
}

enum Damage {
	PHYSICS(v:Int);
	BEAM(v:Int);
	FIRE(v:Int);
	EXPLODE(v:Int);
}

enum AttackFlag {
	MELEE;
	BEAM;
	MISSILE;
}

typedef AttackData = {
	title:String,
	cost:Array<AttackCost>,
	attackShape:AttachShape,
	times:Int,
	hitRate:Float,
	damage:Array<Damage>,
	attackFlag:Array<AttackFlag>,
	isMelee:Bool,
}

function getDefaultAttack():AttackData {
	return {
		title: "未命名",
		cost: [],
		attackShape: DOT(0, 0),
		times: 0,
		hitRate: 0,
		damage: [],
		attackFlag: [],
		isMelee: false,
	}
}

enum GuardResult {
	REDUCE(v:Int);
	CANCEL();
}

typedef GuardData = {
	title:String,
	cost:Array<AttackCost>,
	successRate:Float,
	attackFlag:Array<AttackFlag>,
	guardResult:GuardResult,
	isMelee:Bool,
}

function getDefaultGuard():GuardData {
	return {
		title: "未命名",
		cost: [],
		successRate: 0,
		attackFlag: [],
		guardResult: CANCEL,
		isMelee: false,
	}
}

typedef ShieldData = {
	title:String,
	cost:Array<AttackCost>,
	damage:Array<Damage>,
}

typedef WeaponData = {
	title:String,
	bullet:Int,
	attack:Array<AttackData>,
	guard:Array<GuardData>,
	shield:Array<ShieldData>,
	cost:Int
}

function getDefaultWeapon():WeaponData {
	return {
		title: "未命名",
		bullet: 0,
		attack: [],
		guard: [],
		shield: [],
		cost: 0,
	}
}

typedef TerrianData = {
	title:String,
	// 移動成本係數
	moveFactor:Array<Float>,
	// 防守方回避系數
	evade:Float,
	// 防守方防禦系數
	def:Float
}

typedef WeaponAttack = {
	id:String,
	robotId:String,
	weaponId:String,
	data: AttackData,
}

typedef WeaponGuard = {
	id: String,
	robotId: String,
	weaponId: String,
	data: GuardData
}

typedef WeaponShield = {
	id: String,
	robotId: String,
	weaponId: String,
	data: ShieldData
}