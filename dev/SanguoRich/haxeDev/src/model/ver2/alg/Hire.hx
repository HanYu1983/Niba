package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Alg;
import model.tool.Fact;

using Lambda;

//
// 雇用計算
private function getHireCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, moreMoney:Float) {
	return switch 0 {
		case 0:
			final player = getPlayerById(ctx, playerId);
			final grid = ctx.grids[gridId];
			final fightPeople = [p1SelectId, p2SelectId].map(p -> getPeopleById(ctx, p));
			return switch fightPeople {
				case [p1, p2]:
					final p1Abilities = getPeopleAbilities(ctx, p1.id);
					final hireCost = p2.cost * PEOPLE_HIRE_COST_FACTOR * getPlayerHireCostRate(ctx, playerId);
					final hireMoneyOffset = player.money - hireCost;
					final useEnergy = p1.energy / (100 / ENERGY_COST_ON_HIRE);
					final base = getBase(useEnergy, ENERGY_COST_ON_HIRE, 0.0) * BASE_RATE_HIRE;
					final charmExt = getPlayerCharmAddByAttachment(ctx, playerId);
					// 改爲用敵人的cost為基準難度(1200大概爲最强武將了)
					final vsCharm = (p2.cost / 1200) * 80 + 20;
					final charmFactor = getFact((getPeopleCharm(ctx, p1.id) + charmExt) / vsCharm);
					// 人脈加成
					final abiFactor = getFact(p1Abilities.has(10) ? 1.5 : 1);
					// 越不夠錢減成
					// 完全付不出來的話, 這個系數為0
					final hireCostReduceRate = hireCost == 0 ? 1 : Math.min(1, getFact(player.money / hireCost));
					final moreMoneyExt = moreMoney / 500.0;
					final rate = base * getFact(charmFactor * abiFactor * hireCostReduceRate) * factOn(hireCostReduceRate, 0.51) + moreMoneyExt;
					{
						playerCost: {
							id: playerId,
							money: hireCost + moreMoney
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
		case _:
			throw new haxe.Exception("not impl");
	}
}

private function onHireCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, moreMoney:Float) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final p2 = getPeopleById(ctx, p2SelectId);
	final player = getPlayerById(ctx, playerId);
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
		gridId: gridId,
	}
	final success = {
		final negoCost = getHireCost(ctx, playerId, gridId, p1SelectId, p2SelectId, moreMoney);
		// 無論成功或失敗武將先消體力
		if (p1.energy < negoCost.peopleCost.energy) {
			throw new haxe.Exception('people.energy ${p1.energy} < ${negoCost.peopleCost.energy}');
		}
		p1.energy -= negoCost.peopleCost.energy;
		if (p1.energy < 0) {
			p1.energy = 0;
		}
		//
		final success = Math.random() < negoCost.successRate;
		if (success) {
			final hirePeople = getPeopleById(ctx, p2SelectId);
			final player = getPlayerById(ctx, playerId);
			// 支付雇用費
			player.money -= negoCost.playerCost.money;
			if (player.money < 0) {
				player.money = 0;
			}
			// 將人變成主公的
			hirePeople.belongToPlayerId = playerId;
			// 從格子上移除人
			hirePeople.position.gridId = null;
			// 功績
			onPeopleExpAdd(ctx, p1.id, getExpAdd(Math.min(1, negoCost.successRate), ENERGY_COST_ON_HIRE));
		}
		success;
	}
	resultValue.success = success;
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events.push(HIRE_RESULT(resultValue, getGameInfo(ctx, false)));
}

function doGetTakeHirePreview(ctx:Context, playerId:Int, gridId:Int):HirePreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
		p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people,
	};
}

function doGetPreResultOfHire(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, inviteId:Int, moreMoney:Float):PreResultOnHire {
	final player = getPlayerById(ctx, playerId);
	final cost = getHireCost(ctx, playerId, gridId, peopleId, inviteId, moreMoney);
	final p1 = getPeopleById(ctx, peopleId);
	final totalPeopleCost = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a) -> {
		return a + getPeopleMaintainCost(ctx, p.id);
	}, 0.0) + getPeopleMaintainCost(ctx, p1.id);
	return {
		energyBefore: Std.int(p1.energy),
		energyAfter: Std.int(p1.energy - cost.peopleCost.energy),
		moneyBefore: player.money,
		moneyAfter: player.money - cost.playerCost.money,
		successRate: cost.successRate,
		maintainMoneyAfter: getMaintainPeoplePure(totalPeopleCost),
		maintainMoneyBefore: getMaintainPeople(ctx, playerId),
	}
}

function doTakeHire(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, moreMoney:Float) {
	onHireCost(ctx, playerId, gridId, p1SelectId, p2SelectId, moreMoney);
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasCommand = true;
	}
	sortEventWhenRealPlayer(ctx);
}
