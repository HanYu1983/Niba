package model.ver2;

import haxe.Serializer;
import haxe.Unserializer;
import tool.Debug;
import model.tool.Fact;
import model.PeopleGenerator;
import model.GridGenerator;
import model.TreasureGenerator;
import model.IModel;
import model.Config;

using Lambda;

typedef Grid = {
	id:Int,
	name:String,
	buildtype:GROWTYPE,
	landType:LANDTYPE,
	money:Float,
	food:Float,
	army:Float,
	defaultMoneyGrow:Float,
	defaultFoodGrow:Float,
	defaultArmyGrow:Float,
	favor:Array<Int>,
	defaultMaxFood:Float,
	defaultMaxMoney:Float,
	defaultMaxArmy:Float,
}

function getDefaultGrid():Grid {
	return {
		id: 0,
		name: "",
		buildtype: GROWTYPE.MARKET,
		landType: LANDTYPE.PLAIN,
		money: 0,
		food: 0,
		army: 0,
		defaultMoneyGrow: 0,
		defaultFoodGrow: 0,
		defaultArmyGrow: 0,
		favor: [],
		defaultMaxFood: 0,
		defaultMaxMoney: 0,
		defaultMaxArmy: 0,
	}
}

typedef Attachment = {
	id:Int,
	belongToGridId:Int,
	type:BUILDING,
}

function getDefaultAttachment():Attachment {
	return {
		id: 0,
		belongToGridId: 0,
		type: MARKET(0),
	}
}

typedef People = {
	id:Int,
	belongToPlayerId:Null<Int>,
	position:{
		gridId:Null<Int>
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
	exp:Float
}

function getDefaultPeople():People {
	return {
		id: 0,
		belongToPlayerId: null,
		position: {
			gridId: null
		},
		name: "",
		force: 0.0,
		intelligence: 0.0,
		political: 0.0,
		charm: 0.0,
		cost: 0.0,
		command: 0.0,
		abilities: [],
		energy: 100.0,
		defaultType: PeopleType.PUTONG,
		exp: 0.0
	}
}

typedef Brain = {
	memory:Null<Dynamic>
}

typedef Player = {
	id:Int,
	name:String,
	money:Float,
	food:Float,
	army:Float,
	strategy:Float,
	position:Int,
	memory:{
		hasDice:Bool, hasStrategy:Bool, hasCommand:Bool, hasBuild:Bool, hasEquip:Bool
	},
	brain:Null<Brain>,
	score:Float,
	isLose:Bool,
	hate:Array<Int>
}

function getDefaultPlayer():Player {
	return {
		id: 0,
		name: "",
		money: 0,
		food: 0,
		army: 0,
		strategy: 0,
		position: 0,
		memory: {
			hasDice: false,
			hasStrategy: false,
			hasCommand: false,
			hasBuild: false,
			hasEquip: false
		},
		brain: null,
		score: 0,
		isLose: false,
		hate: []
	}
}

typedef Treasure = {
	id:Int,
	protoId:Int,
	belongToPlayerId:Null<Int>,
	position:{
		gridId:Null<Int>, peopleId:Null<Int>
	},
}

function getDefaultTreasure():Treasure {
	return {
		id: 0,
		protoId: 0,
		belongToPlayerId: null,
		position: {
			gridId: null,
			peopleId: null,
		},
	}
}

typedef GroundItem = {
	id:Int,
	position:Int,
	belongToPlayerId:Null<Int>,
}

enum EffectProto {
	Pending;
	Strategy(value:{id:Int, fromPlayerId:Int});
}

typedef Effect = {
	id:Int,
	belongToPlayerId:Null<Int>,
	expireTurn:Null<Int>,
	proto:EffectProto
}

function getDefaultEffect():Effect {
	return {
		id: 0,
		belongToPlayerId: null,
		proto: Pending,
		expireTurn: null
	}
}

enum Event {
	WORLD_EVENT(value:{
		playerBefore:Array<model.IModel.PlayerInfo>,
		playerAfter:Array<model.IModel.PlayerInfo>,
		gridBefore:Array<model.GridGenerator.Grid>,
		gridAfter:Array<model.GridGenerator.Grid>
	}, gameInfo:GameInfo);
	WALK_STOP(value:{
		grid:model.GridGenerator.Grid
	}, gameInfo:GameInfo);
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
		favorBefore:Int,
		favorAfter:Int,
		gridId:Int,
	}, gameInfo:GameInfo);
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
		gridId:Int,
	}, gameInfo:GameInfo);
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
		gridId:Int,
	}, gameInfo:GameInfo);
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
		gridId:Int,
	}, gameInfo:GameInfo);
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
		gridId:Int,
	}, gameInfo:GameInfo);
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
		gridId:Int,
	}, gameInfo:GameInfo);
	FIRE_RESULT(value:{
		success:Bool,
		people:Array<model.PeopleGenerator.People>,
		maintainMoneyAfter:Float,
		maintainMoneyBefore:Float,
		gridId:Int,
	}, gameInfo:GameInfo);
	STRATEGY_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		strategy:StrategyCatelog,
		energyBefore:Float,
		energyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		gridId:Int,
	}, gameInfo:GameInfo, autoplay:Null<{duration:Float}>);
	BUILDING_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		building:BUILDING,
		gridId:Int,
	}, gameInfo:GameInfo);
	PAY_FOR_OVER_ENEMY_GRID(value:{
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
		gridId:Int,
	}, gameInfo:GameInfo, autoplay:Null<{duration:Float}>);
	PEOPLE_LEVEL_UP_EVENT(value:{
		peopleBefore:model.PeopleGenerator.People,
		peopleAfter:model.PeopleGenerator.People,
		gridId:Null<Int>,
	}, gameInfo:GameInfo);
	COST_FOR_BONUS_RESULT(value:{
		costType:Int,
		people:model.PeopleGenerator.People,
		peopleBefore:Array<model.PeopleGenerator.People>,
		peopleAfter:Array<model.PeopleGenerator.People>,
		gridId:Int,
	}, gameInfo:GameInfo);
	PK_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		armyBefore:Float,
		armyAfter:Float,
		gridId:Int,
		favorBefore:Int,
		favorAfter:Int,
	}, gameInfo:GameInfo);
	GRID_RESOURCE_EVENT(value:{
		grids:Array<{
			gridBefore:model.GridGenerator.Grid,
			gridAfter:model.GridGenerator.Grid,
		}>,
		describtion:String
	}, gameInfo:GameInfo);
	GRID_BORN_EVENT(value:{
		grid:model.GridGenerator.Grid
	}, gameInfo:GameInfo);
	FIND_TREASURE_RESULT(value:{
		treasures:Array<TreasureCatelog>,
		gridId:Int,
	}, gameInfo:GameInfo);
	ANIMATION_EVENT_MOVE(value:{
		playerId:Int,
		fromGridId:Int,
		toGridId:Int
	}, gameInfo:GameInfo);
	ANIMATION_EVENT_SNATCH(value:{
		gridIds:Array<Int>,
		duration:Float,
		msg:String,
	}, gameInfo:GameInfo);
	MESSAGE_EVENT(value:{
		title:String,
		msg:String,
	}, gameInfo:GameInfo);
	PLAYER_LOSE(value:{
		player:model.IModel.PlayerInfo,
	}, gameInfo:GameInfo, autoplay:Null<{duration:Float}>);
	PLAYER_WIN(value:{
		player:Null<model.IModel.PlayerInfo>,
	}, gameInfo:GameInfo, autoplay:Null<{duration:Float}>);
	SETTLE_RESULT(value:{
		grid:model.GridGenerator.Grid,
		gridId:Int,
	}, gameInfo:GameInfo, autoplay:Null<{duration:Float}>);
}

