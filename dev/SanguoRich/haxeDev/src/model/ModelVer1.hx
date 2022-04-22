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

// 打開nullsafty選項
// 請參照html5.hxml
// https://haxe.org/manual/cr-null-safety.html
class ModelVer1 extends DebugModel {
	final background:GameInfoBackground = {
		currentPlayerId: 0
	}

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
		#if debug
		// https://haxe.org/manual/lf-condition-compilation.html
		trace("playerDice");
		#end
		final activePlayerId = background.currentPlayerId;
		final player = info.players[activePlayerId];
		final fromGridId = player.atGridId;
		final moveStep = Math.floor(Math.random() * 6) + 1;
		final toGridId = fromGridId + moveStep;
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
		final toGrid = info.grids[toGridId];
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
		final player = info.players[playerId];
		final negoCost = getNegoCost(playerId, gridId, people.id, invite.id);
		return {
			energyAfter: people.energy - Std.int(negoCost.peopleCost.energy),
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
		final p1 = getPeopleById(p1SelectId);
		final p2 = getPeopleById(p2SelectId);
		final player = info.players[playerId];
		final evt = {
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
		final success = applyNegoCost(playerId, gridId, p1SelectId, p2SelectId);
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
		final grid = info.grids[gridId];
		final fightPeople = [p1SelectId, p2SelectId].map(getPeopleById);
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

	function applyNegoCost(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int):Bool {
		final negoCost = getNegoCost(playerId, gridId, p1SelectId, p2SelectId);
		// 無論成功或失敗武將先消體力
		final people = getPeopleById(p1SelectId);
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
		final grid = info.grids[gridId];
		grid.army -= negoCost.playerCost.army;
		grid.money -= negoCost.playerCost.money;
		grid.food -= negoCost.playerCost.food;
		// 玩家搶奪
		final player = info.players[playerId];
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
		final player = info.players[playerId];
		final cost = getExploreCost(playerId, gridId, people.id, invite.id);
		return {
			energyAfter: people.energy - Std.int(cost.peopleCost.energy),
			successRate: cost.successRate
		}
	}

	override function takeExplore(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		final p1 = getPeopleById(p1SelectId);
		final p2 = getPeopleById(p2SelectId);
		final player = info.players[playerId];
		final evt = {
			id: EventInfoID.EXPLORE_RESULT,
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
		final success = applyExploreCost(playerId, gridId, p1SelectId, p2SelectId);
		evt.value.success = success;
		evt.value.energyAfter = p1.energy;
		evt.value.armyAfter = player.army;
		evt.value.moneyAfter = player.money;
		evt.value.foodAfter = player.food;
		info.events = [evt];
		updateGameInfo();
		cb(info);
	}

	function getExploreCost(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
		final grid = info.grids[gridId];
		final fightPeople = [p1SelectId, p2SelectId].map(getPeopleById);
		switch fightPeople {
			case [p1, p2]:
				final useEnergy = p1.energy / 3;
				final base = (useEnergy / 100) + 0.2;
				final charmFactor = p1.charm / p2.charm;
				final rate = base * charmFactor;
				return {
					playerCost: {
						id: playerId,
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

	function applyExploreCost(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int):Bool {
		final negoCost = getExploreCost(playerId, gridId, p1SelectId, p2SelectId);
		// 無論成功或失敗武將先消體力
		final people = getPeopleById(p1SelectId);
		if (people.energy < negoCost.peopleCost.energy) {
			throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
		}
		people.energy -= Std.int(negoCost.peopleCost.energy);
		//
		final success = Math.random() < negoCost.successRate;
		if (success == false) {
			return false;
		}
		final people2 = getPeopleById(p2SelectId);
		// 將人移到玩家上
		final player = info.players[playerId];
		player.people.push(people2);
		// 從格子上移除人
		final grid = info.grids[gridId];
		grid.people = grid.people.filter(p -> p.id != people2.id);
		updateGameInfo();
		return true;
	}

	// =================================
	// 佔領
	// =================================
	override function getTakeWarPreview(playerId:Int, gridId:Int):WarPreview {
		final grid = info.grids[gridId];
		if (grid.buildtype == BUILDING.EMPTY) {
			throw new haxe.Exception("空地不能攻擊");
		}
		final gridOrPlayer:PlayerInfo = switch info.grids[gridId].belongPlayerId {
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
		final find = getPeopleIterator().filter(p -> p.id == id);
		if (find.length == 0) {
			throw new haxe.Exception('people not found: ${id}');
		}
		return find[0];
	}
}
