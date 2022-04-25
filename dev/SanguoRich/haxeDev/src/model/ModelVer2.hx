package model;

import model.IModel.GameInfo;
import model.GridGenerator.BUILDING;
import model.IModel.ActionInfoID;
import model.IModel.EventInfoID;
import model.IModel.ExplorePreview;
import model.IModel.PreResultOnExplore;
import model.IModel.PreResultOnWar;
import model.IModel.PreResultOnHire;
import model.IModel.PreResultOnNego;
import model.IModel.HirePreview;
import model.IModel.NegoPreview;
import model.IModel.WarPreview;

using Lambda;

class ModelVer2 extends DebugModel {
	final context:Context = {
		grids: [],
		attachments: [],
		peoples: [],
		players: [],
		currentPlayerId: 0,
		actions: [],
		events: [],
	}

	override function gameStart(cb:Void->Void):Void {
		initContext(context, {});
		cb();
	}

	override function gameInfo():GameInfo {
		return getGameInfo(context, true);
	}

	override function playerDice(cb:() -> Void) {
		doPlayerDice(context);
		cb();
	}

	override function playerEnd(cb:() -> Void) {
		doPlayerEnd(context);
		cb();
	}

	override function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview {
		return doGetTakeNegoPreview(context, playerId, gridId);
	}

	override function getPreResultOfNego(playerId:Int, gridId:Int, people:model.PeopleGenerator.People, invite:model.PeopleGenerator.People):PreResultOnNego {
		return doGetPreResultOfNego(context, playerId, gridId, people.id, invite.id);
	}

	override function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		doTakeNegoOn(context, playerId, gridId, p1SelectId, p2SelectId);
		cb(gameInfo());
	}

	// =================================
	// 雇用
	// 找武將
	// =================================
	override function getTakeHirePreview(playerId:Int, gridId:Int):HirePreview {
		return doGetTakeHirePreview(context, playerId, gridId);
	}

	override function getPreResultOfHire(playerId:Int, gridId:Int, people:model.PeopleGenerator.People, invite:model.PeopleGenerator.People):PreResultOnHire {
		return doGetPreResultOfHire(context, playerId, gridId, people.id, invite.id);
	}

	override function takeHire(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		doTakeHire(context, playerId, gridId, p1SelectId, p2SelectId);
		cb(gameInfo());
	}
}

private typedef Grid = {
	id:Int,
	buildtype:BUILDING,
	money:Float,
	food:Float,
	army:Float,
}

private typedef Attachment = {
	id:Int,
	belongToGridId:Int
}

private typedef People = {
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
	abilities:Array<Int>,
	energy:Float
}

private typedef Player = {
	id:Int,
	name:String,
	money:Float,
	food:Float,
	army:Float,
	strategy:Float,
	position:Int,
}

private enum Action {
	MOVE(value:{
		playerId:Int,
		fromGridId:Int,
		toGridId:Int,
	}, context:Context);
}

