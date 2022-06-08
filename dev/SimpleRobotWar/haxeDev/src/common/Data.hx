package common;

typedef ComponentData = {
	title:String
}

typedef WeaponShootType = {
	title:String
}

typedef RobotData = {
	title:String
}

enum AttackCost {
	ENERGY(v:Float);
	BULLET(v:Int);
	ACTION(v:Int);
}

typedef Position = {
	x:Int,
	y:Int
}

enum AttackRange {
	DOT;
	LINE(min:Int, max:Int);
	BOX(w:Int, h:Int);
	SHAPE(pos:Array<Position>);
	SELECT(w:Int, h:Int, cnt:Int);
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
	range:AttackRange,
	times:Int,
	hitRate:Float,
	damage:Array<Damage>,
	flag:Array<AttackFlag>
}

function getDefaultAttack():AttackData {
	return {
		title: "未命名",
		cost: [],
		range: DOT,
		times: 0,
		hitRate: 0,
		damage: [],
		flag: []
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
	guardFlag:Array<AttackFlag>,
	guardResult:GuardResult,
}

function getDefaultGuard():GuardData {
	return {
		title: "未命名",
		cost: [],
		successRate: 0,
		guardFlag: [],
		guardResult: CANCEL
	}
}

typedef WeaponData = {
	title:String,
	bullet:Int,
	attack:Array<AttackData>,
	guard:Array<GuardData>
}

function getDefaultWeapon():WeaponData {
	return {
		title: "未命名",
		bullet: 0,
		attack: [],
		guard: [],
	}
}

final WEAPONS:Map<String, WeaponData> = [
	"實體刀" => {
		title: "實體刀",
		bullet: 0,
		attack: [
			{
				title: "斬擊",
				cost: [ACTION(2)],
				range: DOT,
				times: 2,
				hitRate: 0.9,
				damage: [PHYSICS(100)],
				flag: [MELEE(100)]
			}
		],
		guard: [
			{
				title: "斬落飛彈",
				cost: [ACTION(2)],
				successRate: 0.7,
				guardFlag: [MELEE(100), MISSILE(100)],
				guardResult: REDUCE(0.2)
			}
		],
	},
	"實體光束刀" => {
		title: "實體光束刀",
		bullet: 0,
		attack: [
			{
				title: "斬擊",
				cost: [ACTION(2), ENERGY(10)],
				range: DOT,
				times: 2,
				hitRate: 0.9,
				damage: [PHYSICS(50), BEAM(50)],
				flag: [],
			}
		],
		guard: [],
	},
	"火神砲" => {
		title: "火神砲",
		bullet: 2000,
		attack: [
			{
				title: "",
				cost: [BULLET(100)],
				range: DOT,
				times: 10,
				hitRate: 0.9,
				damage: [PHYSICS(2)],
				flag: [],
			}
		],
		guard: [
			{
				title: "擊落飛彈",
				cost: [ACTION(2), BULLET(100)],
				successRate: 0.2,
				guardFlag: [MELEE(10), MISSILE(100)],
				guardResult: REDUCE(0.2)
			}
		],
	},
	"飛彈發射器" => {
		title: "飛彈發射器",
		bullet: 16,
		attack: [
			{
				title: "發射飛彈",
				cost: [ACTION(2), BULLET(4)],
				range: SELECT(3, 3, 4),
				times: 4,
				hitRate: 0.3,
				damage: [EXPLODE(100)],
				flag: [MISSILE(100)],
			}
		],
		guard: [],
	},
	"實體盾牌" => {
		title: "實體盾牌",
		bullet: 0,
		attack: [
			{
				title: "撞擊",
				cost: [ACTION(2)],
				range: DOT,
				times: 2,
				hitRate: 0.9,
				damage: [PHYSICS(50)],
				flag: [MELEE(100)]
			}
		],
		guard: [
			{
				title: "盾牌防禦",
				cost: [ACTION(2)],
				successRate: 0.7,
				guardFlag: [MELEE(100), MISSILE(100)],
				guardResult: REDUCE(0.5)
			}
		]
	}
];

final COMPONENTS:Map<String, ComponentData> = [];
