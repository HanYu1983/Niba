package model;

import model.GridGenerator.BUILDING;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

typedef PlayerInfo = {
	id:Int,
	name:String,
	money:Float,
	food:Float,
	army:Float,
	strategy:Float,
	people:Array<People>,
	grids:Array<Grid>,
	atGridId:Int,
	maintainPeople:Float,
	maintainArmy:Float,
	armyGrow:Float,
	commands:Array<ActionInfoID>
	// enabledCast:Bool,
	// enabledEnd:Bool
}

enum ActionInfoID {
	MOVE;
	STRATEGY;
	FIRE;

	NEGOTIATE;
	PK;
	SNATCH;
	OCCUPATION;
	CAMP;
	PRACTICE;
	HIRE;
	EXPLORE;
	PAY_FOR_FUN;
	EARN_MONEY;
	BUY_FOOD;
	SELL_FOOD;
	BUY_ARMY;
	SELL_ARMY;
	TRANSFER;
	BUILD;
	END;
}

typedef ActionInfo = {
	id:ActionInfoID,
	value:Dynamic,
	gameInfo:GameInfo
}

enum EventInfoID {
	WALK_STOP;
	NEGOTIATE_RESULT;
	EXPLORE_RESULT;
	HIRE_RESULT;
	FIRE_RESULT;
	WAR_RESULT;
	SNATCH_RESULT;
	RESOURCE_RESULT;
	STRATEGY_RESULT;
	BUILDING_RESULT;
	COST_FOR_BONUS_RESULT;
	PK_RESULT;

	WORLD_EVENT;
	GRID_BORN_EVENT;
	GRID_RESOURCE_EVENT;
	PEOPLE_LEVEL_UP_EVENT;
	PAY_FOR_OVER_ENEMY_GRID;
}

enum MARKET {
	BUY;
	SELL;
}

enum RESOURCE {
	MONEY;
	FOOD;
	ARMY;
	STRETEGY;
}

typedef EventInfo = {
	id:EventInfoID,
	value:Dynamic
}

typedef GameInfo = {
	players:Array<PlayerInfo>,
	playerGrids:Array<PlayerInfo>,
	playerTotals:Array<PlayerInfo>,
	grids:Array<Grid>,
	isPlayerTurn:Bool,
	currentPlayer:PlayerInfo,
	isPlaying:Bool,
	events:Array<EventInfo>,
	actions:Array<ActionInfo>,
	currentTurn:Int,
}

typedef SnatchPreview = {
	p1ValidPeople:Array<People>,
	p2ValidPeople:Array<People>,
	isP1ArmyValid:Bool,
	isP2ArmyValid:Bool,
}

typedef WarPreview = {
	p1:PlayerInfo,
	p2:PlayerInfo,
	p1ValidPeople:Array<People>,
	p2ValidPeople:Array<People>,
}

typedef NegoPreview = {
	p1ValidPeople:Array<People>,
	p2ValidPeople:Array<People>,
}

typedef HirePreview = {
	p1ValidPeople:Array<People>,
	p2ValidPeople:Array<People>,
}

typedef PreResultOnNego = {
	energyBefore:Int,
	energyAfter:Int,
	armyBefore:Int,
	armyAfter:Int,
	moneyBefore:Int,
	moneyAfter:Int,
	foodBefore:Int,
	foodAfter:Int,
	maintainFoodBefore:Float,
	maintainFoodAfter:Float,
	successRate:Float
}

typedef PreResultOnWar = {
	energyBefore:Int,
	energyAfter:Int,
	armyBefore:Int,
	armyAfter:Int,
	moneyBefore:Int,
	moneyAfter:Int,
	foodBefore:Int,
	foodAfter:Int,
	maintainFoodBefore:Float,
	maintainFoodAfter:Float,
}

typedef PreResultOnSnatch = {
	war:Array<PreResultOnWar>,
	money:Float,
	food:Float,
}

typedef PreResultOnHire = {
	energyBefore:Int,
	energyAfter:Int,
	moneyBefore:Float,
	moneyAfter:Float,
	maintainMoneyBefore:Float,
	maintainMoneyAfter:Float,
	successRate:Float
}

// }

typedef ExplorePreview = {
	p1ValidPeople:Array<People>,
}

typedef PreResultOnExplore = {
	energyBefore:Int,
	energyAfter:Int,
	successRate:Float
}

typedef ResourcePreview = {
	p1ValidPeople:Array<People>,
}

typedef PreResultOnResource = {
	energyBefore:Int,
	energyAfter:Int,
	armyBefore:Int,
	armyAfter:Int,
	moneyBefore:Int,
	moneyAfter:Int,
	foodBefore:Int,
	foodAfter:Int,
	maintainFoodBefore:Float,
	maintainFoodAfter:Float,
}

