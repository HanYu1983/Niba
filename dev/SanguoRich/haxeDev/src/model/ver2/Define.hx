package model.ver2;

import model.PeopleGenerator;
import model.GridGenerator;
import model.TreasureGenerator;
import model.IModel;
import model.Config;
import haxe.Serializer;
import haxe.Unserializer;

// import cloner.Cloner;
using Lambda;

// private var _cloner = new Cloner();

typedef Grid = {
	id:Int,
	name:String,
	buildtype:GROWTYPE,
	money:Float,
	food:Float,
	army:Float,
	// defaultMoneyGrow:Float,
	// defaultFoodGrow:Float,
	// defaultArmyGrow:Float,
	favor:Array<Int>,
}

typedef Attachment = {
	id:Int,
	belongToGridId:Int,
	type:BUILDING,
}

typedef People = {
	id:Int,
	belongToPlayerId:Null<Int>,
	position:{
		gridId:Null<Int>, player:Bool
	},
	name:String,
	force:Float,
	intelligence:Float,
	political:Float,
	charm:Float,
	cost:Float,
	command:Float,
	abilities:Array<Int>,
	energy:Float,
	defaultType:PeopleType,
	exp:Float,
	lastWorkTurn:Int
}

typedef Brain = {}

typedef Player = {
	id:Int,
	name:String,
	money:Float,
	food:Float,
	army:Float,
	strategy:Float,
	position:Int,
	memory:{
		hasDice:Bool, hasStrategy:Bool, hasCommand:Bool, hasBuild:Bool, hasEquip:Bool,
	},
	brain:Null<Brain>
}

typedef Treasure = {
	id:Int,
	protoId:Int,
	belongToPlayerId:Null<Int>,
	position:{
		gridId:Null<Int>, peopleId:Null<Int>
	},
}

typedef GroundItem = {
	id:Int,
	position:Int,
	belongToPlayerId:Null<Int>,
}

enum Event {
	WORLD_EVENT(value:{
		playerBefore:Array<model.IModel.PlayerInfo>,
		playerAfter:Array<model.IModel.PlayerInfo>,
		gridBefore:Array<model.GridGenerator.Grid>,
		gridAfter:Array<model.GridGenerator.Grid>
	});
	WALK_STOP(value:{
		grid:model.GridGenerator.Grid
	});
	NEGOTIATE_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	EXPLORE_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		peopleList:Array<model.PeopleGenerator.People>,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	HIRE_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	WAR_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	SNATCH_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	RESOURCE_RESULT(value:{
		success:Bool,
		people:Null<model.PeopleGenerator.People>,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	FIRE_RESULT(value:{
		success:Bool,
		people:Array<model.PeopleGenerator.People>,
		maintainMoneyAfter:Float,
		maintainMoneyBefore:Float,
	});
	STRATEGY_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		strategy:StrategyCatelog,
		energyBefore:Float,
		energyAfter:Float,
	});
	BUILDING_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		building:BUILDING,
	});
	PAY_FOR_OVER_ENEMY_GRID(value:{
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	PEOPLE_LEVEL_UP_EVENT(value:{
		peopleBefore:model.PeopleGenerator.People,
		peopleAfter:model.PeopleGenerator.People,
	});
	COST_FOR_BONUS_RESULT(value:{
		costType:Int,
		people:model.PeopleGenerator.People,
		peopleBefore:Array<model.PeopleGenerator.People>,
		peopleAfter:Array<model.PeopleGenerator.People>
	});
	PK_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		armyBefore:Float,
		armyAfter:Float,
	});
	GRID_RESOURCE_EVENT(value:{
		grids:Array<{
			gridBefore:model.GridGenerator.Grid,
			gridAfter:model.GridGenerator.Grid,
		}>,
		describtion:String
	});
	GRID_BORN_EVENT(value:{
		grid:model.GridGenerator.Grid
	});
	FIND_TREASURE_RESULT(value:{
		treasures:Array<TreasureCatelog>
	});
	ANIMATION_EVENT(value:{
		id:ActionInfoID,
		value:{
			playerId:Int,
			fromGridId:Int,
			toGridId:Int
		},
		gameInfo:GameInfo
	});
}

typedef Context = {
	grids:Array<Grid>,
	attachments:Array<Attachment>,
	peoples:Array<People>,
	players:Array<Player>,
	currentPlayerId:Int,
	events:Array<Event>,
	groundItems:Array<GroundItem>,
	treasures:Array<Treasure>,
	turn:Int
}

