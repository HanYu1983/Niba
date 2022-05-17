package model;

import haxe.macro.Expr.Error;
import model.TreasureGenerator.TreasureCatelog;
import model.GridGenerator.GROWTYPE;
import model.GridGenerator.BUILDING;
import model.IModel;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

class DebugModel implements IModel {
	public function new() {}

	private var info:GameInfo;

	public function getGrids(count:Int):Array<Grid> {
		return GridGenerator.getInst().getGrids(count, false);
	}

	public function getPeople(count:Int):Array<People> {
		var people = [];
		for (i in 0...count) {
			people.push(PeopleGenerator.getInst().generate());
		}
		return people;
	}

	function gp(id, name) {
		return {
			{
				id: id,
				name: name,
				money: 1000.0,
				army: 100.0,
				food: 100.0,
				strategy: 10.0,
				people: [PeopleGenerator.getInst().generate(), PeopleGenerator.getInst().generate()],
				grids: [],
				maintainPeople: -1.2,
				maintainArmy: -1.1,
				armyGrow: 0.01,
				atGridId: 0,
				commands: [
					ActionInfoID.MOVE,
					ActionInfoID.STRATEGY,
					ActionInfoID.SNATCH,
					ActionInfoID.TREASURE,
					ActionInfoID.TREASURE_TAKE,
					// ActionInfoID.EXPLORE,
					// ActionInfoID.BUILD,
					// ActionInfoID.FIRE,
					// ActionInfoID.PK,
					// ActionInfoID.CAMP,
					// ActionInfoID.PAY_FOR_FUN,
					// ActionInfoID.PRACTICE,
					ActionInfoID.END,
				],
				treasures: [
					// TreasureGenerator.getInst().generator(),
					// TreasureGenerator.getInst().generator(),
				]
			}
		}
	}

	public function gameStart(setting:GameSetting, cb:Void->Void):Void {
		info = {
			players: [gp(0, 'vic'), gp(1, 'han'), gp(2, 'xiao'), gp(3, 'any')],
			playerGrids: [gp(0, 'vic'), gp(1, 'han'), gp(2, 'xiao'), gp(3, 'any')],
			playerTotals: [gp(0, 'vic'), gp(1, 'han'), gp(2, 'xiao'), gp(3, 'any')],
			grids: getGrids(100),
			isPlayerTurn: true,
			currentPlayer: gp(0, 'vic'),
			isPlaying: true,
			events: [],
			actions: [],
			currentTurn: 0
		};
		info.grids[5].belongPlayerId = 2;
		info.grids[9].belongPlayerId = 1;
		info.grids[11].belongPlayerId = 3;
		cb();
	}

	public function currentPlayer():PlayerInfo {
		return info.currentPlayer;
	}

	public function isPlayerTurn():Bool {
		return info.isPlayerTurn;
	}

	public function gameInfo():GameInfo {
		return info;
	}

	public function playerDice(cb:() -> Void) {
		info.players[0].atGridId += Math.floor(Math.random() * 6);
		info.currentPlayer = info.players[Math.floor(Math.random() * 4)];
		info.isPlayerTurn = (info.currentPlayer.id == 0);
		// info.actions = [
		// 	{
		// 		id: ActionInfoID.MOVE,
		// 		value: {
		// 			playerId: 0,
		// 			fromGridId: 5,
		// 			toGridId: 10
		// 		},
		// 		gameInfo: gameInfo()
		// 	}
		// ];

		var g = GridGenerator.getInst().getGrid();
		g.belongPlayerId = null;
		g.buildtype = GROWTYPE.MARKET;
		info.events = [
			// {
			// 	id:EventInfoID.ANIMATION_EVENT,
			// 	value:{
			// 		id: ActionInfoID.MOVE,
			// 		value: {
			// 			playerId: 0,
			// 			fromGridId: 5,
			// 			toGridId: 10
			// 		},
			// 	},
			// 	gameInfo: info,
			// 	autoplay: null,
			// },
			// {
			// 	id:EventInfoID.ANIMATION_EVENT,
			// 	value:{
			// 		id: ActionInfoID.SNATCH,
			// 		value: {
			// 			gridIds: [12, 15, 4],
			// 			duration: 1.5,
			// 			msg: '戰爭'
			// 		},
			// 	},
			// 	gameInfo: info,
			// 	autoplay: null,
			// },
			// {
			// 	id: EventInfoID.GRID_RESOURCE_EVENT,
			// 	value:{
			// 		grids:[
			// 			{
			// 				gridBefore: g,
			// 				gridAfter: g,

			// 			},
			// 			{
			// 				gridBefore: g,
			// 				gridAfter: g,
			// 			}
			// 		],
			// 		describtion:'aaa'
			// 	},
			// 	gameInfo: info,
			// 	autoplay: null,
			// },
			// {
			// 	id:EventInfoID.ANIMATION_EVENT,
			// 	value:{
			// 		id: ActionInfoID.MOVE,
			// 		value: {
			// 			playerId: 0,
			// 			fromGridId: 5,
			// 			toGridId: 10
			// 		},
			// 	},
			// 	gameInfo: info,
			// 	autoplay: null,
			// },
			// {
			// 	id:EventInfoID.GRID_BORN_EVENT,
			// 	value:{
			// 		grid:g,
			// 	},
			// 	gameInfo: info,
			// 	autoplay: null,
			// },
			{
				id: EventInfoID.MESSAGE_EVENT,
				value: {
					title: 'aaff',
					msg: 'asdfsfd'
				},
				gameInfo: info,
				autoplay: {
					duration: 2
				},
			},
			{
				id: EventInfoID.PLAYER_LOSE,
				value: {
					player: info.players[0]
				},
				gameInfo: info,
				autoplay: null
			},
			{
				id: EventInfoID.PLAYER_WIN,
				value: {
					player: info.players[0]
				},
				gameInfo: info,
				autoplay: null
			}
		];
		cb();
	}