typedef Context = {
	settings:Null<GameSetting>,
	grids:Array<Grid>,
	attachments:Array<Attachment>,
	peoples:Array<People>,
	players:Array<Player>,
	currentPlayerId:Int,
	events:Array<Event>,
	groundItems:Array<GroundItem>,
	treasures:Array<Treasure>,
	effects:Array<Effect>,
	turn:Int,
	idSeq:Int
}

function getDefaultContext():Context {
	return {
		settings: null,
		grids: [],
		attachments: [],
		peoples: [],
		players: [],
		currentPlayerId: 0,
		events: [],
		groundItems: [],
		treasures: [],
		effects: [],
		turn: 0,
		idSeq: 0
	}
}

function getPeopleInfo(ctx:Context, people:People):model.PeopleGenerator.People {
	return {
		id: people.id,
		type: getPeopleType(ctx, people.id),
		name: people.name,
		commandArmy: Std.int(getPeopleMaxArmy(ctx, people.id)),
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
		strategys: [
			for (fromPlayerId in 0...4) {
				ctx.effects.filter(e -> e.belongToPlayerId == player.id).filter(e -> {
					switch e.proto {
						case Strategy(value):
							fromPlayerId == value.fromPlayerId;
						case _:
							false;
					}
				}).map(e -> {
					switch e.proto {
						case Strategy(value):
							value.id;
						case _:
							throw new haxe.Exception("不支援strategy以外的");
					}
				});
			}
		],
		people: ctx.peoples.filter(p -> p.belongToPlayerId == player.id).map(p -> getPeopleInfo(ctx, p)),
		atGridId: player.position,
		maintainPeople: 0.0,
		maintainArmy: 0.0,
		armyGrow: 0.0,
		grids: ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == player.id).map(g -> getGridInfo(ctx, g)),
		commands: getPlayerCommand(ctx, player.id),
		treasures: ctx.treasures.filter(t -> t.belongToPlayerId == player.id).map(t -> getTreasureInfo(ctx, t)),
		score: player.score,
	}
}