function getPeopleInfo(ctx:Context, people:People):model.PeopleGenerator.People {
	return {
		id: people.id,
		type: getPeopleType(ctx, people.id),
		name: people.name,
		command: Std.int(getPeopleCommand(ctx, people.id)),
		force: Std.int(getPeopleForce(ctx, people.id)),
		intelligence: Std.int(getPeopleIntelligence(ctx, people.id)),
		political: Std.int(getPeoplePolitical(ctx, people.id)),
		charm: Std.int(getPeopleCharm(ctx, people.id)),
		cost: Std.int(people.cost),
		abilities: getPeopleAbilities(ctx, people.id),
		energy: Std.int(people.energy),
		gridId: cast people.position.gridId,
		exp: people.exp,
		sleep: false,
		treasures: ctx.treasures.filter(t -> t.position.peopleId == people.id).map(t -> getTreasureInfo(ctx, t))
	}
}

function getPlayerArmyGrow(ctx:Context, playerId:Int):Float {
	return 0.0;
}

function getPlayerInfo(ctx:Context, player:Player):model.IModel.PlayerInfo {
	return {
		id: player.id,
		name: player.name,
		money: player.money,
		food: player.food,
		army: player.army,
		strategy: player.strategy,
		people: ctx.peoples.filter(p -> p.position.player == true && p.belongToPlayerId == player.id).map(p -> getPeopleInfo(ctx, p)),
		atGridId: player.position,
		maintainPeople: 0.0,
		maintainArmy: 0.0,
		armyGrow: 0.0,
		grids: ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == player.id).map(g -> getGridInfo(ctx, g)),
		commands: getPlayerCommand(ctx, player.id),
		treasures: ctx.treasures.filter(t -> t.belongToPlayerId == player.id).map(t -> getTreasureInfo(ctx, t))
	}
}

function getGridBelongPlayerId(ctx:Context, gridId:Int):Null<Int> {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	return peopleInGrid.length > 0 ? peopleInGrid[0].belongToPlayerId : null;
}

function getGridMoneyGrow(ctx:Context, gridId:Int):Float {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	// 沒武將的格子不成長
	if (peopleInGrid.length == 0) {
		return 0.0;
	}
	final grid = ctx.grids[gridId];
	final attachmentRate = ctx.attachments.filter(a -> a.belongToGridId == grid.id).fold((p, a) -> {
		return a + switch p.type {
			case MARKET(level):
				[0.0, 0.03, 0.05, 0.06][level];
			case _:
				0;
		}
	}, 0);
	return BASIC_GROW_MONEY_RATE + attachmentRate;
}

function getGridFoodGrow(ctx:Context, gridId:Int):Float {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	// 沒武將的格子不成長
	if (peopleInGrid.length == 0) {
		return 0.0;
	}
	final grid = ctx.grids[gridId];
	final attachmentRate = ctx.attachments.filter(a -> a.belongToGridId == grid.id).fold((p, a) -> {
		return a + switch p.type {
			case FARM(level):
				[0.0, 0.03, 0.05, 0.06][level];
			case _:
				0;
		}
	}, 0);
	return BASIC_GROW_FOOD_RATE + attachmentRate;
}

function getGridArmyGrow(ctx:Context, gridId:Int):Float {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	// 沒武將的格子不成長
	if (peopleInGrid.length == 0) {
		return 0.0;
	}
	final grid = ctx.grids[gridId];
	final attachmentRate = ctx.attachments.filter(a -> a.belongToGridId == grid.id).fold((p, a) -> {
		return a + switch p.type {
			case BARRACKS(level):
				[0.0, 0.03, 0.05, 0.06][level];
			case _:
				0;
		}
	}, 0);
	return BASIC_GROW_ARMY_RATE + attachmentRate;
}

function getGridBuildType(ctx:Context, gridId:Int):GROWTYPE {
	final grid = ctx.grids[gridId];
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
	final belongPlayerId = getGridBelongPlayerId(ctx, grid.id);
	final isEmpty = belongPlayerId == null && peopleInGrid.length == 0;
	if (isEmpty) {
		return EMPTY;
	}
	final attachmentInGrid = ctx.attachments.filter(a -> a.belongToGridId == gridId);
	if (attachmentInGrid.length == 0) {
		return EMPTY;
	}
	final moneyCnt = attachmentInGrid.map(a -> switch a.type {
		case MARKET(level):
			level;
		case _:
			0;
	}).fold((c, a) -> c + a, 0);
	final foodCnt = attachmentInGrid.map(a -> switch a.type {
		case FARM(level):
			level;
		case _:
			0;
	}).fold((c, a) -> c + a, 0);
	final armyCnt = attachmentInGrid.map(a -> switch a.type {
		case BARRACKS(level):
			level;
		case _:
			0;
	}).fold((c, a) -> c + a, 0);
	if (moneyCnt > 0 && foodCnt > 0 && armyCnt > 0) {
		return CITY;
	}
	final maxV = Math.max(moneyCnt, Math.max(foodCnt, armyCnt));
	if (maxV == moneyCnt) {
		return MARKET;
	}
	if (maxV == foodCnt) {
		return FARM;
	}
	if (maxV == armyCnt) {
		return VILLAGE;
	}
	throw new haxe.Exception("必須是一個類型, 請檢查GridGenerator, 非空地請確保每個類型都至少一個建物");
}