typedef PreResultOnFire = {
	maintainMoneyBefore:Float,
	maintainMoneyAfter:Float,
}

enum StrategyTargetType {
	SELF_PLAYER;
	TARGET_PLAYER;

	SELF_PEOPLE;
	TARGET_PEOPLE;
	SELF_GRID;
	TARGET_GRID;
}

typedef StrategyCatelog = {
	id:Int,
	name:String,
	intelligence:Float,
	describe:String,
	targetType:StrategyTargetType,
	value:Dynamic,
}

typedef BuildingCatelog = {
	id:Int,
	name:String,
	money:Float,
	describe:String,
	type:BUILDING,
}

interface IModel {
	function gameStart(cb:Void->Void):Void;
	function gameInfo():GameInfo;
	function getPeople(count:Int):Array<People>;
	function playerDice(cb:Void->Void):Void;
	function playerEnd(cb:() -> Void):Void;

	function getPreResultOfFire(playerId:Int, p1PeopleId:Array<Int>):PreResultOnFire;
	function takeFire(playerId:Int, p1PeopleId:Array<Int>, cb:(gameInfo:GameInfo) -> Void):Void;

	function getTakeWarPreview(playerId:Int, gridId:Int):WarPreview;
	function getPreResultOfWar(playerId:Int, gridId:Int, p1:People, p2:People, army1:Float, army2:Float):Array<PreResultOnWar>;
	function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo) -> Void):Void;

	function getTakeSnatchPreview(playerId:Int, gridId:Int):SnatchPreview;
	function getPreResultOfSnatch(playerId:Int, gridId:Int, p1:People, p2:People, isOccupation:Bool):PreResultOnSnatch;
	function takeSnatchOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, isOccupation:Bool, cb:(gameInfo:GameInfo) -> Void):Void;

	function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview;
	function getPreResultOfNego(playerId:Int, gridId:Int, p1:People, p2:People):PreResultOnNego;
	function takeNegoOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, cb:(gameInfo:GameInfo) -> Void):Void;

	function getTakeHirePreview(playerId:Int, gridId:Int):HirePreview;
	function getPreResultOfHire(playerId:Int, gridId:Int, p1:People, p2:People):PreResultOnHire;
	function takeHire(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, cb:(gameInfo:GameInfo) -> Void):Void;

	function getTakeExplorePreview(playerId:Int, gridId:Int):ExplorePreview;
	function getPreResultOfExplore(playerId:Int, gridId:Int, p1:People):PreResultOnExplore;
	function takeExplore(playerId:Int, gridId:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo) -> Void):Void;

	function getTakeResourcePreview(playerId:Int, gridId:Int, market:MARKET, type:RESOURCE):ResourcePreview;
	function getPreResultOfResource(playerId:Int, gridId:Int, p1:People, market:MARKET, type:RESOURCE):PreResultOnResource;
	function takeResource(playerId:Int, gridId:Int, p1PeopleId:Int, market:MARKET, type:RESOURCE, cb:(gameInfo:GameInfo) -> Void):Void;

	function checkValidTransfer(playerId:Int, gridId:Int, playerInfo:PlayerInfo, gridInfo:Grid):Bool;
	function takeTransfer(playerId:Int, gridId:Int, playerInfo:PlayerInfo, gridInfo:Grid, cb:(gameInfo:GameInfo) -> Void):Void;

	function getStrategyRate(p1People:People, strategy:StrategyCatelog, targetPlayerId:Int, targetPeopleId:Int,
		targetGridId:Int):{energyBefore:Int, energyAfter:Int, rate:Float};
	function takeStrategy(p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int, cb:(gameInfo:GameInfo) -> Void):Void;
	function takeBuilding(p1PeopleId:Int, gridId:Int, peopleId:Int, current:Dynamic, to:Dynamic, cb:(gameInfo:GameInfo) -> Void):Void;

	function getResultOfCost(p1Player:PlayerInfo, p1People:People, costType:Int):{
		costFood:Float,
		costMoney:Float,
		gainExp:Float,
		gainEnergy:Float
	};
	function takeCostForBonus(playerId:Int, peopleId:Int, costType:Int, cb:(gameInfo:GameInfo) -> Void):Void;

	function save(cb:(success:Bool) -> Void):Void;
	function load(cb:(success:Bool, gameInfo:GameInfo) -> Void):Void;

	function getPreResultOfPk(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int):{
		energyBefore:Int,
		energyAfter:Int,
		armyChange:Int,
		successRate:Float
	};
	function takePk(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, syncViewByInfo:(gameInfo:GameInfo) -> Void):Void;
}

