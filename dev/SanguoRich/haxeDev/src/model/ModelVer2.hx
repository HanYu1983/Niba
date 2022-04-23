package model;

import model.IModel.GameInfo;
import model.GridGenerator.BUILDING;
import model.IModel.ActionInfoID;
import model.IModel.EventInfoID;

class ModelVer2 extends DebugModel {
	var context:Context = {
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
}

private typedef Grid = {
	id:Int,
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
	force:Int,
	intelligence:Int,
	political:Int,
	charm:Int,
	cost:Int,
	abilities:Array<Int>,
	energy:Int
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
	NEGOTIATE_RESULT(value:{});
	EXPLORE_RESULT(value:{});
	HIRE_RESULT(value:{});
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
		force: people.force,
		intelligence: people.intelligence,
		political: people.political,
		charm: people.charm,
		cost: people.cost,
		abilities: people.abilities,
		energy: people.energy
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
		buildtype: BUILDING.EMPTY,
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