function getGridInfo(ctx:Context, grid:Grid):model.GridGenerator.Grid {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
	final belongPlayerId = getGridBelongPlayerId(ctx, grid.id);
	final isEmpty = belongPlayerId == null && peopleInGrid.length == 0;
	return {
		id: grid.id,
		name: grid.name,
		landType: 0,
		buildtype: getGridBuildType(ctx, grid.id),
		height: 0,
		attachs: ctx.attachments.filter(a -> a.belongToGridId == grid.id).map(a -> a.type),
		belongPlayerId: cast belongPlayerId,
		value: 0,
		money: grid.money,
		moneyGrow: 0.0,
		food: grid.food,
		foodGrow: 0.0,
		army: grid.army,
		armyGrow: 0.0,
		people: peopleInGrid.map(p -> getPeopleInfo(ctx, p)),
		favor: grid.favor,
		strategys: [
			for (i in 0...4)
				// 3代表緩兵計
				ctx.groundItems.filter(item -> item.belongToPlayerId == i && item.position == grid.id).map(item -> 3)
		],
		treasures: getTreasureInGrid(ctx, grid.id).map(t -> getTreasureInfo(ctx, t))
	}
}

function getTreasureInGrid(ctx:Context, gridId:Int):Array<Treasure> {
	return ctx.treasures.filter(t -> t.position.gridId == gridId);
}

function getTreasureInfo(ctx:Context, treasure:Treasure):TreasureInfo {
	return {
		id: treasure.id,
		belongToPeopleId: cast treasure.position.peopleId,
		catelog: treasureList[treasure.protoId],
	}
}

private function calcGridsByPlayerInfo(ctx:Context, playerInfo:model.IModel.PlayerInfo):model.IModel.PlayerInfo {
	final total = playerInfo.grids.fold((g:model.GridGenerator.Grid, a:{
		food:Float,
		money:Float,
		army:Float,
		people:Array<model.PeopleGenerator.People>
	}) -> {
		return {
			food: a.food + g.food,
			money: a.money + g.money,
			army: a.army + g.army,
			people: a.people.concat(g.people),
		}
	}, {
		food: 0.0,
		money: 0.0,
		army: 0.0,
		people: []
	});
	playerInfo.food = total.food;
	playerInfo.money = total.money;
	playerInfo.army = total.army;
	playerInfo.people = total.people;
	return playerInfo;
}

private function calcGrids(ctx:Context):Array<model.IModel.PlayerInfo> {
	return ctx.players.map(p -> getPlayerInfo(ctx, p)).map(p -> calcGridsByPlayerInfo(ctx, p));
}

private function calcTotals(ctx:Context):Array<model.IModel.PlayerInfo> {
	return ctx.players.map(p -> {
		final playerInfo = getPlayerInfo(ctx, p);
		final total = calcGridsByPlayerInfo(ctx, deepCopy(playerInfo));
		playerInfo.food = playerInfo.food + total.food;
		playerInfo.money = playerInfo.money + total.money;
		playerInfo.army = playerInfo.army + total.army;
		return playerInfo;
	});
}

