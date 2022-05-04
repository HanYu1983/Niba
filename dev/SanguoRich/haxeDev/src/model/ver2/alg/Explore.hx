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
function getExploreCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int) {
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final p1 = getPeopleById(ctx, p1SelectId);
			final useEnergy = p1.energy / (100 / ENERGY_COST_ON_EXPLORE);
			final base = getBase(useEnergy, ENERGY_COST_ON_EXPLORE, 0.0) * BASE_RATE_EXPLORE;
			final charmExt = ctx.attachments.filter(a -> a.belongToGridId == gridId).fold((p, a) -> {
				return a + switch p.type {
					case EXPLORE(level):
						return [0, 5, 10, 15][level];
					case _:
						0;
				}
			}, 0);
			final charmFactor = (getPeopleCharm(ctx, p1.id) + charmExt) / 100;
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
		case _:
			throw new haxe.Exception("not impl");
	}
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
		successRate: cost.successRate
	}
}

function _takeExplore(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int) {
	ctx.events = [];
	final p1 = getPeopleById(ctx, p1SelectId);
	final player = ctx.players[playerId];
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
	}
	final newPeopleIds = applyExploreCost(ctx, playerId, gridId, p1SelectId);
	resultValue.success = newPeopleIds.length > 0;
	resultValue.peopleList = newPeopleIds.map(id -> getPeopleById(ctx, id)).map(p -> getPeopleInfo(ctx, p));
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events.push(Event.EXPLORE_RESULT(resultValue));
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasCommand = true;
	}
}

function applyExploreCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int):Array<Int> {
	final negoCost = getExploreCost(ctx, playerId, gridId, p1SelectId);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	people.energy -= negoCost.peopleCost.energy;
	if (people.energy < 0) {
		people.energy = 0;
	}
	//
	final success = random() < negoCost.successRate;
	if (success == false) {
		return [];
	}
	// 功績
	onPeopleExpAdd(ctx, people.id, getExpAdd(Math.min(1, negoCost.successRate), model.Config.ENERGY_COST_ON_EXPLORE));
	final newPeople = PeopleGenerator.getInst().generate();
	addPeopleInfo(ctx, null, gridId, newPeople);
	return [newPeople.id];
}
