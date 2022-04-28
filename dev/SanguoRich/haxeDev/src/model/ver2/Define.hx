package model.ver2;

import model.GridGenerator.BUILDING;
import model.IModel.GameInfo;

typedef Grid = {
	id:Int,
	buildtype:BUILDING,
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
	energy:Float
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
		grid:model.GridGenerator.Grid,
		commands:Array<Dynamic>,
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
		people:model.PeopleGenerator.People,
		maintainMoneyAfter:Float,
		maintainMoneyBefore:Float,
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