function getEventInfo(e:Event):EventInfo {
	return switch e {
		case WORLD_EVENT(value):
			{
				id: EventInfoID.WORLD_EVENT,
				value: value,
			}
		case WALK_STOP(value):
			{
				id: EventInfoID.WALK_STOP,
				value: value
			}
		case NEGOTIATE_RESULT(value):
			{
				id: EventInfoID.NEGOTIATE_RESULT,
				value: value
			}
		case EXPLORE_RESULT(value):
			{
				id: EventInfoID.EXPLORE_RESULT,
				value: value
			}
		case HIRE_RESULT(value):
			{
				id: EventInfoID.HIRE_RESULT,
				value: value
			}
		case WAR_RESULT(value):
			{
				id: EventInfoID.WAR_RESULT,
				value: value
			}
		case RESOURCE_RESULT(value):
			{
				id: EventInfoID.RESOURCE_RESULT,
				value: value
			}
		case FIRE_RESULT(value):
			{
				id: EventInfoID.FIRE_RESULT,
				value: value
			}
		case SNATCH_RESULT(value):
			{
				id: EventInfoID.SNATCH_RESULT,
				value: value
			}
		case STRATEGY_RESULT(value):
			{
				id: EventInfoID.STRATEGY_RESULT,
				value: value
			}
		case BUILDING_RESULT(value):
			{
				id: EventInfoID.BUILDING_RESULT,
				value: value
			}
		case PAY_FOR_OVER_ENEMY_GRID(value):
			{
				id: EventInfoID.PAY_FOR_OVER_ENEMY_GRID,
				value: value
			}
		case PEOPLE_LEVEL_UP_EVENT(value):
			{
				id: EventInfoID.PEOPLE_LEVEL_UP_EVENT,
				value: value
			}
		case COST_FOR_BONUS_RESULT(value):
			{
				id: EventInfoID.COST_FOR_BONUS_RESULT,
				value: value
			}
		case PK_RESULT(value):
			{
				id: EventInfoID.PK_RESULT,
				value: value
			}
		case GRID_RESOURCE_EVENT(value):
			{
				id: EventInfoID.GRID_RESOURCE_EVENT,
				value: value
			}
		case GRID_BORN_EVENT(value):
			{
				id: EventInfoID.GRID_BORN_EVENT,
				value: value
			}
		case FIND_TREASURE_RESULT(value):
			{
				id: EventInfoID.FIND_TREASURE_RESULT,
				value: value
			}
		case ANIMATION_EVENT(value):
			{
				id: EventInfoID.ANIMATION_EVENT,
				value: value
			}
	}
}

function getGameInfo(ctx:Context, root:Bool):GameInfo {
	final events = if (root) {
		final eventCopy = deepCopy(ctx.events);
		// 先進後出
		eventCopy.reverse();
		// 探索和攻城事件排最後
		eventCopy.sort((a, b) -> {
			return switch b {
				case WAR_RESULT({success: true}) | EXPLORE_RESULT({success: true}):
					-1;
				case _:
					0;
			}
		});
		eventCopy.map(getEventInfo);
	} else {
		[];
	}
	// 不管週期, 直接計算下一次的結果
	final nextCtx = if (root) {
		final copy = deepCopy(ctx);
		model.ver2.alg.Alg.doPeopleMaintain(copy);
		model.ver2.alg.Alg.doGridGrow(copy);
		copy;
	} else {
		ctx;
	}
	return {
		players: ctx.players.map(p -> getPlayerInfo(ctx, p)).map(p -> {
			return if (root) {
				// 計算下次結算後的差額
				final nextP = nextCtx.players[p.id];
				p.maintainPeople = nextP.money - p.money;
				p.maintainArmy = nextP.food - p.food;
				p.armyGrow = nextP.army - p.army;
				p;
			} else {
				p;
			}
		}),
		playerGrids: {
			if (root) {
				final curr = calcGrids(ctx);
				final next = calcGrids(nextCtx);
				for (i in 0...curr.length) {
					final p = curr[i];
					final nextP = next[i];
					p.maintainPeople = nextP.money - p.money;
					p.maintainArmy = nextP.food - p.food;
					p.armyGrow = nextP.army - p.army;
				}
				curr;
			} else {
				ctx.players.map(p -> getPlayerInfo(ctx, p));
			}
		},
		playerTotals: {
			if (root) {
				final curr = calcTotals(ctx);
				final next = calcTotals(nextCtx);
				for (i in 0...curr.length) {
					final p = curr[i];
					final nextP = next[i];
					p.maintainPeople = nextP.money - p.money;
					p.maintainArmy = nextP.food - p.food;
					p.armyGrow = nextP.army - p.army;
				}
				curr;
			} else {
				ctx.players.map(p -> getPlayerInfo(ctx, p));
			}
		},
		grids: ctx.grids.map(p -> getGridInfo(ctx, p)).map(p -> {
			if (root) {
				// 計算下次結算後的差額
				final nextP = nextCtx.grids[p.id];
				p.moneyGrow = nextP.money - p.money;
				p.armyGrow = nextP.army - p.army;
				p.foodGrow = nextP.food - p.food;
				p;
			} else {
				p;
			}
		}),
		isPlayerTurn: true,
		currentPlayer: getPlayerInfo(ctx, ctx.players[ctx.currentPlayerId]),
		isPlaying: true,
		events: events,
		actions: [],
		currentTurn: ctx.turn,
	}
}