private enum Event {
	WORLD_EVENT(value:{});
	WALK_STOP(value:{
		grid:Grid,
		commands:Dynamic,
	});
	NEGOTIATE_RESULT(value:{
		success:Bool,
		people:People,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	EXPLORE_RESULT(value:{});
	HIRE_RESULT(value:{
		success:Bool,
		people:People,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	WAR_RESULT(value:{});
}

private typedef Context = {
	grids:Array<Grid>,
	attachments:Array<Attachment>,
	peoples:Array<People>,
	players:Array<Player>,
	currentPlayerId:Int,
	actions:Array<Action>,
	events:Array<Event>,
}

private function getPeopleInfo(ctx:Context, people:People):model.PeopleGenerator.People {
	return {
		id: people.id,
		type: 0,
		name: people.name,
		command: 0,
		force: Std.int(people.force),
		intelligence: Std.int(people.intelligence),
		political: Std.int(people.political),
		charm: Std.int(people.charm),
		cost: Std.int(people.cost),
		abilities: people.abilities,
		energy: Std.int(people.energy)
	}
}

private function getPlayerInfo(ctx:Context, player:Player):model.IModel.PlayerInfo {
	return {
		id: player.id,
		name: player.name,
		money: player.money,
		food: player.food,
		army: player.army,
		strategy: player.strategy,
		people: ctx.peoples.filter(p -> p.position.player == true && p.belongToPlayerId == player.id).map(p -> getPeopleInfo(ctx, p)),
		atGridId: player.position,
		maintainPeople: 0,
		maintainArmy: 0
	}
}

private function getGridInfo(ctx:Context, grid:Grid):model.GridGenerator.Grid {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
	return {
		id: grid.id,
		landType: 0,
		buildtype: grid.buildtype,
		height: 0,
		attachs: [],
		belongPlayerId: peopleInGrid.length > 0 ? peopleInGrid[0].belongToPlayerId : null,
		value: 0,
		money: grid.money,
		moneyGrow: 0,
		food: grid.food,
		foodGrow: 0,
		army: grid.army,
		armyGrow: 0,
		people: peopleInGrid.map(p -> getPeopleInfo(ctx, p)),
	}
}

private function getGameInfo(ctx:Context, root:Bool):GameInfo {
	return {
		players: ctx.players.map(p -> getPlayerInfo(ctx, p)),
		grids: ctx.grids.map(p -> getGridInfo(ctx, p)),
		isPlayerTurn: true,
		currentPlayer: getPlayerInfo(ctx, ctx.players[ctx.currentPlayerId]),
		isPlaying: true,
		events: root ? ctx.events.map(e -> {
			return switch e {
				case WORLD_EVENT(value):
					{
						id: EventInfoID.WORLD_EVENT,
						value: value,
					}
				case WALK_STOP(value):
					{
						id: EventInfoID.WALK_STOP,
						value: {
							grid: getGridInfo(ctx, value.grid),
							commands: value.commands
						},
					}
				case NEGOTIATE_RESULT(value):
					{
						id: EventInfoID.NEGOTIATE_RESULT,
						value: {
							success: value.success,
							people: getPeopleInfo(ctx, value.people),
							energyBefore: value.energyBefore,
							energyAfter: value.energyAfter,
							armyBefore: value.armyBefore,
							armyAfter: value.armyAfter,
							moneyBefore: value.moneyBefore,
							moneyAfter: value.moneyAfter,
							foodBefore: value.foodBefore,
							foodAfter: value.foodAfter,
						},
					}
				case _:
					throw new haxe.Exception("未知的event");
			}
		}) : [],
		actions: root ? ctx.actions.map(a -> {
			return switch a {
				case MOVE(value, ctx):
					{
						id: ActionInfoID.MOVE,
						value: value,
						gameInfo: getGameInfo(ctx, false)
					}
				case _:
					throw new haxe.Exception("未知的action");
			}
		}) : []
	}
}

private function addGridInfo(ctx:Context, grid:model.GridGenerator.Grid):Void {
	ctx.grids.push({
		id: grid.id,
		buildtype: grid.buildtype,
		money: grid.money,
		food: grid.food,
		army: grid.army,
	});
	for (p in grid.people) {
		ctx.peoples.push({
			id: p.id,
			belongToPlayerId: null,
			position: {
				gridId: grid.id,
				player: false
			},
			name: p.name,
			force: p.force,
			intelligence: p.intelligence,
			political: p.political,
			charm: p.charm,
			cost: p.cost,
			abilities: p.abilities,
			energy: p.energy,
		});
	}
}

private function addPeopleInfo(ctx:Context, belongToPlayerId:Null<Int>, gridId:Null<Int>, p:model.PeopleGenerator.People):Void {
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
		energy: p.energy,
	});
}

private function addPlayerInfo(ctx:Context, player:model.IModel.PlayerInfo):Void {
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
		ctx.peoples.push({
			id: p.id,
			belongToPlayerId: player.id,
			position: {
				gridId: null,
				player: true
			},
			name: p.name,
			force: p.force,
			intelligence: p.intelligence,
			political: p.political,
			charm: p.charm,
			cost: p.cost,
			abilities: p.abilities,
			energy: p.energy,
		});
	}
}

private function initContext(ctx:Context, option:{}) {
	final genGrids = model.GridGenerator.getInst().getGrids(100);
	for (grid in genGrids) {
		addGridInfo(ctx, grid);
	}
	var i = 0;
	for (name in ["vic", "han", "xiao", "any"]) {
		addPlayerInfo(ctx, {
			id: i++,
			name: name,
			money: 1000.0,
			army: 100.0,
			food: 100.0,
			strategy: 10.0,
			people: [
				model.PeopleGenerator.getInst().generate(),
				model.PeopleGenerator.getInst().generate()
			],
			maintainPeople: -1.2,
			maintainArmy: -1.1,
			atGridId: 0
		});
	}
}

private function getPeopleById(ctx:Context, id:Int):People {
	final find = ctx.peoples.filter(p -> p.id == id);
	if (find.length == 0) {
		throw new haxe.Exception('people not found: ${id}');
	}
	return find[0];
}

private function doPlayerDice(ctx:Context) {
	final activePlayerId = ctx.currentPlayerId;
	final player = ctx.players[activePlayerId];
	final fromGridId = player.position;
	final moveStep = Math.floor(Math.random() * 6) + 1;
	final toGridId = fromGridId + moveStep;
	player.position = toGridId;
	ctx.actions = [
		Action.MOVE({
			playerId: activePlayerId,
			fromGridId: fromGridId,
			toGridId: toGridId
		}, // 強制將nullable轉型成非nullable
			cast Reflect.copy(ctx))
	];
	final toGrid = ctx.grids[toGridId];
	ctx.events = [
		Event.WALK_STOP({
			grid: toGrid,
			commands: [],
		})
	];
}

private function doPlayerEnd(ctx:Context) {
	ctx.currentPlayerId = (ctx.currentPlayerId + 1) % ctx.players.length;
	ctx.actions = [];
	ctx.events = [];
}

// =================================
// 交涉
// 向城池奪取%資源
// =================================
private function doGetTakeNegoPreview(ctx:Context, playerId:Int, gridId:Int):NegoPreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
		p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people,
	};
}