	public function playerEnd(cb:() -> Void) {
		info.players[0].atGridId += Math.floor(Math.random() * 6);
		info.currentPlayer = info.players[Math.floor(Math.random() * 4)];
		info.isPlayerTurn = (info.currentPlayer.id == 0);
		// info.actions = [
		// 	{
		// 		id: ActionInfoID.MOVE,
		// 		value: {
		// 			playerId: 0,
		// 			fromGridId: 8,
		// 			toGridId: 13
		// 		},
		// 		gameInfo: gameInfo()
		// 	},
		// 	{
		// 		id: ActionInfoID.MOVE,
		// 		value: {
		// 			playerId: 1,
		// 			fromGridId: 10,
		// 			toGridId: 15
		// 		},
		// 		gameInfo: gameInfo()
		// 	}
		// ];
		info.events = [
			{
				id: EventInfoID.PEOPLE_LEVEL_UP_EVENT,
				value: {
					peopleBefore: PeopleGenerator.getInst().generate(),
					peopleAfter: PeopleGenerator.getInst().generate(),
				},
				gameInfo: null,
				autoplay: null,
			},
			{
				id: EventInfoID.PAY_FOR_OVER_ENEMY_GRID,
				value: {
					moneyBefore: 0,
					moneyAfter: 1,
					foodBefore: 1,
					foodAfter: 1,
					armyBefore: 0,
					armyAfter: 1
				},
				gameInfo: null,
				autoplay: null,
			}
		];
		cb();
	}

	public function getTakeWarPreview(playerId:Int, gridId:Int):WarPreview {
		return null;
	}

