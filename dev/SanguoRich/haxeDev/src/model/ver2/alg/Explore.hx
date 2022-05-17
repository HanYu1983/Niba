package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.Mock;
import model.ver2.alg.Alg;

using Lambda;

// =================================
// 探索
// ================================
// 探索計算
private function getExploreCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int) {
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final p1 = getPeopleById(ctx, p1SelectId);
			final p1Abilities = getPeopleAbilities(ctx, p1.id);
			final useEnergy = p1.energy / (100 / ENERGY_COST_ON_EXPLORE);
			final base = getBase(useEnergy, ENERGY_COST_ON_EXPLORE, 0.0) * BASE_RATE_EXPLORE;
			final charmExt = getPlayerCharmAddByAttachment(ctx, playerId);
			final charmFactor = (getPeopleCharm(ctx, p1.id) + charmExt) / 100;
			// 人脈加成
			final abiFactor = p1Abilities.has(10) ? 1.5 : 1;
			// 鑑定
			final abi2Factor = p1Abilities.has(12) ? 1.0 : 0.0;
			//
			final rate = base * charmFactor * abiFactor;
			final findTreasureRate = if (getTreasureInGrid(ctx, gridId).length > 0) {
				FIND_TREASURE_WHEN_SUCCESS_BASE_RATE * charmFactor * abiFactor * abi2Factor;
			} else {
				0.0;
			}
			return {
				playerCost: {
					id: playerId,
				},
				peopleCost: {
					id: p1.id,
					energy: useEnergy,
				},
				successRate: rate,
				findTreasureRate: findTreasureRate
			};
		case _:
			throw new haxe.Exception("not impl");
	}
}

private function onExploreCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final player = ctx.players[playerId];
	final negoCost = getExploreCost(ctx, playerId, gridId, p1SelectId);
	// 無論成功或失敗武將先消體力
	if (p1.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${p1.energy} < ${negoCost.peopleCost.energy}');
	}
	p1.energy -= negoCost.peopleCost.energy;
	if (p1.energy < 0) {
		p1.energy = 0;
	}
	//
	final isFindTreasure = random() < negoCost.findTreasureRate;
	if (isFindTreasure) {
		final treasureInGrid = getTreasureInGrid(ctx, gridId);
		if (treasureInGrid.length == 0) {
			throw new haxe.Exception("城裡必須有寶物");
		}
		final takeId = Math.floor(Math.random() * treasureInGrid.length);
		final treasure = treasureInGrid[takeId];
		onFindTreasure(ctx, playerId, [treasure]);
		return;
	}
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		peopleList: ([] : Array<model.PeopleGenerator.People>),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
		gridId: gridId,
	}
	final success = random() < negoCost.successRate;
	final newPeopleIds = if (success) {
		// 功績
		onPeopleExpAdd(ctx, p1.id, getExpAdd(Math.min(1, negoCost.successRate), model.Config.ENERGY_COST_ON_EXPLORE));
		final newPeople = PeopleGenerator.getInst().generate();
		addPeopleInfo(ctx, null, gridId, newPeople);
		[newPeople.id];
	} else {
		[];
	}
	resultValue.success = newPeopleIds.length > 0;
	resultValue.peopleList = newPeopleIds.map(id -> getPeopleById(ctx, id)).map(p -> getPeopleInfo(ctx, p));
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events.push(EXPLORE_RESULT(resultValue, getGameInfo(ctx, false)));
}

function _getTakeExplorePreview(ctx:Context, playerId:Int, gridId:Int):ExplorePreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people
	};
}

function _getPreResultOfExplore(ctx:Context, playerId:Int, gridId:Int, peopleId:Int):PreResultOnExplore {
	final cost = getExploreCost(ctx, playerId, gridId, peopleId);
	final p1 = getPeopleById(ctx, peopleId);
	return {
		energyBefore: Std.int(p1.energy),
		energyAfter: Std.int(p1.energy - cost.peopleCost.energy),
		successRate: cost.successRate,
		successRateOnTreasure: cost.findTreasureRate,
	}
}

function _takeExplore(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int) {
	onExploreCost(ctx, playerId, gridId, p1SelectId);
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasCommand = true;
	}
}
