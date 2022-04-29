package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;

using Lambda;

// =================================
// 經商：加不定錢
// 買糧：扣固定錢加不定糧食
// 賣糧：扣固定糧加不定錢
// 徵兵：扣固定錢加不定兵
// 裁兵：扣固定兵加不定錢
// 2022/4/26 希望演算法可以把當前格子的資源量納入計算，資源越多，可以得到越多
// 2022/4/26 這個交易的資源也是會影響格子裏的資源量。就是經過交易后變少或變多
// =================================
// 經商買賣計算
// money:    ability 4
// food:     ability 5
// army:     ability 11
// strategy: ability 3
// 智力、政治、魅力也會影響最終數值
function getResourceCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, market:MARKET, type:RESOURCE) {
	trace("MondelVer2", "getResourceCost", market, type);
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final p1 = getPeopleById(ctx, p1SelectId);
			final useEnergy = p1.energy / (100 / ENERGY_COST_ON_RESOURCE);
			final base = getBase(useEnergy, ENERGY_COST_ON_RESOURCE, 1.0);
			final abiFactor:Float = if (type == RESOURCE.MONEY && (p1.abilities.has(4))) {
				1.5;
			} else if (type == RESOURCE.ARMY && (p1.abilities.has(11))) {
				1.5;
			} else if (type == RESOURCE.FOOD && (p1.abilities.has(5))) {
				1.5;
			} else {
				1;
			};

			final top = 60;
			final attrFactor:Float = if (type == RESOURCE.MONEY) {
				(p1.political / top) * .7 + (p1.intelligence / top) * .1 + (p1.charm / top) * .1 + (grid.money / 300) * .1;
			} else if (type == RESOURCE.ARMY) {
				(p1.political / top) * .1 + (p1.intelligence / top) * .1 + (p1.charm / top) * .7 + (grid.army / 300) * .1;
			} else if (type == RESOURCE.FOOD) {
				(p1.political / top) * .1 + (p1.intelligence / top) * .7 + (p1.charm / top) * .1 + (grid.food / 300) * .1;
			} else {
				0;
			};
			final rate = base * attrFactor * abiFactor;
			final returnInfo = {
				playerCost: {
					id: playerId,
					money: 0.0,
					army: 0.0,
					food: 0.0,
					strategy: 0.0,
				},
				peopleCost: {
					id: p1.id,
					energy: useEnergy,
				}
			};

			// 依據友好度來決定自己願意給出多少
			// -3 ~ 3
			var limitFactor:Float = grid.favor[playerId];
			// 0 ~ 6
			limitFactor += 3;
			// 0 ~ 1
			limitFactor /= 6;
			// 0.2 ~ 0.7
			limitFactor *= .5 + .2;

			switch [type, market] {
				case [MONEY, _]:
					final moneyCost = MONEY_PER_DEAL;
					final totalGain = moneyCost * rate * .5;
					limitFactor *= .5;
					final gain = Math.min(totalGain, grid.money * limitFactor);
					returnInfo.playerCost.money = -gain;
				case [ARMY, SELL]:
					final sellArmyCount = ARMY_PER_DEAL;
					final totalgain = sellArmyCount * rate;
					final gain = Math.min(totalgain, grid.money * limitFactor);
					returnInfo.playerCost.money = -gain;
					returnInfo.playerCost.army = sellArmyCount * gain / totalgain; // 依據少拿的部分返還錢
				case [FOOD, SELL]:
					final sellFoodCount = FOOD_PER_DEAL;
					final totalgain = sellFoodCount * rate;
					final gain = Math.min(totalgain, grid.money * limitFactor);
					returnInfo.playerCost.money = -gain;
					returnInfo.playerCost.food = sellFoodCount * gain / totalgain; // 依據少拿的部分返還錢
				case [ARMY, BUY]:
					final moneyCost = MONEY_PER_DEAL;
					final totalGain = moneyCost * rate;
					final gain = Math.min(totalGain, grid.army * limitFactor);
					returnInfo.playerCost.money = moneyCost * gain / totalGain; // 依據少拿的部分返還錢
					returnInfo.playerCost.army = -gain;
				case [FOOD, BUY]:
					final moneyCost = MONEY_PER_DEAL;
					final totalGain = moneyCost * rate;
					final gain = Math.min(totalGain, grid.food * limitFactor);
					returnInfo.playerCost.money = moneyCost * gain / totalGain; // 依據少拿的部分返還錢
					returnInfo.playerCost.food = -gain;
				case _:
					throw new haxe.Exception('not support: ${type} ${market}');
			}
			return returnInfo;
		case _:
			throw new haxe.Exception("not impl");
	}
}

function _getTakeResourcePreview(ctx:Context, playerId:Int, gridId:Int, market:MARKET, type:RESOURCE):ResourcePreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people
	};
}

function _getPreResultOfResource(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, market:MARKET, type:RESOURCE):PreResultOnResource {
	final player = ctx.players[playerId];
	final cost = getResourceCost(ctx, playerId, gridId, peopleId, market, type);
	final p1 = getPeopleById(ctx, peopleId);
	return {
		energyBefore: Std.int(p1.energy),
		energyAfter: Std.int(p1.energy - cost.peopleCost.energy),
		armyBefore: Std.int(player.army),
		armyAfter: Std.int(player.army - cost.playerCost.army),
		moneyBefore: Std.int(player.money),
		moneyAfter: Std.int(player.money - cost.playerCost.money),
		foodBefore: Std.int(player.food),
		foodAfter: Std.int(player.food - cost.playerCost.food),
		maintainFoodBefore: 0,
		maintainFoodAfter: 0,
	}
}

function _takeResource(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, market:MARKET, type:RESOURCE) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	applyResourceCost(ctx, playerId, gridId, p1SelectId, market, type);
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.RESOURCE_RESULT(resultValue)];
}

function applyResourceCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, market:MARKET, type:RESOURCE) {
	final negoCost = getResourceCost(ctx, playerId, gridId, p1SelectId, market, type);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	people.energy -= negoCost.peopleCost.energy;
	if (people.energy < 0) {
		people.energy = 0;
	}
	// 增加資源
	final player = ctx.players[playerId];
	player.money -= negoCost.playerCost.money;
	if (player.money < 0) {
		player.money = 0;
	}
	player.food -= negoCost.playerCost.food;
	if (player.food < 0) {
		player.food = 0;
	}
	player.army -= negoCost.playerCost.army;
	if (player.army < 0) {
		player.army = 0;
	}
	player.strategy -= negoCost.playerCost.strategy;
	if (player.strategy < 0) {
		player.strategy = 0;
	}
	// 減去資源
	final grid = ctx.grids[gridId];
	grid.money += negoCost.playerCost.money;
	if (grid.money < 0) {
		grid.money = 0;
	}
	grid.food += negoCost.playerCost.food;
	if (grid.food < 0) {
		grid.food = 0;
	}
	grid.army += negoCost.playerCost.army;
	if (grid.army < 0) {
		grid.army = 0;
	}
}