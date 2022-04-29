package model.debug;

import model.IModel.ExplorePreview;
import model.IModel.PreResultOnExplore;
import model.IModel.PreResultOnWar;
import model.IModel.PreResultOnHire;
import model.IModel.PreResultOnNego;
import model.IModel.HirePreview;
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

using Lambda;

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
		info.actions = [];
		info.events = [];
		// 四個玩家走完後才計算回合
		final isLastPlayer = background.currentPlayerId == 3;
		if (isLastPlayer) {
			final worldEvent = {
				id: EventInfoID.WORLD_EVENT,
				value: {
					playerBefore: info.players.map(Reflect.copy),
					playerAfter: info.players.map(Reflect.copy),
					gridBefore: info.grids.map(Reflect.copy),
					gridAfter: info.grids.map(Reflect.copy),
				}
			}
			// 城池
			for (grid in info.grids) {
				// 支付武將的薪水
				{
					final peopleMainCost = grid.people.fold((p, a) -> {
						// 薪水是雇傭金的1%
						return a + p.cost * 0.1;
					}, 0.0);
					grid.money -= peopleMainCost;
					if (grid.money < 0) {
						grid.money = 0;
					}
				}
				// 吃食物
				{
					final foodCost = grid.army * 0.01;
					grid.food -= foodCost;
					if (grid.food < 0) {
						grid.food = 0;
					}
				}
				// 城池成長
				grid.money += grid.money * grid.moneyGrow;
				grid.food += grid.food * grid.foodGrow;
				grid.army += grid.army * grid.armyGrow;
			}
			// 玩家
			for (player in info.players) {
				// 支付武將的薪水
				{
					final peopleMainCost = player.people.fold((p, a) -> {
						// 薪水是雇傭金的1%
						return a + p.cost * 0.1;
					}, 0.0);
					player.money -= peopleMainCost;
					if (player.money < 0) {
						player.money = 0;
					}
				}
				// 吃食物
				{
					final foodCost = player.army * 0.01;
					player.food -= foodCost;
					if (player.food < 0) {
						player.food = 0;
					}
				}
			}
			// 回體力
			for (people in getPeopleIterator()) {
				people.energy += Std.int(5 + people.energy / 10);
				if (people.energy > 100) {
					people.energy = 100;
				}
			}
			worldEvent.value.playerAfter = info.players.map(Reflect.copy);
			worldEvent.value.gridAfter = info.grids.map(Reflect.copy);
			info.events.push(worldEvent);
		}
		// 下一個玩家
		background.currentPlayerId = (background.currentPlayerId + 1) % 4;
		updateGameInfo();
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
			energyBefore: people.energy,
			energyAfter: people.energy - Std.int(negoCost.peopleCost.energy),
			armyBefore: Std.int(player.army),
			armyAfter: Std.int(player.army + negoCost.playerCost.army),
			moneyBefore: Std.int(player.money),
			moneyAfter: Std.int(player.money + negoCost.playerCost.money),
			foodBefore: Std.int(player.food),
			foodAfter: Std.int(player.food + negoCost.playerCost.food),
			maintainFoodBefore: 10,
			maintainFoodAfter: 10,
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
	// 雇用
	// 找武將
	// =================================
	override function getTakeHirePreview(playerId:Int, gridId:Int):HirePreview {
		return {
			p1ValidPeople: info.players[playerId].people,
			p2ValidPeople: info.grids[gridId].people
		};
	}

	override function getPreResultOfHire(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnHire {
		final player = info.players[playerId];
		final cost = getHireCost(playerId, gridId, people.id, invite.id);
		return {
			energyBefore: people.energy,
			energyAfter: people.energy - Std.int(cost.peopleCost.energy),
			moneyBefore: 0,
			moneyAfter: 0,
			successRate: cost.successRate,
			maintainMoneyAfter: 10,
			maintainMoneyBefore: 10,
		}
	}

	override function takeHire(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		final p1 = getPeopleById(p1SelectId);
		final p2 = getPeopleById(p2SelectId);
		final player = info.players[playerId];
		final evt = {
			id: EventInfoID.HIRE_RESULT,
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
		final success = applyHireCost(playerId, gridId, p1SelectId, p2SelectId);
		evt.value.success = success;
		evt.value.energyAfter = p1.energy;
		evt.value.armyAfter = player.army;
		evt.value.moneyAfter = player.money;
		evt.value.foodAfter = player.food;
		info.events = [evt];
		updateGameInfo();
		cb(info);
	}

	function getHireCost(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
		final grid = info.grids[gridId];
		final fightPeople = [p1SelectId, p2SelectId].map(getPeopleById);
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

	function applyHireCost(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int):Bool {
		final negoCost = getHireCost(playerId, gridId, p1SelectId, p2SelectId);
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
		player.money -= negoCost.playerCost.money;
		player.people.push(people2);
		// 從格子上移除人
		final grid = info.grids[gridId];
		grid.people = grid.people.filter(p -> p.id != people2.id);
		updateGameInfo();
		return true;
	}

	// =================================
	// 探索
	// ================================
	override function getTakeExplorePreview(playerId:Int, gridId:Int):ExplorePreview {
		return {
			p1ValidPeople: info.players[playerId].people
		}
	}

	override function getPreResultOfExplore(playerId:Int, gridId:Int, people:People):PreResultOnExplore {
		final cost = getExploreCost(playerId, gridId, people.id);
		return {
			energyBefore: people.energy,
			energyAfter: people.energy - Std.int(cost.peopleCost.energy),
			successRate: cost.successRate
		}
	}

	override function takeExplore(playerId:Int, gridId:Int, p1SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		final p1 = getPeopleById(p1SelectId);
		final player = info.players[playerId];
		final evt = {
			id: EventInfoID.EXPLORE_RESULT,
			value: {
				success: false,
				people: p1,
				peopleList: [],
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
		final findPeople = applyExploreCost(playerId, gridId, p1SelectId);
		evt.value.success = findPeople.length > 0;
		evt.value.peopleList = findPeople;
		evt.value.energyAfter = p1.energy;
		evt.value.armyAfter = player.army;
		evt.value.moneyAfter = player.money;
		evt.value.foodAfter = player.food;
		info.events = [evt];
		updateGameInfo();
		cb(info);
	}

	function getExploreCost(playerId:Int, gridId:Int, p1SelectId:Int) {
		final grid = info.grids[gridId];
		final p1 = getPeopleById(p1SelectId);
		final useEnergy = p1.energy / 3;
		final base = (useEnergy / 100) + 0.2;
		final charmFactor = p1.charm / 100;
		// 人脈加成
		final abiFactor = p1.abilities.has(10) ? 1.5 : 1;
		final rate = base * charmFactor * abiFactor;
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
	}

	function applyExploreCost(playerId:Int, gridId:Int, p1SelectId:Int):Array<People> {
		final negoCost = getExploreCost(playerId, gridId, p1SelectId);
		// 無論成功或失敗武將先消體力
		final people = getPeopleById(p1SelectId);
		if (people.energy < negoCost.peopleCost.energy) {
			throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
		}
		people.energy -= Std.int(negoCost.peopleCost.energy);
		//
		final success = Math.random() < negoCost.successRate;
		if (success == false) {
			return [];
		}
		final grid = info.grids[gridId];
		final newPeople = PeopleGenerator.getInst().generate();
		grid.people.push(newPeople);
		updateGameInfo();
		return [newPeople];
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
					atGridId: gridId,
					maintainArmy: 0,
					maintainPeople: 0,
					grids: []
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
				energyBefore: 0,
				energyAfter: 1,
				armyBefore: 2,
				armyAfter: 4,
				moneyBefore: 5,
				moneyAfter: 6,
				foodBefore: 7,
				foodAfter: 8,
				maintainFoodBefore: 10,
				maintainFoodAfter: 10,
			},
			{
				energyBefore: 0,
				energyAfter: 1,
				armyBefore: 2,
				armyAfter: 4,
				moneyBefore: 5,
				moneyAfter: 6,
				foodBefore: 7,
				foodAfter: 8,
				maintainFoodBefore: 10,
				maintainFoodAfter: 10,
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