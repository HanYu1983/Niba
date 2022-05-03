package model.ver2;

import model.PeopleGenerator;
import model.GridGenerator;
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
	defaultMoneyGrow:Float,
	defaultFoodGrow:Float,
	defaultArmyGrow:Float,
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

typedef Player = {
	id:Int,
	name:String,
	money:Float,
	food:Float,
	army:Float,
	strategy:Float,
	position:Int,
	memory:{
		hasDice:Bool, hasStrategy:Bool, hasCommand:Bool, hasBuild:Bool
	},
}

typedef GroundItem = {
	id:Int,
	position:Int,
	belongToPlayerId:Null<Int>,
}

enum Action {
	MOVE(value:{
		playerId:Int,
		fromGridId:Int,
		toGridId:Int,
	}, gameInfo:GameInfo);
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
	});
}

typedef Context = {
	grids:Array<Grid>,
	attachments:Array<Attachment>,
	peoples:Array<People>,
	players:Array<Player>,
	currentPlayerId:Int,
	actions:Array<Action>,
	events:Array<Event>,
	groundItems:Array<GroundItem>,
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
		abilities: people.abilities,
		energy: Std.int(people.energy),
		gridId: people.position.gridId,
		exp: people.exp,
		sleep: false
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
		commands: getPlayerCommand(ctx, player.id)
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
	final totalPeoplePolitical = peopleInGrid.fold((p, a) -> {
		return a + p.political;
	}, 0.0);
	final factor1 = 1 / (peopleInGrid.length * 100);
	return grid.defaultMoneyGrow * (totalPeoplePolitical * factor1);
}

function getGridFoodGrow(ctx:Context, gridId:Int):Float {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	// 沒武將的格子不成長
	if (peopleInGrid.length == 0) {
		return 0.0;
	}
	final grid = ctx.grids[gridId];
	final totalPeopleIntelligence = peopleInGrid.fold((p, a) -> {
		return a + p.intelligence;
	}, 0.0);
	final factor1 = 1 / (peopleInGrid.length * 100);
	return grid.defaultFoodGrow * (totalPeopleIntelligence * factor1);
}

function getGridArmyGrow(ctx:Context, gridId:Int):Float {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	// 沒武將的格子不成長
	if (peopleInGrid.length == 0) {
		return 0.0;
	}
	final grid = ctx.grids[gridId];
	final totalPeoplecharm = peopleInGrid.fold((p, a) -> {
		return a + p.charm;
	}, 0.0);
	final factor1 = 1 / (peopleInGrid.length * 100);
	return grid.defaultArmyGrow * (totalPeoplecharm * factor1);
}

function getGridInfo(ctx:Context, grid:Grid):model.GridGenerator.Grid {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
	final belongPlayerId = getGridBelongPlayerId(ctx, grid.id);
	final isEmpty = belongPlayerId == null && peopleInGrid.length == 0;
	return {
		id: grid.id,
		name: grid.name,
		landType: 0,
		buildtype: isEmpty ? GROWTYPE.EMPTY : grid.buildtype,
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
		]
	}
}

function getGameInfo(ctx:Context, root:Bool):GameInfo {
	function calcGrids(playerInfo:model.IModel.PlayerInfo):model.IModel.PlayerInfo {
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

	// 不管週期, 直接計算下一次的結果
	final nextCtx = deepCopy(ctx); // _cloner.clone(ctx);
	model.ver2.alg.Alg.doPeopleMaintain(nextCtx);
	model.ver2.alg.Alg.doGridGrow(nextCtx);

	final events:Array<model.IModel.EventInfo> = root ? ctx.events.map(e -> {
		// 顯式使用類型(EventInfo), 這裡不能依靠類型推理, 不然會編譯錯誤
		final eventInfo:model.IModel.EventInfo = switch e {
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
		}
		return eventInfo;
	}) : [];
	// 先進後出
	events.reverse();

	return {
		players: ctx.players.map(p -> getPlayerInfo(ctx, p)).map(p -> {
			// 計算下次結算後的差額
			final nextP = nextCtx.players[p.id];
			p.maintainPeople = nextP.money - p.money;
			p.maintainArmy = nextP.food - p.food;
			p.armyGrow = nextP.army - p.army;
			return p;
		}),
		playerGrids: ctx.players.map(p -> getPlayerInfo(ctx, p)).map(calcGrids),
		playerTotals: ctx.players.map(p -> {
			final playerInfo = getPlayerInfo(ctx, p);
			final total = calcGrids(Reflect.copy(playerInfo));
			playerInfo.food = playerInfo.food + total.food;
			playerInfo.money = playerInfo.money + total.money;
			playerInfo.army = playerInfo.army + total.army;
			return playerInfo;
		}),
		grids: ctx.grids.map(p -> getGridInfo(ctx, p)).map(p -> {
			// 計算下次結算後的差額
			final nextP = nextCtx.grids[p.id];
			p.moneyGrow = nextP.money - p.money;
			p.armyGrow = nextP.army - p.army;
			p.foodGrow = nextP.food - p.food;
			return p;
		}),
		isPlayerTurn: true,
		currentPlayer: getPlayerInfo(ctx, ctx.players[ctx.currentPlayerId]),
		isPlaying: true,
		events: events,
		actions: root ? ctx.actions.map(a -> {
			final actionInfo:model.IModel.ActionInfo = switch a {
				case MOVE(value, gameInfo):
					{
						id: ActionInfoID.MOVE,
						value: value,
						gameInfo: gameInfo
					}
			}
			return actionInfo;
		}) : []
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
		defaultMoneyGrow: grid.moneyGrow,
		defaultFoodGrow: grid.foodGrow,
		defaultArmyGrow: grid.armyGrow,
		favor: grid.favor,
	});
	for (p in grid.people) {
		addPeopleInfo(ctx, null, grid.id, p);
	}
	for (p in grid.attachs) {
		addAttachInfo(ctx, grid.id, p);
	}
}

