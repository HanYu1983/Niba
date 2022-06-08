package common;

// https://haxe.org/manual/std-serialization.html
// 使用StringMap可以支援序列化
import haxe.Exception;
import haxe.ds.StringMap;

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

final WEAPONS:StringMap<WeaponData> = [
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

// ======================================================
// DEFINE
// ======================================================

typedef Pilot = {
	id:String,
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
	// 次要影響武器防禦相關發動機率
	guard:Int,
	// 運氣
	// 主要影響獲得金錢, 掉寶率
	// 次要影響爆擊率
	lucky:Int
}

function createPilot(id:String):Pilot {
	final names:Array<String> = [
		'白絲', '傲萍', '涵珍', '訪蝶', '映青', '醉琴', '涵萍', '傲安', '覓亦', '向荷', '曼桃', '半南', '思凡', '新真', '平凡', '天彤', '爾安', '凌蕾', '安春', '訪雪', '綺夏', '香丹', '問柳', '懷嵐', '曉海',
		'雨荷', '代桃', '安秋', '書蝶', '向霜', '雁青', '靜曼', '幻白', '翠荷', '依亦', '雨天', '靜曼', '友藍', '雁露', '醉雲', '寄曼', '聽霜', '丹芙', '海曼', '天竹', '如夢', '元曼', '覓筠', '飛芹', '平雲',
		'癡玉', '盼青', '依芙', '紫凝', '綠蘭', '覓蓉', '語凡', '又筠', '思寒', '傲竹', '冬蓉', '尋風', '翠南', '凡珊', '念筠', '幻珍', '覓霜', '綺彤', '雅露', '平玉', '幻雁', '新絲', '笑蘭', '向琴', '笑海',
		'香卉', '友陽', '夢兒', '冬蝶', '以白', '夏白', '宛芹', '癡露', '初雙', '夜春', '元柏', '妙雲', '凌靈', '涵翠', '書旋', '覓風', '懷陽', '曉荷', '映筠', '盼萱', '沛真', '巧薇', '山翠', '雪藍', '醉露',
		'慕易', '靖風', '憶晴', '醉桃', '凡旋', '爾容', '飛荷', '香蕾', '半雪', '夜柏', '千凡', '靖煙', '冰萱', '寒安', '映真', '爾青', '水藍', '靜珊', '冰玉', '采陽', '雪綠', '綺晴', '山晴', '山丹', '思波',
		'傲煙', '雅玉', '綺藍', '沛琴', '如柔', '醉梅', '宛蝶', '冷陽', '懷柏', '青寒', '夏雲', '翠珊', '慕蕾', '白柳', '宛槐', '醉云', '元波', '亦絲', '青荷', '寒雪', '凝蘭', '曉柳', '香槐', '綠梅', '訪柏',
		'詩波', '小荷', '巧容', '幼海', '幼山', '友晴', '丹菡', '雁煙', '爾安', '爾玉', '碧卉', '凌松', '初香', '易竹', '元易', '之容', '曼冬', '懷之', '笑瑤', '綠楓', '水波', '妙松', '丹秋', '又旋', '映竹',
		'詩雙', '飛蕾', '千曼', '笑蕊', '千易', '采萍', '代陽', '又竹', '平瑤', '寒嵐', '南波', '宛雪', '雅蓮', '夢霜', '念芹', '傲柔', '雁霜', '綠夏', '訪曼', '傲凡', '映珍', '夜竹', '代柳', '水南', '翠巧'
	];
	final name = names[Std.int(Math.random() * names.length)];
	return {
		id: id,
		title: name,
		melee: 0,
		range: 0,
		attack: 0,
		guard: 0,
		lucky: 0
	}
}

typedef Robot = {
	id:String,
	title:String,
	hp:Int,
	energy:Int,
	action:Int,
	maxHp:Int,
	maxEnergy:Int,
	maxAction:Int,
	damage:Array<Damage>,
	position:Null<Position>
}

function createRobot(id:String):Robot {
	final names:Array<String> = ['鋼彈'];
	final name = names[Std.int(Math.random() * names.length)];
	return {
		id: id,
		title: name,
		hp: 0,
		energy: 0,
		action: 0,
		maxHp: 0,
		maxEnergy: 0,
		maxAction: 0,
		damage: [],
		position: null
	}
}

typedef Weapon = {
	id:String,
	dataId:String,
	level:Int,
	bullet:Int
}

function createWeapon(id:String):Weapon {
	return {
		id: id,
		dataId: "實體光束刀",
		level: 0,
		bullet: 0
	}
}

typedef Player = {
	id:String,
	brain:Null<Dynamic>,
	fraction:Int,
	pilots:StringMap<Pilot>,
	robots:StringMap<Robot>,
	weapons:StringMap<Weapon>,
	pilotToRobot:StringMap<String>,
	weaponToRobot:StringMap<String>,
}

typedef Context = {
	players:StringMap<Player>,
	currentPlayerId:String,
	turn:Int
}

function getPlayer(ctx:Context, playerId:String):Player {
	final player = ctx.players.get(playerId);
	if (player == null) {
		throw new Exception('player not found:${playerId}');
	}
	return player;
}

function getRobot(ctx:Context, playerId:String, robotId:String):Robot {
	final player = getPlayer(ctx, playerId);
	final robot = player.robots.get(robotId);
	if (robot == null) {
		throw new Exception('robot not found:${robotId}');
	}
	return robot;
}

function getWeapon(ctx:Context, playerId:String, weaponId:String):Weapon {
	final player = getPlayer(ctx, playerId);
	final weapon = player.weapons.get(weaponId);
	if (weapon == null) {
		throw new Exception('weapon not found:${weaponId}');
	}
	return weapon;
}

function getRobotPilot(ctx:Context, playerId:String, robotId:String):Null<Pilot> {
	final player = getPlayer(ctx, playerId);
	final robot = getRobot(ctx, playerId, robotId);
	final ids = [
		for (kv in player.pilotToRobot.keyValueIterator()) {
			final filter = switch kv {
				case {key: key, value: value} if (value == robotId):
					true;
				case _:
					false;
			}
			if (filter) {
				kv.key;
			}
		}
	];
	if (ids.length == 0) {
		return null;
	}
	final id = ids[0];
	return player.pilots.get(id);
}

function getRobotWeapons(ctx:Context, playerId:String, robotId:String):Array<Weapon> {
	final player = getPlayer(ctx, playerId);
	final robot = getRobot(ctx, playerId, robotId);
	final weaponIds = [
		for (kv in player.weaponToRobot.keyValueIterator()) {
			final filter = switch kv {
				case {key: key, value: value} if (value == robotId):
					true;
				case _:
					false;
			}
			if (filter) {
				kv.key;
			}
		}
	];
	return weaponIds.map(id -> {
		final weapon = player.weapons.get(id);
		if (weapon == null) {
			throw new Exception('weapon not found:${id}');
		}
		return (weapon : Weapon);
	});
}

function getBattleResult(ctx:Context, playerId:String, robotId:String, weaponId:String, targets:Array<{playerId:String, robotId:String}>) {
	final player = getPlayer(ctx, playerId);
	final robot = getRobot(ctx, playerId, robotId);
	final weapon = getWeapon(ctx, playerId, weaponId);
	final pilot = getRobotPilot(ctx, playerId, robotId);
	for (target in targets) {
		final targetPlayer = getPlayer(ctx, target.playerId);
		final targetRobot = getRobot(ctx, target.playerId, target.robotId);
		final targetPilot = getRobotPilot(ctx, target.playerId, target.robotId);
	}
}