function getGridBelongPlayerId(ctx:Context, gridId:Int):Null<Int> {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	return peopleInGrid.length > 0 ? peopleInGrid[0].belongToPlayerId : null;
}

function getGrowFormGameSettings(ctx:Context):Float {
	if (ctx.settings == null) {
		throw new haxe.Exception("settings not found");
	}
	return ctx.settings.growSpeed;
}

function getExpRateByAttachment(ctx:Context, playerId:Int):Float {
	final rate = ctx.attachments.filter(a -> getGridBelongPlayerId(ctx, a.belongToGridId) == playerId).fold((p, a:Float) -> {
		return a * switch p.type {
			case ACADEMY(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [rate, _]}:
						rate;
					case _:
						throw new haxe.Exception("[getExpRateByAttachment]catelog[0].value not found");
				}
			case _:
				1.0;
		}
	}, 1.0);
	return rate;
}

function getWarFoodCostRateByAttachment(ctx:Context, playerId:Int):Float {
	final rate = ctx.attachments.filter(a -> getGridBelongPlayerId(ctx, a.belongToGridId) == playerId).fold((p, a:Float) -> {
		return a * switch p.type {
			case SIEGEFACTORY(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [rate, _]}:
						rate;
					case _:
						throw new haxe.Exception("[getWarFoodCostRateByAttachment]catelog[0].value not found");
				}
			case _:
				1.0;
		}
	}, 1.0);
	return rate;
}

function getWarDamageRateByAttachment(ctx:Context, playerId:Int):Float {
	final rate = ctx.attachments.filter(a -> getGridBelongPlayerId(ctx, a.belongToGridId) == playerId).fold((p, a:Float) -> {
		return a * switch p.type {
			case SIEGEFACTORY(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [_, rate]}:
						rate;
					case _:
						throw new haxe.Exception("[getWarDamageRateByAttachment]catelog[0].value not found");
				}
			case _:
				1.0;
		}
	}, 1.0);
	return rate;
}

function getPlayerCharmAddByAttachment(ctx:Context, playerId:Int):Float {
	final charmExt = ctx.attachments.filter(a -> getGridBelongPlayerId(ctx, a.belongToGridId) == playerId).fold((p, a) -> {
		return a + switch p.type {
			case EXPLORE(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [rate, _]}:
						rate;
					case _:
						throw new haxe.Exception("[getPlayerCharmAddByAttachment]catelog[0].value not found");
				}
			case _:
				0;
		}
	}, 0);
	return charmExt;
}

function getPracticeCostRateByAttachment(ctx:Context, playerId:Int):Float {
	final rate = ctx.attachments.filter(a -> getGridBelongPlayerId(ctx, a.belongToGridId) == playerId).fold((p, a:Float) -> {
		return a * switch p.type {
			case ACADEMY(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [_, rate]}:
						rate;
					case _:
						throw new haxe.Exception("[getPracticeCostRateByAttachment]catelog[0].value not found");
				}
			case _:
				1.0;
		}
	}, 1.0);
	return rate;
}

function getPlayerHireCostRate(ctx:Context, playerId:Int):Float {
	final rate = ctx.attachments.filter(a -> getGridBelongPlayerId(ctx, a.belongToGridId) == playerId).fold((p, a:Float) -> {
		return a * switch p.type {
			case EXPLORE(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [_, rate]}:
						rate;
					case _:
						throw new haxe.Exception("[getPlayerHireCostRate]catelog[0].value not found");
				}
			case _:
				1.0;
		}
	}, 1.0);
	return rate;
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
			case BANK(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [_, rate]}:
						rate;
					case _:
						throw new haxe.Exception("[getGridMoneyGrow]catelog[0].value not found");
				}
			case _:
				0;
		}
	}, 0);
	return getGrowFormGameSettings(ctx) * (BASIC_GROW_MONEY_RATE + attachmentRate + grid.defaultMoneyGrow);
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
			case BARN(_):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [_, rate]}:
						rate;
					case _:
						throw new haxe.Exception("[getGridFoodGrow]catelog[0].value not found");
				}
			case _:
				0;
		}
	}, 0);
	return getGrowFormGameSettings(ctx) * (BASIC_GROW_FOOD_RATE + attachmentRate + grid.defaultFoodGrow);
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
			case HOME(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [_, rate]}:
						rate;
					case _:
						throw new haxe.Exception("[getGridArmyGrow]catelog[0].value not found");
				}
			case _:
				0;
		}
	}, 0);
	return getGrowFormGameSettings(ctx) * (BASIC_GROW_ARMY_RATE + attachmentRate + grid.defaultArmyGrow);
}