function addGridInfo(ctx:Context, grid:model.GridGenerator.Grid):Void {
	ctx.grids.push({
		id: grid.id,
		name: grid.name,
		buildtype: grid.buildtype,
		money: grid.money,
		food: grid.food,
		army: grid.army,
		// defaultMoneyGrow: 0.0,
		// defaultFoodGrow: 0.0,
		// defaultArmyGrow: 0.0,
		favor: grid.favor,
	});
	for (p in grid.people) {
		addPeopleInfo(ctx, null, grid.id, p);
	}
	for (p in grid.attachs) {
		addAttachInfo(ctx, grid.id, p);
	}
	for (p in grid.treasures) {
		addTreasureInfo(ctx, null, grid.id, null, p);
	}
}

private var _id = 0;

function getNextId():Int {
	return _id++;
}

function addAttachInfo(ctx:Context, belongToGridId:Int, type:BUILDING) {
	final hasOne = ctx.attachments.filter(a -> a.belongToGridId == belongToGridId && switch [a.type, type] {
		case [MARKET(_), MARKET(_)] | [FARM(_), FARM(_)] | [BARRACKS(_), BARRACKS(_)] | [EXPLORE(_), EXPLORE(_)] | [WALL(_), WALL(_)]:
			true;
		case _:
			false;
	}).length > 0;
	if (hasOne) {
		return;
	}
	ctx.attachments.push({
		id: getNextId(),
		belongToGridId: belongToGridId,
		type: type
	});
}

function addPeopleInfo(ctx:Context, belongToPlayerId:Null<Int>, gridId:Null<Int>, p:model.PeopleGenerator.People):Void {
	ctx.peoples.push({
		id: p.id,
		belongToPlayerId: belongToPlayerId,
		position: {
			gridId: gridId,
			player: belongToPlayerId != null
		},
		name: p.name,
		force: p.force,
		intelligence: p.intelligence,
		political: p.political,
		charm: p.charm,
		cost: p.cost,
		abilities: p.abilities,
		command: p.command,
		energy: p.energy,
		defaultType: p.type,
		exp: p.exp,
		lastWorkTurn: 0
	});
	for (t in p.treasures) {
		addTreasureInfo(ctx, belongToPlayerId, gridId, p.id, t);
	}
}

function addPlayerInfo(ctx:Context, player:model.IModel.PlayerInfo, isAI:Bool):Void {
	ctx.players.push({
		id: player.id,
		name: player.name,
		money: player.money,
		food: player.food,
		army: player.army,
		strategy: player.strategy,
		position: player.atGridId,
		memory: {
			hasDice: false,
			hasStrategy: false,
			hasCommand: false,
			hasBuild: false,
			hasEquip: false,
		},
		brain: isAI ? {} : null,
	});
	for (p in player.people) {
		addPeopleInfo(ctx, player.id, null, p);
	}
}

function addTreasureInfo(ctx:Context, belongToPlayerId:Null<Int>, gridId:Null<Int>, peopleId:Null<Int>, treasure:TreasureInfo):Void {
	ctx.treasures.push({
		id: treasure.id,
		protoId: treasure.catelog.id,
		belongToPlayerId: belongToPlayerId,
		position: {
			gridId: gridId,
			peopleId: peopleId,
		}
	});
}

function getMaintainPeople(ctx:Context, playerId:Int):Float {
	final totalPeopleCost = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a) -> {
		return a + getPeopleMaintainCost(ctx, p.id);
	}, 0.0);
	return getMaintainPeoplePure(totalPeopleCost);
}

function getMaintainArmy(ctx:Context, playerId:Int):Float {
	final totalArmy = /*ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).fold((p, a) -> {
		return a + p.army;
	}, 0.0) +*/ ctx.players[playerId].army;
	return getMaintainArmyPure(totalArmy);
}

function getMaintainPeoplePure(totalPeopleCost:Float):Float {
	return totalPeopleCost * PLAYER_SPEND_MONEY_FOR_PEOPLE_PER_TURN_PERSENT;
}

function getMaintainArmyPure(totalArmy:Float):Float {
	return totalArmy * PLAYER_SPEND_FOOD_FOR_ARMY_PER_TURN_PERSENT;
}

function getPeopleById(ctx:Context, id:Int):People {
	final find = ctx.peoples.filter(p -> p.id == id);
	if (find.length == 0) {
		throw new haxe.Exception('people not found: ${id}');
	}
	return find[0];
}

function getTreasureById(ctx:Context, id:Int):Treasure {
	final find = ctx.treasures.filter(p -> p.id == id);
	if (find.length == 0) {
		throw new haxe.Exception('treasure not found: ${id}');
	}
	return find[0];
}

