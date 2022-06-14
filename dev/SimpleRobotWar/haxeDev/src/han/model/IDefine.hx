package han.model;

import haxe.ds.StringMap;
import haxe.ds.EnumValueMap;
import haxe.Exception;
import common.IDefine;
import common.WeaponData;
import common.TerrianData;

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

enum RobotFlag {
	HAS_MOVE;
	HAS_ATTACK;
	HAS_DONE;
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
	terrian:Array<Float>,
	flags:Array<RobotFlag>
}

function createRobot(id:String):Robot {
	final names:Array<String> = ['鋼彈','怪獸'];
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
		terrian: [0, 1, 0, 0],
		flags: []
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

typedef WeaponAttack = {
	id:String,
	weaponId:String,
	title:String,
	cost:Array<AttackCost>,
	attackShape:AttachShape,
	times:Int,
	hitRate:Float,
	damage:Array<Damage>,
	attackFlag:Array<AttackFlag>,
	isMelee:Bool,
}

typedef Player = {
	id:String,
	brain:Null<Dynamic>,
	fraction:Int,
}

typedef Grid = {
	terrianId:Int
}

function getRandomMap(w:Int, h:Int):EnumValueMap<Position, Grid> {
	return [
		for (x in 0...w) {
			for (y in 0...h) {
				POS(x, y) => {
					terrianId: Std.int(Math.random() * TERRIANS.length)
				}
			}
		}
	];
}

typedef Context = {
	grids:EnumValueMap<Position, Grid>,
	players:StringMap<Player>,
	currentPlayerId:Null<String>,
	turn:Int,
	pilots:StringMap<Pilot>,
	robots:StringMap<Robot>,
	weapons:StringMap<Weapon>,
	pilotToRobot:StringMap<String>,
	weaponToRobot:StringMap<String>,
	robotToPlayer:StringMap<String>,
	positionToRobot:EnumValueMap<Position, String>,
	idSeq:Int,
}

function getDefaultContext():Context {
	return {
		grids: new EnumValueMap<Position, Grid>(),
		players: new StringMap<Player>(),
		currentPlayerId: null,
		turn: 0,
		pilots: new StringMap<Pilot>(),
		robots: new StringMap<Robot>(),
		weapons: new StringMap<Weapon>(),
		pilotToRobot: new StringMap<String>(),
		weaponToRobot: new StringMap<String>(),
		robotToPlayer: new StringMap<String>(),
		positionToRobot: new EnumValueMap<Position, String>(),
		idSeq: 0,
	}
}

function getGrid(ctx:Context, gridId:Position):Grid {
	final grid = ctx.grids.get(gridId);
	if (grid == null) {
		throw new Exception('grid not found:${gridId}');
	}
	return grid;
}

function getPlayer(ctx:Context, playerId:String):Player {
	final player = ctx.players.get(playerId);
	if (player == null) {
		throw new Exception('player not found:${playerId}');
	}
	return player;
}

function getPilot(ctx:Context, pilotId:String):Pilot {
	final pilot = ctx.pilots.get(pilotId);
	if (pilot == null) {
		throw new Exception('pilot not found:${pilotId}');
	}
	return pilot;
}

function getRobot(ctx:Context, robotId:String):Robot {
	final robot = ctx.robots.get(robotId);
	if (robot == null) {
		throw new Exception('robot not found:${robotId}');
	}
	return robot;
}

function getWeapon(ctx:Context, weaponId:String):Weapon {
	final weapon = ctx.weapons.get(weaponId);
	if (weapon == null) {
		throw new Exception('weapon not found:${weaponId}');
	}
	return weapon;
}

function getRobotPilot(ctx:Context, robotId:String):Null<Pilot> {
	final robot = getRobot(ctx, robotId);
	final ids = [
		for (kv in ctx.pilotToRobot.keyValueIterator()) {
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
	return ctx.pilots.get(id);
}

function getRobotWeapons(ctx:Context, robotId:String):Array<Weapon> {
	final robot = getRobot(ctx, robotId);
	final weaponIds = [
		for (kv in ctx.weaponToRobot.keyValueIterator()) {
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
		final weapon = ctx.weapons.get(id);
		if (weapon == null) {
			throw new Exception('weapon not found:${id}');
		}
		return (weapon : Weapon);
	});
}

function getRobotAttacks(ctx:Context, robotId:String):Array<WeaponAttack> {
	final weapons = getRobotWeapons(ctx, robotId);
	final weaponDatas = weapons.map(weapon -> getWeaponData(weapon.id));
	var seqId = 0;
	return [
		for (i in 0...weapons.length) {
			final weapon = weapons[i];
			final data = weaponDatas[i];
			for (attack in data.attack) {
				{
					id: '${robotId}_${seqId}',
					weaponId: weapon.id,
					title: attack.title,
					cost: attack.cost,
					attackShape: attack.attackShape,
					times: attack.times,
					hitRate: attack.hitRate,
					damage: attack.damage,
					attackFlag: attack.attackFlag,
					isMelee: attack.isMelee,
				}
			}
		}
	];
}

function getRobotAttack(ctx:Context, robotId:String, attackId:String):WeaponAttack {
	final attacks = getRobotAttacks(ctx, robotId);
	final find = attacks.filter(a -> a.id == attackId);
	if (find.length == 0) {
		throw new Exception('attackId not found:${attackId}');
	}
	return find[0];
}

function getBattleResult(ctx:Context, robotId:String, attackId:String, targetRobotIds:Array<String>) {
	final robot = getRobot(ctx, robotId);
	final attack = getRobotAttack(ctx, robotId, attackId);
	final weapon = getWeapon(ctx, attack.weaponId);
	final weaponData = getWeaponData(weapon.dataId);
	final pilot = getRobotPilot(ctx, robotId);
	for (targetRobotId in targetRobotIds) {
		final targetRobot = getRobot(ctx, targetRobotId);
		final targetPilot = getRobotPilot(ctx, targetRobotId);

		final isMelee = attack.isMelee;
		// cost
		for (c in attack.cost) {}
		// hitRate
		final hitRate = attack.hitRate;

		// damage
		for (time in 0...attack.times) {
			for (damage in attack.damage) {
				switch damage {
					case PHYSICS(v):
					case BEAM(v):
					case EXPLODE(v):
					case FIRE(v):
				}
			}
		}
	}
}
