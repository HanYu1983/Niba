package common;

// https://haxe.org/manual/std-serialization.html
// 使用StringMap可以支援序列化
import haxe.Exception;
import haxe.ds.StringMap;
import haxe.ds.IntMap;

using Lambda;

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

private final WEAPONS:StringMap<WeaponData> = [
	"實體刀" => {
		title: "實體刀",
		cost: 0,
		bullet: 0,
		attack: [
			{
				title: "斬擊",
				cost: [ACTION(2)],
				attackShape: DOT(1, 1),
				times: 2,
				hitRate: 0.9,
				damage: [PHYSICS(100)],
				attackFlag: [MELEE],
				isMelee: true,
			}
		],
		guard: [
			{
				title: "斬落飛彈",
				cost: [ACTION(2)],
				successRate: 0.7,
				attackFlag: [MELEE, MISSILE],
				guardResult: REDUCE(100),
				isMelee: true,
			}
		],
		shield: [],
	},
	"實體光束刀" => {
		title: "實體光束刀",
		cost: 0,
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
		cost: 0,
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
				attackFlag: [MELEE, MISSILE],
				guardResult: REDUCE(100),
				isMelee: true,
			}
		],
		shield: [],
	},
	"飛彈發射器" => {
		title: "飛彈發射器",
		cost: 0,
		bullet: 16,
		attack: [
			{
				title: "發射飛彈",
				cost: [ACTION(2), BULLET(4)],
				attackShape: SELECT(1, 6, 3),
				times: 4,
				hitRate: 0.3,
				damage: [EXPLODE(100)],
				attackFlag: [MISSILE],
				isMelee: false,
			}
		],
		guard: [],
		shield: [],
	},
	"實體盾牌" => {
		title: "實體盾牌",
		cost: 0,
		bullet: 0,
		attack: [
			{
				title: "撞擊",
				cost: [ACTION(2)],
				attackShape: DOT(1, 1),
				times: 2,
				hitRate: 0.9,
				damage: [PHYSICS(50)],
				attackFlag: [MELEE],
				isMelee: true,
			}
		],
		guard: [
			{
				title: "盾牌防禦",
				cost: [ACTION(2)],
				successRate: 0.7,
				attackFlag: [MELEE, MISSILE],
				guardResult: REDUCE(100),
				isMelee: true,
			}
		],
		shield: [],
	},
	"重裝甲" => {
		title: "重裝甲",
		cost: 0,
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
	},
	"光束防護罩" => {
		title: "光束防護罩",
		cost: 0,
		bullet: 0,
		attack: [],
		guard: [
			{
				title: "光束吸收",
				cost: [ENERGY(10)],
				successRate: 1.0,
				attackFlag: [BEAM],
				guardResult: REDUCE(100),
				isMelee: true,
			}
		],
		shield: [],
	}
];

function getWeaponData(id:String):WeaponData {
	final data = WEAPONS.get(id);
	if (data == null) {
		throw new Exception('weaponData not found:${id}');
	}
	return data;
}

typedef Terrian = {
	title:String,
	// 移動成本係數
	moveFactor:Array<Float>,
	// 防守方回避系數
	evade:Float,
	// 防守方防禦系數
	def:Float
}

final TERRIANS:Array<Terrian> = [
	{
		title: "海",
		moveFactor: [1, 1.25, 1.5, 2],
		evade: 2,
		def: 1
	},
	{
		title: "平原",
		moveFactor: [2, 1, 1.25, 1.5],
		evade: 1,
		def: 1
	},
	{
		title: "森林",
		moveFactor: [1.5, 1.25, 1, 1.25],
		evade: 1.5,
		def: 1.5
	},
	{
		title: "山",
		moveFactor: [2, 1.5, 1.25, 1],
		evade: 1.5,
		def: 2
	}
];