function getPeopleType(ctx:Context, peopleId:Int):PeopleType {
	final people = getPeopleById(ctx, peopleId);
	final level = getExpLevel(people.exp);
	return switch people.defaultType {
		case PUTONG | QILIN:
			switch level {
				case 0:
					people.defaultType;
				case _:
					// 1級以上的話, 隨機文官文武將
					switch peopleId % 2 {
						case 0:
							WENGUAN(level);
						case _:
							WUJIANG(level);
					}
			}
		// 文官
		case WENGUAN(_):
			WENGUAN(level);
		// 武將
		case WUJIANG(_):
			WUJIANG(level);
	}
}

function getPeopleMaintainCost(ctx:Context, peopleId:Int):Float {
	final people = getPeopleById(ctx, peopleId);
	return switch getPeopleType(ctx, peopleId) {
		case WENGUAN(level):
			people.cost * (1 + EXP_LEVEL_COST_EXT[level]);
		case WUJIANG(level):
			people.cost * (1 + EXP_LEVEL_COST_EXT[level]);
		case _:
			people.cost;
	}
}

function getPeopleForce(ctx:Context, peopleId:Int):Float {
	final people = getPeopleById(ctx, peopleId);
	final treasureCates = ctx.treasures.filter(t -> t.position.peopleId == peopleId).map(t -> treasureList[t.protoId]);
	final totalTreasureBonus = treasureCates.fold((c, a:Float) -> {
		return a + c.force;
	}, 0.0);
	final expLevelBonus = switch getPeopleType(ctx, peopleId) {
		case WUJIANG(level):
			EXP_LEVEL_ABI_EXT[level];
		case _:
			0.0;
	}
	return people.force + totalTreasureBonus + expLevelBonus;
}

function getPeopleIntelligence(ctx:Context, peopleId:Int):Float {
	final people = getPeopleById(ctx, peopleId);
	final treasureCates = ctx.treasures.filter(t -> t.position.peopleId == peopleId).map(t -> treasureList[t.protoId]);
	final totalTreasureBonus = treasureCates.fold((c, a:Float) -> {
		return a + c.intelligence;
	}, 0.0);
	final expLevelBonus = switch getPeopleType(ctx, peopleId) {
		case WENGUAN(level):
			EXP_LEVEL_ABI_EXT[level];
		case _:
			0.0;
	}
	return people.intelligence + totalTreasureBonus + expLevelBonus;
}

function getPeoplePolitical(ctx:Context, peopleId:Int):Float {
	final people = getPeopleById(ctx, peopleId);
	final treasureCates = ctx.treasures.filter(t -> t.position.peopleId == peopleId).map(t -> treasureList[t.protoId]);
	final totalTreasureBonus = treasureCates.fold((c, a:Float) -> {
		return a + c.political;
	}, 0.0);
	final expLevelBonus = switch getPeopleType(ctx, peopleId) {
		case WENGUAN(level):
			EXP_LEVEL_ABI_EXT[level];
		case _:
			0.0;
	}
	return people.political + totalTreasureBonus + expLevelBonus;
}

function getPeopleCharm(ctx:Context, peopleId:Int):Float {
	final people = getPeopleById(ctx, peopleId);
	final treasureCates = ctx.treasures.filter(t -> t.position.peopleId == peopleId).map(t -> treasureList[t.protoId]);
	final totalTreasureBonus = treasureCates.fold((c, a:Float) -> {
		return a + c.charm;
	}, 0.0);
	final expLevelBonus = switch getPeopleType(ctx, peopleId) {
		case WENGUAN(level):
			EXP_LEVEL_ABI_EXT[level];
		case WUJIANG(level):
			EXP_LEVEL_ABI_EXT[level];
		case _:
			0.0;
	}
	return people.charm + totalTreasureBonus + expLevelBonus;
}

function getPeopleCommand(ctx:Context, peopleId:Int):Float {
	final people = getPeopleById(ctx, peopleId);
	final treasureCates = ctx.treasures.filter(t -> t.position.peopleId == peopleId).map(t -> treasureList[t.protoId]);
	final totalTreasureBonus = treasureCates.fold((c, a:Float) -> {
		return a + c.command;
	}, 0.0);
	final expLevelBonus = switch getPeopleType(ctx, peopleId) {
		case WUJIANG(level):
			EXP_LEVEL_ABI_EXT[level];
		case _:
			0.0;
	}
	return people.command + totalTreasureBonus + expLevelBonus;
}

