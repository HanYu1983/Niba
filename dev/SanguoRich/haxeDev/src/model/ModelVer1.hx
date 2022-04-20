package model;

import model.IModel.PreResultOnExplore;
import model.IModel.PreResultOnNego;
import model.IModel.ExplorePreview;
import model.GridGenerator.BUILDING;
import model.IModel.NegoPreview;
import model.IModel.WarPreview;
import model.IModel.ActionInfoID;
import model.IModel.EventInfoID;
import model.IModel.PlayerInfo;
import model.IModel.GameInfo;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

typedef GameInfoBackground = {
	currentPlayerId:Int
}

var defaultGameInfoBackground:GameInfoBackground = {
	currentPlayerId: 0
}

// 打開nullsafty選項
// 請參照html5.hxml
// https://haxe.org/manual/cr-null-safety.html
class ModelVer1 extends DebugModel {
	var background = defaultGameInfoBackground;

	function updateGameInfo() {
		info.isPlayerTurn = true; // background.currentPlayerId == 0;
		info.currentPlayer = info.players[background.currentPlayerId];
		info.isPlaying = true;
	}

	override function currentPlayer():PlayerInfo {
		updateGameInfo();
		return info.currentPlayer;
	}

	override function isPlayerTurn():Bool {
		updateGameInfo();
		return info.isPlayerTurn;
	}

	override function gameInfo():GameInfo {
		updateGameInfo();
		return info;
	}

	override function playerDice(cb:() -> Void) {
		var activePlayerId = background.currentPlayerId;
		var player = info.players[activePlayerId];
		var fromGridId = player.atGridId;
		var toGridId = fromGridId + Math.floor(Math.random() * 6);
		player.atGridId = toGridId;
		info.actions = [
			{
				id: ActionInfoID.MOVE,
				value: {
					playerId: activePlayerId,
					fromGridId: fromGridId,
					toGridId: toGridId
				},
				gameInfo: gameInfo() // Reflect.copy(gameInfo())
			}
		];
		var toGrid = info.grids[toGridId];
		info.events = [
			{
				id: EventInfoID.WALK_STOP,
				value: {
					grid: toGrid,
					commands: []
				}
			}
		];
		cb();
	}

	override function playerEnd(cb:() -> Void) {
		background.currentPlayerId = (background.currentPlayerId + 1) % 4;
		info.actions = [];
		info.events = [];
		cb();
	}

	override public function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview {
		return {
			p1ValidPeople: info.players[playerId].people,
			p2ValidPeople: info.grids[gridId].people
		};
	}

	override public function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
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
				}
			}
		];
		cb(info);
	}

	override function getPreResultOfNego(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnNego {
		return {
			energyAfter: 1,
			armyBefore: 2,
			armyAfter: 3,
			moneyBefore: 4,
			moneyAfter: 5,
			foodBefore: 6,
			foodAfter: 7,
			successRate: .8
		};
	}

	override function getTakeExplorePreview(playerId:Int, gridId:Int):ExplorePreview {
		return {
			p1ValidPeople: info.players[playerId].people,
			p2ValidPeople: info.grids[gridId].people
		};
	}

	override function takeExplore(playerId:Int, gridInt:Int, p1SelectId:Int, exploreId:Int, cb:(gameInfo:GameInfo) -> Void) {
		var info = gameInfo();
		info.events = [
			{
				id: EventInfoID.EXPLORE_RESULT,
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

	override function getPreResultOfExplore(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnExplore {
		return {
			energyAfter: 20,
			successRate: .2
		}
	}
}
