package common;

enum AttackCost {
	ENERGY(v:Float);
	BULLET(v:Int);
	ACTION(v:Int);
}

typedef Position = {
	x:Int,
	y:Int
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
	MELEE(v:Int);
	MISSILE(v:Int);
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
	REDUCE(v:Float);
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
	shield:Array<ShieldData>
}

function getDefaultWeapon():WeaponData {
	return {
		title: "未命名",
		bullet: 0,
		attack: [],
		guard: [],
		shield: []
	}
}

typedef RobotData = {
	title:String,
	hp:Int,
	energy:Int,
	action:Int,
	damage:Array<Damage>,
}

typedef PilotData = {
	title:String,
	// 格鬥技術
	// 主要影響格鬥相關發動機率, 命中率, 爆擊率
	// 次要影響格鬥相關攻擊力
	melee:Int,
	// 射擊技術
	// 主要影響射擊相關發動機率, 命中率, 爆擊率
	// 次要影響射擊相關攻擊力
	range:Int,
	// 攻擊技術
	// 主要影響武器傷害
	// 次要影響武器攻擊相關發動機率, 命中率, 爆擊率
	attack:Int,
	// 防禦技術
	// 主要影響shield的防禦傷害
	// 次要影響武器防禦相關發動機率, 命中率
	guard:Int,
	// 運氣
	// 主要影響獲得金錢, 掉寶率
	// 次要影響爆擊率
	lucky:Int
}

final ROBOTS:Map<String, RobotData> = [
	"量產型" => {
		title: "量產型",
		hp: 1000,
		energy: 200,
		action: 10,
		damage: [PHYSICS(100), EXPLODE(100), BEAM(100), FIRE(100)]
	}
];

final WEAPONS:Map<String, WeaponData> = [
	"實體刀" => {
		title: "實體刀",
		bullet: 0,
		attack: [
			{
				title: "斬擊",
				cost: [ACTION(2)],
				attackShape: DOT(1, 1),
				times: 2,
				hitRate: 0.9,
				damage: [PHYSICS(100)],
				attackFlag: [MELEE(100)],
				isMelee: true,
			}
		],
		guard: [
			{
				title: "斬落飛彈",
				cost: [ACTION(2)],
				successRate: 0.7,
				attackFlag: [MELEE(100), MISSILE(100)],
				guardResult: REDUCE(0.2),
				isMelee: true,
			}
		],
		shield: [],
	},
	"實體光束刀" => {
		title: "實體光束刀",
		bullet: 0,
		attack: [
			{
				title: "斬擊",
				cost: [ACTION(2), ENERGY(10)],
				attackShape: DOT(1, 1),
				times: 2,
				hitRate: 0.9,
				damage: [PHYSICS(50), BEAM(50)],
				attackFlag: [],
				isMelee: true,
			}
		],
		guard: [],
		shield: [],
	},
	"火神砲" => {
		title: "火神砲",
		bullet: 2000,
		attack: [
			{
				title: "",
				cost: [BULLET(100)],
				attackShape: DOT(1, 1),
				times: 10,
				hitRate: 0.9,
				damage: [PHYSICS(2)],
				attackFlag: [],
				isMelee: true,
			}
		],
		guard: [
			{
				title: "擊落飛彈",
				cost: [ACTION(2), BULLET(100)],
				successRate: 0.2,
				attackFlag: [MELEE(10), MISSILE(100)],
				guardResult: REDUCE(0.2),
				isMelee: true,
			}
		],
		shield: [],
	},
	"飛彈發射器" => {
		title: "飛彈發射器",
		bullet: 16,
		attack: [
			{
				title: "發射飛彈",
				cost: [ACTION(2), BULLET(4)],
				attackShape: SELECT(1, 6, 3),
				times: 4,
				hitRate: 0.3,
				damage: [EXPLODE(100)],
				attackFlag: [MISSILE(100)],
				isMelee: false,
			}
		],
		guard: [],
		shield: [],
	},
	"實體盾牌" => {
		title: "實體盾牌",
		bullet: 0,
		attack: [
			{
				title: "撞擊",
				cost: [ACTION(2)],
				attackShape: DOT(1, 1),
				times: 2,
				hitRate: 0.9,
				damage: [PHYSICS(50)],
				attackFlag: [MELEE(100)],
				isMelee: true,
			}
		],
		guard: [
			{
				title: "盾牌防禦",
				cost: [ACTION(2)],
				successRate: 0.7,
				attackFlag: [MELEE(100), MISSILE(100)],
				guardResult: REDUCE(0.5),
				isMelee: true,
			}
		],
		shield: [],
	},
	"重裝甲" => {
		title: "重裝甲",
		bullet: 0,
		attack: [],
		guard: [],
		shield: [
			{
				title: "重裝保護",
				cost: [ACTION(1)],
				damage: [PHYSICS(100), BEAM(10), EXPLODE(10)],
			}
		],
	}
];