function getPeopleAbilities(ctx:Context, peopleId:Int):Array<Int> {
	final people = getPeopleById(ctx, peopleId);
	final treasureCates = ctx.treasures.filter(t -> t.position.peopleId == peopleId).map(t -> treasureList[t.protoId]);
	final totalTreasureBonus = treasureCates.fold((c, a) -> {
		return a.concat(c.abilities);
	}, ([] : Array<Int>));
	final expLevelBonus = switch getPeopleType(ctx, peopleId) {
		case WENGUAN(level):
			final cnt = Std.int(level / 3);
			final abiMap = PeopleGenerator.getInst().getAbiMap()[2];
			[
				for (i in 0...cnt) {
					final selectId = (peopleId * cnt) % abiMap.length;
					abiMap[selectId];
				}
			];
		case WUJIANG(level):
			final cnt = Std.int(level / 3);
			final abiMap = PeopleGenerator.getInst().getAbiMap()[1];
			[
				for (i in 0...cnt) {
					final selectId = (peopleId * cnt) % abiMap.length;
					abiMap[selectId];
				}
			];
		case _:
			[];
	}
	final allAbis = people.abilities.concat(totalTreasureBonus).concat(expLevelBonus);
	// 去掉重復
	final abiSet = new Set<Int>();
	for (abi in allAbis) {
		abiSet.add(abi);
	}
	var ret:Array<Int> = [];
	var iter = abiSet.iterator();
	while (iter.hasNext()) {
		ret.push(iter.next());
	}
	return ret;
}

function getPlayerCommand(ctx:Context, playerId:Int):Array<ActionInfoID> {
	final ret:Array<ActionInfoID> = [];
	// ret.push(ActionInfoID.BUILD);
	final player = ctx.players[playerId];
	final gridInfo = getGridInfo(ctx, ctx.grids[player.position]);
	if (player.memory.hasDice == false) {
		ret.push(ActionInfoID.MOVE);
		if (ctx.turn > 0) {
			if (player.memory.hasStrategy == false) {
				ret.push(ActionInfoID.STRATEGY);
			}
		}
		ret.push(ActionInfoID.TREASURE);
		if (player.memory.hasEquip == false) {
			ret.push(ActionInfoID.TREASURE_TAKE);
		}
		ret.push(ActionInfoID.FIRE);
	} else {
		if (gridInfo.belongPlayerId == null) {
			// 中立的
			if (player.memory.hasCommand == false) {
				switch gridInfo.buildtype {
					case EMPTY:
						ret.push(ActionInfoID.EXPLORE);
						ret.push(ActionInfoID.CAMP);
						ret.push(ActionInfoID.PRACTICE);
					case _:
				}
				if (gridInfo.people.length > 0) {
					// 有人的
					switch gridInfo.buildtype {
						case EMPTY:
							ret.push(ActionInfoID.HIRE);
						case _:
							if (gridInfo.favor[playerId] >= CAN_CHANGE_FAVOR) {
								// 好感的
								ret.push(ActionInfoID.PAY_FOR_FUN);
								switch gridInfo.buildtype {
									case MARKET:
										ret.push(ActionInfoID.EARN_MONEY);
									case FARM:
										ret.push(ActionInfoID.BUY_FOOD);
										ret.push(ActionInfoID.SELL_FOOD);
									case VILLAGE:
										ret.push(ActionInfoID.BUY_ARMY);
										ret.push(ActionInfoID.SELL_ARMY);
									case CITY:
										ret.push(ActionInfoID.EARN_MONEY);
										ret.push(ActionInfoID.BUY_FOOD);
										ret.push(ActionInfoID.SELL_FOOD);
										ret.push(ActionInfoID.BUY_ARMY);
										ret.push(ActionInfoID.SELL_ARMY);
									case _:
								}
							}
							switch gridInfo.buildtype {
								case MARKET | FARM | VILLAGE | CITY:
									ret.push(ActionInfoID.NEGOTIATE);
									ret.push(ActionInfoID.PK);
									ret.push(ActionInfoID.SNATCH);
									ret.push(ActionInfoID.OCCUPATION);
								case _:
							}
					}
				}
			}
			ret.push(ActionInfoID.END);
		} else if (gridInfo.belongPlayerId != playerId) {
			// 敵人的
			if (player.memory.hasCommand == false) {
				// 人打人不能單挑
				// ret.push(ActionInfoID.PK);
				ret.push(ActionInfoID.SNATCH);
				ret.push(ActionInfoID.OCCUPATION);
			}
			ret.push(ActionInfoID.END);
		} else {
			// 自己的
			ret.push(ActionInfoID.TRANSFER);
			if (player.memory.hasBuild == false) {
				ret.push(ActionInfoID.PAY_FOR_FUN);
				ret.push(ActionInfoID.BUILD);
			}
			ret.push(ActionInfoID.END);
		}

		// ========================
		// if (player.memory.hasCommand == false) {
		// 	if (gridInfo.belongPlayerId == null) {
		// 		// 中立的
		// 		switch gridInfo.buildtype {
		// 			case EMPTY:
		// 				ret.push(ActionInfoID.EXPLORE);
		// 			case _:
		// 		}
		// 		if (gridInfo.people.length > 0) {
		// 			// 有人的
		// 			switch gridInfo.buildtype {
		// 				case EMPTY:
		// 					ret.push(ActionInfoID.HIRE);
		// 				case _:
		// 					if (gridInfo.favor[playerId] >= 1) {
		// 						// 好感的
		// 						switch gridInfo.buildtype {
		// 							case MARKET:
		// 								ret.push(ActionInfoID.EARN_MONEY);
		// 							case FARM:
		// 								ret.push(ActionInfoID.BUY_FOOD);
		// 								ret.push(ActionInfoID.SELL_FOOD);
		// 							case VILLAGE:
		// 								ret.push(ActionInfoID.BUY_ARMY);
		// 								ret.push(ActionInfoID.SELL_ARMY);
		// 							case CITY:
		// 								ret.push(ActionInfoID.EARN_MONEY);
		// 								ret.push(ActionInfoID.BUY_FOOD);
		// 								ret.push(ActionInfoID.SELL_FOOD);
		// 								ret.push(ActionInfoID.BUY_ARMY);
		// 								ret.push(ActionInfoID.SELL_ARMY);
		// 							case _:
		// 						}
		// 					} else {
		// 						// 討厭的
		// 						switch gridInfo.buildtype {
		// 							case MARKET | FARM | VILLAGE | CITY:
		// 								ret.push(ActionInfoID.NEGOTIATE);
		// 								ret.push(ActionInfoID.SNATCH);
		// 								ret.push(ActionInfoID.OCCUPATION);
		// 							case _:
		// 						}
		// 					}
		// 			}
		// 		}
		// 		ret.push(ActionInfoID.END);
		// 	} else if (gridInfo.belongPlayerId != playerId) {
		// 		// 敵人的
		// 		ret.push(ActionInfoID.SNATCH);
		// 		ret.push(ActionInfoID.OCCUPATION);
		// 		ret.push(ActionInfoID.END);
		// 	} else {
		// 		// 自己的
		// 		ret.push(ActionInfoID.TRANSFER);
		// 		ret.push(ActionInfoID.BUILD);
		// 		ret.push(ActionInfoID.END);
		// 	}
		// } else {
		// 	ret.push(ActionInfoID.END);
		// }
	}
	return ret;
}