private function doGetPreResultOfNego(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, inviteId:Int):PreResultOnNego {
	final player = ctx.players[playerId];
	final people = getPeopleById(ctx, peopleId);
	final negoCost = getNegoCost(ctx, playerId, gridId, peopleId, inviteId);
	return {
		energyAfter: Std.int(people.energy - negoCost.peopleCost.energy),
		armyBefore: Std.int(player.army),
		armyAfter: Std.int(player.army + negoCost.playerCost.army),
		moneyBefore: Std.int(player.money),
		moneyAfter: Std.int(player.money + negoCost.playerCost.money),
		foodBefore: Std.int(player.food),
		foodAfter: Std.int(player.food + negoCost.playerCost.food),
		successRate: negoCost.successRate
	};
}

private function doTakeNegoOn(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final p2 = getPeopleById(ctx, p2SelectId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: cast Reflect.copy(p1),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	final success = applyNegoCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	resultValue.success = success;
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.NEGOTIATE_RESULT(resultValue)];
}

// 交涉(智力/政治/魅力)
private function getNegoCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	final grid = ctx.grids[gridId];
	final fightPeople = [p1SelectId, p2SelectId].map(id -> getPeopleById(ctx, id));
	switch fightPeople {
		case [p1, p2]:
			// 用掉1/5的體力(最多20)
			// 體力越少效率越低
			final useEnergy = p1.energy / 5;
			// 使用20體力的情況下基礎值為0.5
			final base = (useEnergy / 100) + 0.3;
			final intelligenceFactor = p1.intelligence / p2.intelligence;
			final politicalFactor = p1.political / p2.political;
			final charmFactor = p1.charm / p2.charm;
			final rate = base * intelligenceFactor * politicalFactor * charmFactor;
			final gainRate = 0.1 * rate + 0.1;
			return {
				playerCost: {
					id: playerId,
					army: grid.army * gainRate,
					money: grid.money * gainRate,
					food: grid.food * gainRate
				},
				peopleCost: {
					id: p1.id,
					energy: useEnergy,
				},
				successRate: rate
			};
		case _:
			throw new haxe.Exception("fightPeople not right");
	}
}

private function applyNegoCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int):Bool {
	final negoCost = getNegoCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	people.energy -= Std.int(negoCost.peopleCost.energy);
	//
	final success = Math.random() < negoCost.successRate;
	if (success == false) {
		return false;
	}
	// 城池被搶奪
	final grid = ctx.grids[gridId];
	grid.army -= negoCost.playerCost.army;
	grid.money -= negoCost.playerCost.money;
	grid.food -= negoCost.playerCost.food;
	// 玩家搶奪
	final player = ctx.players[playerId];
	player.army += negoCost.playerCost.army;
	player.money += negoCost.playerCost.money;
	player.food += negoCost.playerCost.food;
	return true;
}

private function doGetTakeHirePreview(ctx:Context, playerId:Int, gridId:Int):HirePreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
		p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people,
	};
}

private function doGetPreResultOfHire(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, inviteId:Int):PreResultOnHire {
	final player = ctx.players[playerId];
	final cost = getHireCost(ctx, playerId, gridId, peopleId, inviteId);
	final p1 = getPeopleById(ctx, peopleId);
	return {
		energyBefore: Std.int(p1.energy),
		energyAfter: Std.int(p1.energy - cost.peopleCost.energy),
		moneyBefore: 0,
		moneyAfter: 0,
		successRate: cost.successRate
	}
}

private function doTakeHire(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final p2 = getPeopleById(ctx, p2SelectId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: cast Reflect.copy(p1),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	final success = applyNegoCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	resultValue.success = success;
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.HIRE_RESULT(resultValue)];
}

private function getHireCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	final grid = ctx.grids[gridId];
	final fightPeople = [p1SelectId, p2SelectId].map(p -> getPeopleById(ctx, p));
	switch fightPeople {
		case [p1, p2]:
			final useEnergy = p1.energy / 3;
			final base = (useEnergy / 100) + 0.2;
			final charmFactor = p1.charm / p2.charm;
			// 人脈加成
			final abiFactor = p1.abilities.has(10) ? 1.5 : 1;
			final rate = base * charmFactor * abiFactor;
			return {
				playerCost: {
					id: playerId,
					money: p2.cost
				},
				peopleCost: {
					id: p1.id,
					energy: useEnergy,
				},
				successRate: rate
			};
		case _:
			throw new haxe.Exception("fightPeople not right");
	}
}

private function applyHireCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int):Bool {
	final negoCost = getHireCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	people.energy -= negoCost.peopleCost.energy;
	//
	final success = Math.random() < negoCost.successRate;
	if (success == false) {
		return false;
	}
	final hirePeople = getPeopleById(ctx, p2SelectId);
	final player = ctx.players[playerId];
	// 支付雇用費
	player.money -= negoCost.playerCost.money;
	// 將人變成主公的
	hirePeople.belongToPlayerId = playerId;
	// 將人移到玩家上
	hirePeople.position.player = true;
	// 從格子上移除人
	hirePeople.position.gridId = null;
	return true;
}