function getGridFoodAdd(ctx:Context, gridId:Int):Float {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	// 沒武將的格子不成長
	if (peopleInGrid.length == 0) {
		return 0.0;
	}
	final grid = ctx.grids[gridId];
	final attachmentRate = ctx.attachments.filter(a -> a.belongToGridId == grid.id).fold((p, a) -> {
		return a + switch p.type {
			case FARM(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [v]}:
						v;
					case _:
						throw new haxe.Exception("[getGridFoodAdd]catelog[0].value not found");
				}
			case _:
				0;
		}
	}, 0);
	return attachmentRate + BASIC_GROW_FOOD_ADD;
}

function getGridMoneyAdd(ctx:Context, gridId:Int):Float {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	// 沒武將的格子不成長
	if (peopleInGrid.length == 0) {
		return 0.0;
	}
	final grid = ctx.grids[gridId];
	final attachmentRate = ctx.attachments.filter(a -> a.belongToGridId == grid.id).fold((p, a) -> {
		return a + switch p.type {
			case MARKET(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [v]}:
						v;
					case _:
						throw new haxe.Exception("[getGridMoneyAdd]catelog[0].value not found");
				}
			case _:
				0;
		}
	}, 0);
	return attachmentRate + BASIC_GROW_MONEY_ADD;
}

function getGridArmyAdd(ctx:Context, gridId:Int):Float {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	// 沒武將的格子不成長
	if (peopleInGrid.length == 0) {
		return 0.0;
	}
	final grid = ctx.grids[gridId];
	final attachmentRate = ctx.attachments.filter(a -> a.belongToGridId == grid.id).fold((p, a) -> {
		return a + switch p.type {
			case BARRACKS(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [v]}:
						v;
					case _:
						throw new haxe.Exception("[getGridArmyAdd]catelog[0].value not found");
				}
			case _:
				0;
		}
	}, 0);
	return attachmentRate + BASIC_GROW_ARMY_ADD;
}

function getGridMaxFood(ctx:Context, gridId:Int):Float {
	final grid = ctx.grids[gridId];
	final addExt = ctx.attachments.filter(a -> a.belongToGridId == grid.id).fold((p, a) -> {
		return a + switch p.type {
			case BARN(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [v, _]}:
						v;
					case _:
						throw new haxe.Exception("[getGridMaxFood]catelog[0].value not found");
				}
			case _:
				0;
		}
	}, 0);
	return grid.defaultMaxFood + addExt;
}

function getGridMaxMoney(ctx:Context, gridId:Int):Float {
	final grid = ctx.grids[gridId];
	final addExt = ctx.attachments.filter(a -> a.belongToGridId == grid.id).fold((p, a) -> {
		return a + switch p.type {
			case BANK(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [v, _]}:
						v;
					case _:
						throw new haxe.Exception("[getGridMaxMoney]catelog[0].value not found");
				}
			case _:
				0;
		}
	}, 0);
	return grid.defaultMaxMoney + addExt;
}

function getGridMaxArmy(ctx:Context, gridId:Int):Float {
	final grid = ctx.grids[gridId];
	final addExt = ctx.attachments.filter(a -> a.belongToGridId == grid.id).fold((p, a) -> {
		return a + switch p.type {
			case HOME(level):
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, p.type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${p.type}');
				}
				switch catelog[0].value {
					case {float: [v, _]}:
						v;
					case _:
						throw new haxe.Exception("[getGridMaxArmy]catelog[0].value not found");
				}
			case _:
				0;
		}
	}, 0);
	return grid.defaultMaxMoney + addExt;
}

function getGridTaxRate(ctx:Context, gridId:Int) {
	final grid = ctx.grids[gridId];
	final attachmentInGrid = ctx.attachments.filter(a -> a.belongToGridId == gridId);
	final levelRate = attachmentInGrid.map(a -> switch a.type {
		case MARKET(level):
			level;
		case BANK(level):
			level;
		case FARM(level):
			level;
		case BARN(level):
			level;
		case BARRACKS(level):
			level;
		case WALL(level):
			level;
		case EXPLORE(level):
			level;
		case _:
			0;
	}).fold((c, a:Float) -> c + a, 0.0) * 0.01;
	return GRID_TAX + levelRate;
}