final StrategyList:Array<StrategyCatelog> = [
	{
		id: 0,
		name: '暗渡陳艙',
		intelligence: 75,
		describe: '可以指定移動1~3格數(無視路障)',
		targetType: StrategyTargetType.TARGET_GRID,
		value: {
			valid: [1, 2, 3]
		}
	},
	{
		id: 1,
		name: '步步為營',
		intelligence: 50,
		describe: '指定武將回復30體力（可以恢復自己）',
		targetType: StrategyTargetType.SELF_PEOPLE,
		value: null
	},
	{
		id: 2,
		name: '遠交近攻',
		intelligence: 75,
		describe: '直接獲取該格子的10%資源。並且友好度上升1',
		targetType: StrategyTargetType.SELF_GRID,
		value: null
	},
	{
		id: 3,
		name: '緩兵之計',
		intelligence: 50,
		describe: '指定自己前後5格當中的其中一格設置路障。走到那個格子的所以玩家會自動停下。然後路障消失',
		targetType: StrategyTargetType.TARGET_GRID,
		value: {
			valid: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
		}
	},
	{
		id: 4,
		name: '火中取栗',
		intelligence: 75,
		describe: '拆除指定路障，如果那個路障是別的玩家，拿取那個玩家10金',
		targetType: StrategyTargetType.TARGET_GRID,
		value: null
	},
	{
		id: 5,
		name: '趁虛而入',
		intelligence: 60,
		describe: '指定武將體力-20',
		targetType: StrategyTargetType.TARGET_PEOPLE,
		value: null
	},
	{
		id: 6,
		name: '按兵不動',
		intelligence: 40,
		describe: '這回合不移動',
		targetType: StrategyTargetType.SELF_PLAYER,
		value: null
	},
	{
		id: 7,
		name: '急功近利',
		intelligence: 80,
		describe: '指定玩家變賣20糧獲得20錢',
		targetType: StrategyTargetType.TARGET_PLAYER,
		value: null
	},
	{
		id: 8,
		name: '五穀豐登',
		intelligence: 90,
		describe: '所有自己城池的糧食+5%',
		targetType: StrategyTargetType.SELF_PLAYER,
		value: null
	},
];

final BuildingList:Array<BuildingCatelog> = [
	{
		id: 0,
		name: '農田(未建)',
		money: 50,
		describe: '糧食每回合+0',
		type: FARM(0)
	},
	{
		id: 1,
		name: '農田(小)',
		money: 20,
		describe: '糧食每回合+2',
		type: FARM(1)
	},
	{
		id: 2,
		name: '農田(中)',
		money: 20,
		describe: '糧食每回合+3',
		type: FARM(2)
	},
	{
		id: 3,
		name: '農田(大)',
		money: 0,
		describe: '糧食每回合+4',
		type: FARM(3)
	},
	{
		id: 4,
		name: '市集(未建)',
		money: 50,
		describe: '金錢每回合+0',
		type: MARKET(0)
	},
	{
		id: 5,
		name: '市集(小)',
		money: 20,
		describe: '金錢每回合+2',
		type: MARKET(1)
	},
	{
		id: 6,
		name: '市集(中)',
		money: 20,
		describe: '金錢每回合+3',
		type: MARKET(2)
	},
	{
		id: 7,
		name: '市集(大)',
		money: 0,
		describe: '金錢每回合+4',
		type: MARKET(3)
	},
	{
		id: 8,
		name: '兵營(未建)',
		money: 50,
		describe: '士兵每回合+0',
		type: BARRACKS(0)
	},
	{
		id: 9,
		name: '兵營(小)',
		money: 20,
		describe: '士兵每回合+1',
		type: BARRACKS(1)
	},
	{
		id: 10,
		name: '兵營(中)',
		money: 20,
		describe: '士兵每回合+2',
		type: BARRACKS(2)
	},
	{
		id: 11,
		name: '兵營(大)',
		money: 0,
		describe: '士兵每回合+3',
		type: BARRACKS(3)
	},
	{
		id: 12,
		name: '人材所(未建)',
		money: 50,
		describe: '提高武將在探索計算時的魅力(+0)及聘用計算時的魅力(+0)',
		type: EXPLORE(0)
	},
	{
		id: 13,
		name: '人材所',
		money: 0,
		describe: '提高武將在探索計算時的魅力(+5)及聘用計算時的魅力(+5)',
		type: EXPLORE(1)
	},
	{
		id: 14,
		name: '城墻(未建)',
		money: 50,
		describe: '此格子防禦方的加成提高。(+0%)',
		type: WALL(0)
	},
	{
		id: 15,
		name: '城墻(弱)',
		money: 20,
		describe: '此格子防禦方的加成提高。(+15%)',
		type: WALL(1)
	},
	{
		id: 16,
		name: '城墻(中)',
		money: 20,
		describe: '此格子防禦方的加成提高。(+30%)',
		type: WALL(2)
	},
	{
		id: 17,
		name: '城墻(強)',
		money: 0,
		describe: '此格子防禦方的加成提高。(+50%)',
		type: WALL(3)
	}
];