function deepCopy<T>(v:T):T {
	final serializer = new Serializer();
	serializer.serialize(v);
	final memonto = serializer.toString();
	final unserializer = new Unserializer(memonto);
	return unserializer.unserialize();
}

function getMemontoByContext(v:Context):String {
	final serializer = new Serializer();
	serializer.serialize(v);
	return serializer.toString();
}

function getConetxtByMemonto(memonto:String):Context {
	final unserializer = new Unserializer(memonto);
	return unserializer.unserialize();
}

function clearMemory(ctx:Context) {
	for (player in ctx.players) {
		player.memory.hasDice = false;
		player.memory.hasStrategy = false;
		player.memory.hasCommand = false;
		player.memory.hasBuild = false;
		player.memory.hasEquip = false;
	}
}

function wrapResourceResultEvent(ctx:Context, playerId:Int, p1SelectId:Int, fn:() -> Bool):Bool {
	final p1 = getPeopleById(ctx, p1SelectId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	resultValue.success = fn();
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events.push(Event.RESOURCE_RESULT(resultValue));
	return resultValue.success;
}

function wrapStrategyEvent(ctx:Context, playerId:Int, peopleId:Int, strategyId:Int, fn:() -> Bool):Bool {
	final p1 = getPeopleById(ctx, peopleId);
	final player = ctx.players[playerId];
	final strategy = StrategyList[strategyId];
	final strategyResultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		strategy: strategy,
		energyBefore: p1.energy,
		energyAfter: 0.0,
	}
	strategyResultValue.success = fn();
	strategyResultValue.people = getPeopleInfo(ctx, p1);
	strategyResultValue.energyAfter = p1.energy;
	ctx.events.push(Event.STRATEGY_RESULT(strategyResultValue));
	return strategyResultValue.success;
}