function getGridBuildType(ctx:Context, gridId:Int):GROWTYPE {
	final grid = ctx.grids[gridId];
	return grid.buildtype;
	// final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
	// final belongPlayerId = getGridBelongPlayerId(ctx, grid.id);
	// final isEmpty = belongPlayerId == null && peopleInGrid.length == 0;
	// if (isEmpty) {
	// 	return EMPTY;
	// }
	// final attachmentInGrid = ctx.attachments.filter(a -> a.belongToGridId == gridId);
	// if (attachmentInGrid.length == 0) {
	// 	return EMPTY;
	// }
	// final moneyCnt = attachmentInGrid.map(a -> switch a.type {
	// 	case MARKET(level):
	// 		level;
	// 	case _:
	// 		0;
	// }).fold((c, a) -> c + a, 0);
	// final foodCnt = attachmentInGrid.map(a -> switch a.type {
	// 	case FARM(level):
	// 		level;
	// 	case _:
	// 		0;
	// }).fold((c, a) -> c + a, 0);
	// final armyCnt = attachmentInGrid.map(a -> switch a.type {
	// 	case BARRACKS(level):
	// 		level;
	// 	case WALL(level):
	// 		level;
	// 	case _:
	// 		0;
	// }).fold((c, a) -> c + a, 0);
	// if (moneyCnt > 0 && foodCnt > 0 && armyCnt > 0) {
	// 	return CITY;
	// }
	// final maxV = Math.max(moneyCnt, Math.max(foodCnt, armyCnt));
	// if (maxV == moneyCnt) {
	// 	return MARKET;
	// }
	// if (maxV == foodCnt) {
	// 	return FARM;
	// }
	// if (maxV == armyCnt) {
	// 	return VILLAGE;
	// }
	// throw new haxe.Exception("必須是一個類型, 請檢查GridGenerator, 非空地請確保每個類型都至少一個建物");
}