private var _id = 0;

function getNextId():Int {
	return _id++;
}

function addAttachInfo(ctx:Context, belongToGridId:Int, attach:BUILDING) {
	ctx.attachments.push({
		id: getNextId(),
		belongToGridId: belongToGridId,
		type: attach
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
}

function addPlayerInfo(ctx:Context, player:model.IModel.PlayerInfo):Void {
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
		}
	});
	for (p in player.people) {
		addPeopleInfo(ctx, player.id, null, p);
	}
}

function getMaintainPeople(ctx:Context, playerId:Int):Float {
	final totalPeopleCost = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a) -> {
		return a + getPeopleMaintainCost(ctx, p.id);
	}, 0.0);
	return getMaintainPeoplePure(totalPeopleCost);
}

function getMaintainArmy(ctx:Context, playerId:Int):Float {
	final totalArmy = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).fold((p, a) -> {
		return a + p.army;
	}, 0.0) + ctx.players[playerId].army;
	return getMaintainArmyPure(totalArmy);
}

function getMaintainPeoplePure(totalPeopleCost:Float):Float {
	return totalPeopleCost * PLAYER_EARN_PER_TURN_PERSENT;
}

function getMaintainArmyPure(totalArmy:Float):Float {
	return totalArmy * PLAYER_EARN_PER_TURN_PERSENT;
}

function getPeopleById(ctx:Context, id:Int):People {
	final find = ctx.peoples.filter(p -> p.id == id);
	if (find.length == 0) {
		throw new haxe.Exception('people not found: ${id}');
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

function getPeopleMaintainCost(ctx:Context, peopleId):Float {
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

function getPeopleForce(ctx:Context, peopleId):Float {
	final people = getPeopleById(ctx, peopleId);
	return switch getPeopleType(ctx, peopleId) {
		case WUJIANG(level):
			people.force + EXP_LEVEL_ABI_EXT[level];
		case _:
			people.force;
	}
}

function getPeopleIntelligence(ctx:Context, peopleId):Float {
	final people = getPeopleById(ctx, peopleId);
	return switch getPeopleType(ctx, peopleId) {
		case WENGUAN(level):
			people.intelligence + EXP_LEVEL_ABI_EXT[level];
		case _:
			people.intelligence;
	}
}

function getPeoplePolitical(ctx:Context, peopleId):Float {
	final people = getPeopleById(ctx, peopleId);
	return switch getPeopleType(ctx, peopleId) {
		case WENGUAN(level):
			people.political + EXP_LEVEL_ABI_EXT[level];
		case _:
			people.political;
	}
}

function getPeopleCharm(ctx:Context, peopleId):Float {
	final people = getPeopleById(ctx, peopleId);
	return switch getPeopleType(ctx, peopleId) {
		case WENGUAN(level):
			people.charm + EXP_LEVEL_ABI_EXT[level];
		case WUJIANG(level):
			people.charm + EXP_LEVEL_ABI_EXT[level];
		case _:
			people.charm;
	}
}

function getPeopleCommand(ctx:Context, peopleId):Float {
	final people = getPeopleById(ctx, peopleId);
	return switch getPeopleType(ctx, peopleId) {
		case WUJIANG(level):
			people.command + EXP_LEVEL_ABI_EXT[level];
		case _:
			people.command;
	}
}

function getPlayerCommand(ctx:Context, playerId:Int):Array<ActionInfoID> {
	final ret:Array<ActionInfoID> = [];
	// ret.push(ActionInfoID.BUILD);
	final player = ctx.players[playerId];
	final gridInfo = getGridInfo(ctx, ctx.grids[player.position]);
	if (player.memory.hasDice == false) {
		ret.push(ActionInfoID.MOVE);
		if (player.memory.hasStrategy == false) {
			ret.push(ActionInfoID.STRATEGY);
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
							if (gridInfo.favor[playerId] >= 1) {
								// 好感的
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
							} else {
								// 討厭的
								switch gridInfo.buildtype {
									case MARKET | FARM | VILLAGE | CITY:
										ret.push(ActionInfoID.NEGOTIATE);
										ret.push(ActionInfoID.SNATCH);
										ret.push(ActionInfoID.OCCUPATION);
									case _:
								}
							}
					}
				}
			}
			ret.push(ActionInfoID.END);
		} else if (gridInfo.belongPlayerId != playerId) {
			// 敵人的
			if (player.memory.hasCommand == false) {
				ret.push(ActionInfoID.SNATCH);
				ret.push(ActionInfoID.OCCUPATION);
			}
			ret.push(ActionInfoID.END);
		} else {
			// 自己的
			ret.push(ActionInfoID.TRANSFER);
			if (player.memory.hasBuild == false) {
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
	}
}
