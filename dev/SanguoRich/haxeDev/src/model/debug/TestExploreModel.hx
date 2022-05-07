package model.debug;

import model.GridGenerator.GROWTYPE;
import model.IModel.PreResultOnExplore;
import model.IModel.ExplorePreview;
import model.IModel.PreResultOnHire;
import model.IModel.HirePreview;
import model.GridGenerator.BUILDING;
import model.IModel.NegoPreview;
import model.IModel.WarPreview;
import model.IModel.ActionInfoID;
import model.IModel.EventInfoID;
import model.IModel.PlayerInfo;
import model.IModel.GameInfo;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

class TestExploreModel extends DebugModel {
	override public function playerDice(cb:() -> Void) {
		info.players[0].atGridId += Math.floor(Math.random() * 6);
		info.currentPlayer = info.players[Math.floor(Math.random() * 4)];
		info.isPlayerTurn = (info.currentPlayer.id == 0);
		info.actions = [
			{
				id: ActionInfoID.MOVE,
				value: {
					playerId: 0,
					fromGridId: 5,
					toGridId: 10
				},
				gameInfo: gameInfo()
			}
		];

		var g = GridGenerator.getInst().getGrid();
		g.belongPlayerId = null;
		g.buildtype = GROWTYPE.EMPTY;
		info.events = [
			{
				id: EventInfoID.WALK_STOP,
				value: {
					grid: g,
					commands: []
				}
			}
		];
		cb();
	}

	override function takeExplore(playerId:Int, gridInt:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo) -> Void) {
		var info = gameInfo();
		info.events = [
			// {
			// 	id: EventInfoID.EXPLORE_RESULT,
			// 	value: {
			// 		success: true,
			// 		people: PeopleGenerator.getInst().generate(),
			// 		peopleList: [PeopleGenerator.getInst().generate()],
			// 		energyBefore: 100,
			// 		energyAfter: 50,
			// 		armyBefore: 200,
			// 		armyAfter: 300,
			// 		moneyBefore: 200,
			// 		moneyAfter: 300,
			// 		foodBefore: 100,
			// 		foodAfter: 200
			// 	}
			// },
			{
				id:EventInfoID.FIND_TREASURE_RESULT,
				value:{
					treasures:[
						TreasureGenerator.getInst().generator().catelog,
						TreasureGenerator.getInst().generator().catelog,
					]
				}
			}
		];
		cb(info);
	}

	override function getTakeExplorePreview(playerId:Int, gridId:Int):ExplorePreview {
		return {
			p1ValidPeople: [PeopleGenerator.getInst().generate(), PeopleGenerator.getInst().generate()]
		}
	}

	override function getPreResultOfExplore(playerId:Int, gridId:Int, p1:People):PreResultOnExplore {
		return {
			energyAfter: 20,
			energyBefore: 20,
			successRate: .5,
			successRateOnTreasure: .4
		}
	}

	override function getTakeHirePreview(playerId:Int, gridId:Int):HirePreview {
		return {
			p1ValidPeople: [
				PeopleGenerator.getInst().generate(),
				PeopleGenerator.getInst().generate(),
				PeopleGenerator.getInst().generate(),
			],
			p2ValidPeople: [
				PeopleGenerator.getInst().generate(),
				PeopleGenerator.getInst().generate(),
				PeopleGenerator.getInst().generate(),
			],
		}
	}

	override function takeHire(playerId:Int, gridInt:Int, p1SelectId:Int, exploreId:Int, cb:(gameInfo:GameInfo) -> Void) {
		var info = gameInfo();
		info.events = [
			{
				id: EventInfoID.HIRE_RESULT,
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
				}
			}
		];
		cb(info);
	}

	override function getPreResultOfHire(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnHire {
		return {
			energyBefore: 20,
			energyAfter: 20,
			moneyBefore: 10,
			moneyAfter: 10,
			successRate: .2,
			maintainMoneyAfter: 10,
			maintainMoneyBefore: 10,
		}
	}
}