function getGridInfo(ctx:Context, grid:Grid):model.GridGenerator.Grid {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
	final belongPlayerId = getGridBelongPlayerId(ctx, grid.id);
	final isEmpty = belongPlayerId == null && peopleInGrid.length == 0;
	return {
		id: grid.id,
		name: grid.name,
		landType: grid.landType,
		landAttachment: [],
		buildtype: grid.buildtype,
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
		treasures: getTreasureInGrid(ctx, grid.id).map(t -> getTreasureInfo(ctx, t)),
		maxMoney: getGridMaxMoney(ctx, grid.id),
		maxFood: getGridMaxFood(ctx, grid.id),
		maxArmy: getGridMaxArmy(ctx, grid.id),
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

private function calcTotalsByPlayerId(ctx:Context, playerId:Int):model.IModel.PlayerInfo {
	final p = getPlayerById(ctx, playerId);
	final playerInfo = getPlayerInfo(ctx, p);
	final total = calcGridsByPlayerInfo(ctx, deepCopy(playerInfo));
	playerInfo.food = playerInfo.food + total.food;
	playerInfo.money = playerInfo.money + total.money;
	playerInfo.army = playerInfo.army + total.army;
	return playerInfo;
}

private function calcTotals(ctx:Context):Array<model.IModel.PlayerInfo> {
	return ctx.players.map(p -> calcTotalsByPlayerId(ctx, p.id));
}

final getCalcTotalsByPlayerId = calcTotalsByPlayerId;

function getAnimationEventFromEvent(e:Event):Event {
	final ANIMATION_DURATION = 2.0;
	return switch e {
		case PAY_FOR_OVER_ENEMY_GRID(value, gameInfo, _):
			PAY_FOR_OVER_ENEMY_GRID(value, gameInfo, {
				duration: ANIMATION_DURATION
			});
		case SETTLE_RESULT(value, gameInfo, _):
			ANIMATION_EVENT_SNATCH({
				gridIds: [value.gridId],
				duration: ANIMATION_DURATION,
				msg: '開拓成功',
			}, gameInfo);
		// case PEOPLE_LEVEL_UP_EVENT(value, gameInfo):
		// 	ANIMATION_EVENT_SNATCH({
		// 		gridIds: [value.gridId],
		// 		duration: ANIMATION_DURATION,
		// 		msg: "升級",
		// 	}, gameInfo);
		case WAR_RESULT(value, gameInfo):
			// 不會出現在這
			ANIMATION_EVENT_SNATCH({
				gridIds: [value.gridId],
				duration: ANIMATION_DURATION,
				msg: '攻城${value.success ? "成功" : "失敗"}',
			}, gameInfo);
		case NEGOTIATE_RESULT(value, gameInfo):
			ANIMATION_EVENT_SNATCH({
				gridIds: [value.gridId],
				duration: ANIMATION_DURATION,
				msg: "交涉",
			}, gameInfo);
		case EXPLORE_RESULT(value, gameInfo):
			ANIMATION_EVENT_SNATCH({
				gridIds: [value.gridId],
				duration: ANIMATION_DURATION,
				msg: "探索",
			}, gameInfo);
		case HIRE_RESULT(value, gameInfo):
			ANIMATION_EVENT_SNATCH({
				gridIds: [value.gridId],
				duration: ANIMATION_DURATION,
				msg: "雇用",
			}, gameInfo);
		case RESOURCE_RESULT(value, gameInfo):
			ANIMATION_EVENT_SNATCH({
				gridIds: [value.gridId],
				duration: ANIMATION_DURATION,
				msg: '買賣或調度',
			}, gameInfo);
		case FIRE_RESULT(value, gameInfo):
			ANIMATION_EVENT_SNATCH({
				gridIds: [value.gridId],
				duration: ANIMATION_DURATION,
				msg: "解雇",
			}, gameInfo);
		case SNATCH_RESULT(value, gameInfo):
			ANIMATION_EVENT_SNATCH({
				gridIds: [value.gridId],
				duration: ANIMATION_DURATION,
				msg: '搶奪${value.success ? "成功" : "不利"}',
			}, gameInfo);
		case STRATEGY_RESULT(value, gameInfo, _):
			STRATEGY_RESULT(value, gameInfo, {duration: ANIMATION_DURATION});
		case BUILDING_RESULT(value, gameInfo):
			ANIMATION_EVENT_SNATCH({
				gridIds: [value.gridId],
				duration: ANIMATION_DURATION,
				msg: "建築",
			}, gameInfo);
		case COST_FOR_BONUS_RESULT(value, gameInfo):
			ANIMATION_EVENT_SNATCH({
				gridIds: [value.gridId],
				duration: ANIMATION_DURATION,
				msg: "塔營或訓練或作樂",
			}, gameInfo);
		case PK_RESULT(value, gameInfo):
			ANIMATION_EVENT_SNATCH({
				gridIds: [value.gridId],
				duration: ANIMATION_DURATION,
				msg: "號召",
			}, gameInfo);
		case FIND_TREASURE_RESULT(value, gameInfo):
			ANIMATION_EVENT_SNATCH({
				gridIds: [value.gridId],
				duration: ANIMATION_DURATION,
				msg: "找寶",
			}, gameInfo);
		case _:
			e;
	}
}

function getEventInfo(e:Event):EventInfo {
	return switch e {
		case WORLD_EVENT(value, gameInfo):
			{
				id: EventInfoID.WORLD_EVENT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case WALK_STOP(value, gameInfo):
			{
				id: EventInfoID.WALK_STOP,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case NEGOTIATE_RESULT(value, gameInfo):
			{
				id: EventInfoID.NEGOTIATE_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case EXPLORE_RESULT(value, gameInfo):
			{
				id: EventInfoID.EXPLORE_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case HIRE_RESULT(value, gameInfo):
			{
				id: EventInfoID.HIRE_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case WAR_RESULT(value, gameInfo):
			{
				id: EventInfoID.WAR_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case RESOURCE_RESULT(value, gameInfo):
			{
				id: EventInfoID.RESOURCE_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case FIRE_RESULT(value, gameInfo):
			{
				id: EventInfoID.FIRE_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case SNATCH_RESULT(value, gameInfo):
			{
				id: EventInfoID.SNATCH_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case STRATEGY_RESULT(value, gameInfo, autoplay):
			{
				id: EventInfoID.STRATEGY_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: autoplay,
			}
		case BUILDING_RESULT(value, gameInfo):
			{
				id: EventInfoID.BUILDING_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case PAY_FOR_OVER_ENEMY_GRID(value, gameInfo, autoplay):
			{
				id: EventInfoID.PAY_FOR_OVER_ENEMY_GRID,
				value: value,
				gameInfo: gameInfo,
				autoplay: autoplay,
			}
		case PEOPLE_LEVEL_UP_EVENT(value, gameInfo):
			{
				id: EventInfoID.PEOPLE_LEVEL_UP_EVENT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case COST_FOR_BONUS_RESULT(value, gameInfo):
			{
				id: EventInfoID.COST_FOR_BONUS_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case PK_RESULT(value, gameInfo):
			{
				id: EventInfoID.PK_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case GRID_RESOURCE_EVENT(value, gameInfo):
			{
				id: EventInfoID.GRID_RESOURCE_EVENT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case GRID_BORN_EVENT(value, gameInfo):
			{
				id: EventInfoID.GRID_BORN_EVENT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case FIND_TREASURE_RESULT(value, gameInfo):
			{
				id: EventInfoID.FIND_TREASURE_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case ANIMATION_EVENT_MOVE(value, gameInfo):
			{
				id: EventInfoID.ANIMATION_EVENT,
				value: {
					id: MOVE,
					value: value
				},
				gameInfo: gameInfo,
				autoplay: null,
			}
		case ANIMATION_EVENT_SNATCH(value, gameInfo):
			{
				id: EventInfoID.ANIMATION_EVENT,
				value: {
					id: SNATCH,
					value: value
				},
				gameInfo: gameInfo,
				autoplay: null,
			}
		case MESSAGE_EVENT(value, gameInfo):
			{
				id: EventInfoID.MESSAGE_EVENT,
				value: value,
				gameInfo: gameInfo,
				autoplay: null,
			}
		case PLAYER_LOSE(value, gameInfo, autoplay):
			{
				id: EventInfoID.PLAYER_LOSE,
				value: value,
				gameInfo: gameInfo,
				autoplay: autoplay,
			}
		case PLAYER_WIN(value, gameInfo, autoplay):
			{
				id: EventInfoID.PLAYER_WIN,
				value: value,
				gameInfo: gameInfo,
				autoplay: autoplay,
			}
		case SETTLE_RESULT(value, gameInfo, autoplay):
			{
				id: EventInfoID.SETTLE_RESULT,
				value: value,
				gameInfo: gameInfo,
				autoplay: autoplay,
			}
	}
}

// 事件排序, 數值越小越先
// 注意, 只有在非AI玩家時才排序, 因為這裡假設了玩家不在意正確的狀態順序
private function getEventSortWeight(e:Event):Int {
	return switch e {
		case WAR_RESULT(value, gameInfo):
			999;
		case SNATCH_RESULT(value, gameInfo):
			999;
		case RESOURCE_RESULT(value, gameInfo):
			-1;
		case ANIMATION_EVENT_MOVE(value, gameInfo):
			-2;
		case STRATEGY_RESULT(value, gameInfo, autoplay):
			-3;
		case PEOPLE_LEVEL_UP_EVENT(value, gameInfo):
			1;
		case _:
			0;
	}
}

function sortEventWhenRealPlayer(ctx:Context) {
	if (SORT_EVENT_WHEN_REAL_PLAYER == false) {
		return;
	}
	final player = ctx.players[ctx.currentPlayerId];
	final isRealPlayer = player.brain == null;
	if (isRealPlayer == false) {
		return;
	}
	ctx.events.sort((a, b) -> {
		return getEventSortWeight(a) - getEventSortWeight(b);
	});
}

function getGameInfo(ctx:Context, root:Bool):GameInfo {
	final events = if (root) {
		ctx.events.map(getEventInfo);
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
		landType: grid.landType,
		buildtype: grid.buildtype,
		money: grid.money,
		food: grid.food,
		army: grid.army,
		defaultMoneyGrow: grid.moneyGrow,
		defaultFoodGrow: grid.foodGrow,
		defaultArmyGrow: grid.armyGrow,
		favor: grid.favor,
		defaultMaxMoney: grid.maxMoney,
		defaultMaxFood: grid.maxFood,
		defaultMaxArmy: grid.maxArmy,
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
		id: ctx.idSeq++,
		belongToGridId: belongToGridId,
		type: type
	});
}

function addPeopleInfo(ctx:Context, belongToPlayerId:Null<Int>, gridId:Null<Int>, p:model.PeopleGenerator.People):Void {
	ctx.peoples.push({
		id: p.id,
		belongToPlayerId: belongToPlayerId,
		position: {
			gridId: gridId
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
		exp: p.exp
	});
	for (t in p.treasures) {
		addTreasureInfo(ctx, belongToPlayerId, gridId, p.id, t);
	}
}

function addPlayerInfo(ctx:Context, player:model.IModel.PlayerInfo, isAI:Bool, isLose:Bool):Void {
	ctx.players.push({
		id: player.id,
		name: player.name,
		money: player.money,
		food: player.food,
		army: player.army,
		strategy: 0,
		position: player.atGridId,
		memory: {
			hasDice: false,
			hasStrategy: false,
			hasCommand: false,
			hasBuild: false,
			hasEquip: false,
		},
		brain: isAI ? {
			memory: null
		} : null,
		score: 0.0,
		isLose: isLose,
		hate: [],
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
	final attachmentRate = ctx.attachments.filter(a -> getGridBelongPlayerId(ctx, a.belongToGridId) == people.belongToPlayerId).fold((p, a:Float) -> {
		return a * switch p.type {
			case EXPLORE(level):
				[1.0, 0.8][level];
			case _:
				1.0;
		}
	}, 1.0);
	final cost = switch getPeopleType(ctx, peopleId) {
		case WENGUAN(level):
			people.cost * (1 + EXP_LEVEL_COST_EXT[level]);
		case WUJIANG(level):
			people.cost * (1 + EXP_LEVEL_COST_EXT[level]);
		case _:
			people.cost;
	}
	return cost * attachmentRate;
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

function getPeopleMaxArmy(ctx:Context, peopleId:Int):Float {
	final people = getPeopleById(ctx, peopleId);
	return Math.pow(getExpLevel(people.exp), 0.80) * 200 + 600;
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
	// ret.push(BREAK);
	// ret.push(CUTPATH);
	// ret.push(SETTLE);
	final player = getPlayerById(ctx, playerId);
	final gridInfo = getGridInfo(ctx, ctx.grids[player.position]);
	if (player.memory.hasDice == false) {
		ret.push(MOVE);
		if (ctx.turn > 0) {
			if (player.memory.hasStrategy == false) {
				ret.push(STRATEGY);
			}
		}
		ret.push(TREASURE);
		if (player.memory.hasEquip == false) {
			ret.push(TREASURE_TAKE);
		}
		ret.push(FIRE);
	} else {
		if (gridInfo.belongPlayerId == null) {
			// 中立的
			if (player.memory.hasCommand == false) {
				switch gridInfo.buildtype {
					case EMPTY:
						ret.push(EXPLORE);
						ret.push(CAMP);
						ret.push(PRACTICE);
					case _:
				}
				if (gridInfo.people.length > 0) {
					// 有人的
					switch gridInfo.buildtype {
						case EMPTY:
							ret.push(HIRE);
						case _:
							if (gridInfo.favor[playerId] >= CAN_CHANGE_FAVOR) {
								// 好感的
								ret.push(PAY_FOR_FUN);
								switch gridInfo.buildtype {
									case MARKET:
										ret.push(EARN_MONEY);
										ret.push(BUY_FOOD);
										ret.push(SELL_FOOD);
										ret.push(BUY_ARMY);
										ret.push(SELL_ARMY);
									case FARM:
										ret.push(EARN_MONEY);
										ret.push(BUY_FOOD);
										ret.push(SELL_FOOD);
										ret.push(BUY_ARMY);
										ret.push(SELL_ARMY);
									case VILLAGE:
										ret.push(EARN_MONEY);
										ret.push(BUY_FOOD);
										ret.push(SELL_FOOD);
										ret.push(BUY_ARMY);
										ret.push(SELL_ARMY);
									case CITY:
										ret.push(EARN_MONEY);
										ret.push(BUY_FOOD);
										ret.push(SELL_FOOD);
										ret.push(BUY_ARMY);
										ret.push(SELL_ARMY);
									case _:
								}
							}
							switch gridInfo.buildtype {
								case MARKET | FARM | VILLAGE | CITY:
									ret.push(NEGOTIATE);
									ret.push(PK);
									ret.push(SNATCH);
									ret.push(OCCUPATION);
								case _:
							}
					}
				} else {
					switch gridInfo.buildtype {
						case EMPTY:
							// 中立並沒人才有開拓
							ret.push(SETTLE);
						case _:
					}
				}
			}
			ret.push(END);
		} else if (gridInfo.belongPlayerId != playerId) {
			// 敵人的
			if (player.memory.hasCommand == false) {
				// 人打人不能單挑
				// ret.push(PK);
				ret.push(SNATCH);
				ret.push(OCCUPATION);
			}
			ret.push(END);
		} else {
			// 自己的
			ret.push(TRANSFER);
			if (player.memory.hasBuild == false) {
				ret.push(BUILD);
			}
			if (player.memory.hasCommand == false) {
				ret.push(PAY_FOR_FUN);
			}
			ret.push(END);
		}
		// 如果走到寶物所
		final hasTreasureMarket = ctx.attachments.filter(a -> a.belongToGridId == player.position).filter(a -> {
			switch a.type {
				case TREASURE(_):
					true;
				case _:
					false;
			}
		}).length > 0;
		if (hasTreasureMarket) {
			ret.push(TREASURE_MARKET);
		}
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
	final player = getPlayerById(ctx, playerId);
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
		gridId: player.position,
	}
	resultValue.success = fn();
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	resultValue.gridId = player.position;
	ctx.events.push(RESOURCE_RESULT(resultValue, getGameInfo(ctx, false)));
	return resultValue.success;
}

function wrapStrategyEvent(ctx:Context, playerId:Int, peopleId:Int, strategyId:Int, fn:() -> Bool):Bool {
	final p1 = getPeopleById(ctx, peopleId);
	final player = getPlayerById(ctx, playerId);
	final strategy = StrategyList[strategyId];
	final strategyResultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		strategy: strategy,
		energyBefore: p1.energy,
		energyAfter: 0.0,
		moneyBefore: player.money,
		moneyAfter: 0.0,
		gridId: player.position,
	}
	strategyResultValue.success = fn();
	strategyResultValue.people = getPeopleInfo(ctx, p1);
	strategyResultValue.energyAfter = p1.energy;
	strategyResultValue.moneyAfter = player.money;
	ctx.events.push(STRATEGY_RESULT(strategyResultValue, getGameInfo(ctx, false), null));
	return strategyResultValue.success;
}

function getGridById(ctx:Context, gridId:Int):Grid {
	final findGrid = ctx.grids.filter(g -> g.id == gridId);
	if (findGrid.length == 0) {
		throw new haxe.Exception('gridId not found:${gridId}');
	}
	return findGrid[0];
}

function getPlayerById(ctx:Context, playerId:Int):Player {
	final find = ctx.players.filter(g -> g.id == playerId);
	if (find.length == 0) {
		throw new haxe.Exception('playerId not found:${playerId}');
	}
	return find[0];
}
