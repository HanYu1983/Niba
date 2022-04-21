package model;

import model.IModel.PreResultOnWar;
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
import model.IModel.EventInfo;
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
		var moveStep = Math.floor(Math.random() * 6) + 1;
		var toGridId = fromGridId + moveStep;
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

	// =================================
	// 交涉
	// 向城池奪取%資源
	// =================================
	override function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview {
		return {
			p1ValidPeople: info.players[playerId].people,
			p2ValidPeople: info.grids[gridId].people
		};
	}

	override function getPreResultOfNego(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnNego {
		var player = info.players[playerId];
		var negoCost = getNegoCost(playerId, gridId, people.id, invite.id);
		return {
			energyAfter: people.energy - negoCost.peopleCost.energy,
			armyBefore: Std.int(player.army),
			armyAfter: Std.int(player.army + negoCost.playerCost.army),
			moneyBefore: Std.int(player.money),
			moneyAfter: Std.int(player.money + negoCost.playerCost.money),
			foodBefore: Std.int(player.food),
			foodAfter: Std.int(player.food + negoCost.playerCost.food),
			successRate: negoCost.successRate
		};
	}

	override function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		var p1 = getPeopleById(p1SelectId);
		var p2 = getPeopleById(p2SelectId);
		var player = info.players[playerId];
		var evt = {
			id: EventInfoID.NEGOTIATE_RESULT,
			value: {
				success: false,
				people: p1,
				energyBefore: p1.energy,
				energyAfter: p1.energy,
				armyBefore: player.army,
				armyAfter: player.army,
				moneyBefore: player.money,
				moneyAfter: player.money,
				foodBefore: player.food,
				foodAfter: player.food,
			}
		};
		var success = applyNegoCost(playerId, gridId, p1SelectId, p2SelectId);
		evt.value.success = success;
		evt.value.energyAfter = p1.energy;
		evt.value.armyAfter = player.army;
		evt.value.moneyAfter = player.money;
		evt.value.foodAfter = player.food;
		info.events = [evt];
		updateGameInfo();
		cb(info);
	}

	// 交涉(智力/政治/魅力)
	function getNegoCost(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
		var grid = info.grids[gridId];
		var fightPeople = [p1SelectId, p2SelectId].map(getPeopleById);
		switch fightPeople {
			case [p1, p2]:
				var base = 0.5;
				var intelligenceFactor = p1.intelligence / p2.intelligence;
				var politicalFactor = p1.political / p2.political;
				var charmFactor = p1.charm / p2.charm;
				var rate = base * intelligenceFactor * politicalFactor * charmFactor;
				var gainRate = 0.2 * rate;
				return {
					playerCost: {
						id: playerId,
						army: grid.army * gainRate,
						money: grid.money * gainRate,
						food: grid.food * gainRate
					},
					peopleCost: {
						id: p1.id,
						energy: 10,
					},
					successRate: rate
				};
			default:
				throw new haxe.Exception("fightPeople not right");
		}
	}

	function applyNegoCost(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int):Bool {
		var negoCost = getNegoCost(playerId, gridId, p1SelectId, p2SelectId);
		// 無論成功或失敗武將先消體力
		var people = getPeopleById(p1SelectId);
		people.energy -= negoCost.peopleCost.energy;
		//
		var success = Math.random() < negoCost.successRate;
		if (success == false) {
			return false;
		}
		// 城池被搶奪
		var grid = info.grids[gridId];
		grid.army -= negoCost.playerCost.army;
		grid.money -= negoCost.playerCost.money;
		grid.food -= negoCost.playerCost.food;
		// 玩家搶奪
		var player = info.players[playerId];
		player.army += negoCost.playerCost.army;
		player.money += negoCost.playerCost.money;
		player.food += negoCost.playerCost.food;
		updateGameInfo();
		return true;
	}

	// =================================
	// 探索
	// 找武將
	// =================================
	override function getTakeExplorePreview(playerId:Int, gridId:Int):ExplorePreview {
		return {
			p1ValidPeople: info.players[playerId].people,
			p2ValidPeople: info.grids[gridId].people
		};
	}

	override function getPreResultOfExplore(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnExplore {
		var player = info.players[playerId];
		var cost = getExploreCost(playerId, gridId, people.id, invite.id);
		return {
			energyAfter: people.energy - cost.peopleCost.energy,
			successRate: cost.successRate
		}
	}

	override function takeExplore(playerId:Int, gridId:Int, p1SelectId:Int, exploreId:Int, cb:(gameInfo:GameInfo) -> Void) {
		var p1 = getPeopleById(p1SelectId);
		var p2 = getPeopleById(exploreId);
		var preResult = getPreResultOfExplore(playerId, gridId, p1, p2);
		info.events = [
			{
				id: EventInfoID.EXPLORE_RESULT,
				value: {
					success: true,
					people: p1,
					energyBefore: p1.energy,
					energyAfter: preResult.energyAfter,
					armyBefore: 0,
					armyAfter: 0,
					moneyBefore: 0,
					moneyAfter: 0,
					foodBefore: 0,
					foodAfter: 0
				}
			}
		];
		cb(info);
	}

	// =================================
	// 佔領
	// =================================
	override function getTakeWarPreview(playerId:Int, gridId:Int):WarPreview {
		var grid = info.grids[gridId];
		if (grid.buildtype == BUILDING.EMPTY) {
			throw new haxe.Exception("空地不能攻擊");
		}
		var gridOrPlayer:PlayerInfo = switch info.grids[gridId].belongPlayerId {
			case null:
				{
					id: grid.id,
					name: 'grid${gridId}',
					money: grid.money,
					food: grid.food,
					army: grid.army,
					strategy: 0,
					people: grid.people,
					atGridId: gridId
				};
			default:
				info.players[info.grids[gridId].belongPlayerId];
		}
		return {
			p1: info.players[playerId],
			p2: gridOrPlayer,
			p1ValidPeople: info.players[playerId].people,
			p2ValidPeople: gridOrPlayer.people
		};
	}

	override function getPreResultOfWar(playerId:Int, gridId:Int, p1:People, p2:People, army1:Float, army2:Float):Array<PreResultOnWar> {
		return [
			{
				energyAfter: 1,
				armyBefore: 2,
				armyAfter: 4,
				moneyBefore: 5,
				moneyAfter: 6,
				foodBefore: 7,
				foodAfter: 8,
			},
			{
				energyAfter: 1,
				armyBefore: 2,
				armyAfter: 4,
				moneyBefore: 5,
				moneyAfter: 6,
				foodBefore: 7,
				foodAfter: 8,
			}
		];
	}

	override function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo) -> Void) {
		var info = gameInfo();
		info.events = [
			{
				id: EventInfoID.WAR_RESULT,
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

	function getPeopleIterator():Array<People> {
		var ret:Array<People> = [];
		for (player in info.players) {
			ret = ret.concat(player.people);
		}
		for (grid in info.grids) {
			ret = ret.concat(grid.people);
		}
		return ret;
	}

	function getPeopleById(id:Int):People {
		var find = getPeopleIterator().filter(p -> p.id == id);
		if (find.length == 0) {
			throw new haxe.Exception('people not found: ${id}');
		}
		return find[0];
	}

	function getExploreCost(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
		return getNegoCost(playerId, gridId, p1SelectId, p2SelectId);
	}
}
