package model.ver2;

import model.PeopleGenerator;
import model.GridGenerator;
import model.IModel;
import model.Config;

using Lambda;

typedef Grid = {
	id:Int,
	name:String,
	buildtype:GROWTYPE,
	money:Float,
	food:Float,
	army:Float,
	moneyGrow:Float,
	foodGrow:Float,
	armyGrow:Float,
	favor:Array<Int>,
}

typedef Attachment = {
	id:Int,
	belongToGridId:Int
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
}

typedef Player = {
	id:Int,
	name:String,
	money:Float,
	food:Float,
	army:Float,
	strategy:Float,
	position:Int,
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
}

typedef Context = {
	grids:Array<Grid>,
	attachments:Array<Attachment>,
	peoples:Array<People>,
	players:Array<Player>,
	currentPlayerId:Int,
	actions:Array<Action>,
	events:Array<Event>,
	turn:Int
}

function getPeopleInfo(ctx:Context, people:People):model.PeopleGenerator.People {
	return {
		id: people.id,
		type: getPeopleType(ctx, people.id),
		name: people.name,
		command: Std.int(people.command),
		force: Std.int(people.force),
		intelligence: Std.int(people.intelligence),
		political: Std.int(people.political),
		charm: Std.int(people.charm),
		cost: Std.int(people.cost),
		abilities: people.abilities,
		energy: Std.int(people.energy),
		gridId: people.position.gridId,
		exp: people.exp,
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
		maintainPeople: getMaintainPeople(ctx, player.id),
		maintainArmy: getMaintainArmy(ctx, player.id),
		armyGrow: getPlayerArmyGrow(ctx, player.id),
		grids: ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == player.id).map(g -> getGridInfo(ctx, g)),
		enabledCast: true,
		enabledEnd: false,
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
	return grid.moneyGrow * (totalPeoplePolitical * factor1);
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
	return grid.foodGrow * (totalPeopleIntelligence * factor1);
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
	return grid.armyGrow * (totalPeoplecharm * factor1);
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
		attachs: [],
		belongPlayerId: cast belongPlayerId,
		value: 0,
		money: grid.money,
		moneyGrow: getGridMoneyGrow(ctx, grid.id),
		food: grid.food,
		foodGrow: getGridFoodGrow(ctx, grid.id),
		army: grid.army,
		armyGrow: getGridArmyGrow(ctx, grid.id),
		people: peopleInGrid.map(p -> getPeopleInfo(ctx, p)),
		favor: grid.favor
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
		playerInfo.maintainPeople = 0.0;
		playerInfo.maintainArmy = 0.0;
		return playerInfo;
	}

	return {
		players: ctx.players.map(p -> getPlayerInfo(ctx, p)),
		playerGrids: ctx.players.map(p -> getPlayerInfo(ctx, p)).map(calcGrids),
		playerTotals: ctx.players.map(p -> {
			final playerInfo = getPlayerInfo(ctx, p);
			final total = calcGrids(Reflect.copy(playerInfo));
			playerInfo.food = playerInfo.food + total.food;
			playerInfo.money = playerInfo.money + total.money;
			playerInfo.army = playerInfo.army + total.army;
			return playerInfo;
		}),
		grids: ctx.grids.map(p -> getGridInfo(ctx, p)),
		isPlayerTurn: true,
		currentPlayer: getPlayerInfo(ctx, ctx.players[ctx.currentPlayerId]),
		isPlaying: true,
		events: root ? ctx.events.map(e -> {
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
			}
			return eventInfo;
		}) : [],
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
		moneyGrow: grid.moneyGrow,
		foodGrow: grid.foodGrow,
		armyGrow: grid.armyGrow,
		favor: grid.favor,
	});
	for (p in grid.people) {
		addPeopleInfo(ctx, null, grid.id, p);
	}
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
		exp: 0
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
	});
	for (p in player.people) {
		addPeopleInfo(ctx, player.id, null, p);
	}
}

function getMaintainPeople(ctx:Context, playerId:Int):Float {
	final totalPeopleCost = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a) -> {
		return a + p.cost;
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