	public function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo) -> Void) {
		var info = gameInfo();
		info.events = [
			{
				id: EventInfoID.NEGOTIATE_RESULT,
				value: null,
				gameInfo: info,
				autoplay: null,
			},
		];
		cb(info);
	}

	public function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview {
		return null;
	}

	public function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		var info = gameInfo();
		info.events = [
			{
				id: EventInfoID.NEGOTIATE_RESULT,
				value: {
					success: true,
					people: PeopleGenerator.getInst().generate(),
					energyBefore: 100,
					energyAfter: 50,
					armyBefore: 200,
					armyAfter: 300,
					moneyBefore: 200,
					moneyAfter: 300,
					foodBefore: 100,
					foodAfter: 200
				},
				gameInfo: null,
				autoplay: null,
			}
		];
		cb(info);
	}

	public function getTakeHirePreview(playerId:Int, gridId:Int):HirePreview {
		return null;
	}

	public function takeHire(playerId:Int, gridInt:Int, p1SelectId:Int, exploreId:Int, cb:(gameInfo:GameInfo) -> Void) {}

	public function getRateOfInvitePeople(people:People, invite:People):Float {
		return .5;
	}

	public function getPreResultOfNego(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnNego {
		return null;
	}

	public function getPreResultOfHire(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnHire {
		return null;
	}

	public function getPreResultOfWar(playerId:Int, gridId:Int, p1:People, p2:People, army1:Float, army2:Float):Array<PreResultOnWar> {
		return null;
	}

	public function getTakeExplorePreview(playerId:Int, gridId:Int):ExplorePreview {
		return null;
	}

	public function getPreResultOfExplore(playerId:Int, gridId:Int, p1:People):PreResultOnExplore {
		return null;
	}

	public function takeExplore(playerId:Int, gridInt:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo) -> Void) {
		info.events = [
			{
				id: EventInfoID.FIND_TREASURE_RESULT,
				value: {
					treasure: TreasureGenerator.getInst().generator().catelog
				},
				gameInfo: info,
				autoplay: null,
			}
		];
		cb(info);
	}

	public function getTakeResourcePreview(playerId:Int, gridId:Int, market:MARKET, type:RESOURCE):ResourcePreview {
		return null;
	}

	public function getPreResultOfResource(playerId:Int, gridId:Int, p1:People, market:MARKET, type:RESOURCE):PreResultOnResource {
		return null;
	}

	public function takeResource(playerId:Int, gridInt:Int, p1PeopleId:Int, market:MARKET, type:RESOURCE, cb:(gameInfo:GameInfo) -> Void) {}

	public function getPreResultOfFire(playerId:Int, p1PeopleId:Array<Int>):PreResultOnFire {
		return {
			maintainMoneyAfter: 10,
			maintainMoneyBefore: 10,
		}
	}

	public function takeFire(playerId:Int, p1PeopleId:Array<Int>, cb:(gameInfo:GameInfo) -> Void) {
		var info = gameInfo();
		info.events = [
			{
				id: EventInfoID.FIRE_RESULT,
				value: {
					success: true,
					people: PeopleGenerator.getInst().generate(),
					maintainMoneyAfter: 10,
					maintainMoneyBefore: 10,
				},
				gameInfo: null,
				autoplay: null,
			}
		];
		cb(info);
	}

	public function checkValidTransfer(playerId:Int, gridInt:Int, playerInfo:PlayerInfo, gridInfo:Grid):Bool {
		return true;
	}

	public function takeTransfer(playerId:Int, gridInt:Int, playerInfo:PlayerInfo, gridInfo:Grid, cb:(gameInfo:GameInfo) -> Void) {}

	public function getTakeSnatchPreview(playerId:Int, gridId:Int):SnatchPreview {
		return {
			p1ValidPeople: [PeopleGenerator.getInst().generate(), PeopleGenerator.getInst().generate(),],
			p2ValidPeople: [PeopleGenerator.getInst().generate(),],
			isP1ArmyValid: true,
			isP2ArmyValid: true,
		};
	}

	public function getPreResultOfSnatch(playerId:Int, gridId:Int, p1:People, p2:People, isOccupation:Bool):PreResultOnSnatch {
		return {
			war: [
				{
					energyBefore: 1,
					energyAfter: 1,
					armyBefore: 1,
					armyAfter: 1,
					moneyBefore: 1,
					moneyAfter: 1,
					foodBefore: 1,
					foodAfter: 1,
					maintainFoodBefore: 1,
					maintainFoodAfter: 1,
				},
				{
					energyBefore: 1,
					energyAfter: 1,
					armyBefore: 1,
					armyAfter: 1,
					moneyBefore: 1,
					moneyAfter: 1,
					foodBefore: 1,
					foodAfter: 1,
					maintainFoodBefore: 1,
					maintainFoodAfter: 1,
				}
			],
			money: 2,
			food: 1,
			rateForTreasure: .5,
		}
	}

	public function takeSnatchOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, isOccupation:Bool, cb:(gameInfo:GameInfo) -> Void) {
		var info = gameInfo();
		info.grids[gridId].belongPlayerId = playerId;
		info.grids[gridId].people = [PeopleGenerator.getInst().generate()];
		info.events = [
			{
				id: EventInfoID.SNATCH_RESULT,
				value: {
					success: false,
					people: PeopleGenerator.getInst().generate(),
					energyBefore: 100,
					energyAfter: 50,
					armyBefore: 200,
					armyAfter: 300,
					moneyBefore: 200,
					moneyAfter: 300,
					foodBefore: 100,
					foodAfter: 200
				},
				gameInfo: info,
				autoplay: null,
			}
		];
		cb(info);
	}

	public function getStrategyRate(p1People:People, strategy:StrategyCatelog, targetPlayerId:Int, targetPeopleId:Int,
			targetGridId:Int):{energyBefore:Int, energyAfter:Int, rate:Float} {
		return {
			energyAfter: 10,
			energyBefore: 5,
			rate: Math.random(),
		}
	}

	public function takeStrategy(p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int,
			cb:(gameInfo:GameInfo) -> Void):Void {
		var info = gameInfo();
		info.events = [
			{
				id: EventInfoID.STRATEGY_RESULT,
				value: {
					success: true,
					people: PeopleGenerator.getInst().generate(),
					strategy: StrategyList[0],
					energyBefore: 0,
					energyAfter: 1,
				},
				gameInfo: null,
				autoplay: null,
			},
			{
				id: EventInfoID.WALK_STOP,
				value: {
					grid: info.grids[0]
				},
				gameInfo: null,
				autoplay: null,
			}
		];
		cb(info);
	}

	public function takeBuilding(p1PeopleId:Int, gridId:Int, peopleId:Int, current:Dynamic, to:Dynamic, cb:(gameInfo:GameInfo) -> Void) {
		var info = gameInfo();
		info.events = [
			{
				id: EventInfoID.BUILDING_RESULT,
				value: {
					success: true,
					people: PeopleGenerator.getInst().generate(),
					building: BUILDING.FARM(2),
				},
				gameInfo: null,
				autoplay: null,
			}
		];
		cb(info);
	}

	public function getResultOfCost(p1Player:PlayerInfo, p1People:People, costType:Int):{
		costFood:Float,
		costMoney:Float,
		gainExp:Float,
		gainEnergy:Float
	} {
		return {
			costFood: 1,
			costMoney: 1.0,
			gainEnergy: 3,
			gainExp: 5,
		}
	}

	public function takeCostForBonus(playerId:Int, peopleId:Int, costType:Int, cb:(gameInfo:GameInfo) -> Void) {
		info.events = [
			{
				id: COST_FOR_BONUS_RESULT,
				value: {
					costType: costType,
					people: PeopleGenerator.getInst().generate(),
					peopleBefore: [PeopleGenerator.getInst().generate(), PeopleGenerator.getInst().generate(),],
					peopleAfter: [PeopleGenerator.getInst().generate(), PeopleGenerator.getInst().generate(),]
				},
				gameInfo: null,
				autoplay: null,
			}
		];
		cb(info);
	}

	public function save(cb:(success:Bool) -> Void) {
		cb(true);
	}

	public function load(cb:(success:Bool, gameInfo:GameInfo) -> Void) {
		cb(true, info);
	}

	public function getPreResultOfPk(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int):{
		energyBefore:Int,
		energyAfter:Int,
		armyChange:Int,
		successRate:Float
	} {
		return {
			energyAfter: 1,
			energyBefore: 1,
			armyChange: 4,
			successRate: .5
		}
	}

	public function takePk(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, syncViewByInfo:(gameInfo:GameInfo) -> Void) {
		info.events = [
			{
				id: PK_RESULT,
				value: {
					success: true,
					people: PeopleGenerator.getInst().generate(),
					armyBefore: 0,
					armyAfter: 0,
				},
				gameInfo: null,
				autoplay: null,
			}
		];
		syncViewByInfo(info);
	}

	public function getUnEquipResult(p1:People, unequipId:Int):{peopleBefore:People, peopleAfter:People} {
		return {
			peopleAfter: PeopleGenerator.getInst().generate(),
			peopleBefore: PeopleGenerator.getInst().generate(),
		};
	}

	public function getEquipResult(p1:People, equipId:Int):{peopleBefore:People, peopleAfter:People} {
		return {
			peopleAfter: PeopleGenerator.getInst().generate(),
			peopleBefore: PeopleGenerator.getInst().generate(),
		};
	}

	public function takeEquip(p1:People, equipId:Int, cb:(gameInfo:GameInfo) -> Void) {
		cb(info);
	}

	public function takeUnEquip(p1:People, unequipId:Int, cb:(gameInfo:GameInfo) -> Void) {
		cb(info);
	}

	public function getPeopleById(id:Int):People {
		return PeopleGenerator.getInst().generate();
	}

	public function refresh(cb:() -> Void) {
		cb();
	}

	public function finishOneEvent(syncView:() -> Void) {
		trace('前端處理好一件事!');

		syncView();
	}
}
