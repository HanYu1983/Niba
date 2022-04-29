package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;

using Lambda;

//
// 雇用計算
function getHireCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final fightPeople = [p1SelectId, p2SelectId].map(p -> getPeopleById(ctx, p));
			return switch fightPeople {
				case [p1, p2]:
					final useEnergy = p1.energy / (100 / ENERGY_COST_ON_HIRE);
					final base = getBase(useEnergy, ENERGY_COST_ON_HIRE, -.1);
					final charmFactor = p1.charm / p2.charm;
					// 人脈加成
					final abiFactor = p1.abilities.has(10) ? 1.5 : 1;
					final rate = base * charmFactor * abiFactor;
					{
						playerCost: {
							id: playerId,
							money: p2.cost * PEOPLE_HIRE_COST_FACTOR
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

function doGetTakeHirePreview(ctx:Context, playerId:Int, gridId:Int):HirePreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
		p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people,
	};
}

function doGetPreResultOfHire(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, inviteId:Int):PreResultOnHire {
	final player = ctx.players[playerId];
	final cost = getHireCost(ctx, playerId, gridId, peopleId, inviteId);
	final p1 = getPeopleById(ctx, peopleId);
	final totalPeopleCost = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a) -> {
		return a + p.cost;
	}, 0.0) + p1.cost;
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

function doTakeHire(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final p2 = getPeopleById(ctx, p2SelectId);
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
	final success = applyHireCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	resultValue.success = success;
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.HIRE_RESULT(resultValue)];
}

function applyHireCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int):Bool {
	final negoCost = getHireCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
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
	final success = Math.random() < negoCost.successRate;
	if (success == false) {
		return false;
	}
	final hirePeople = getPeopleById(ctx, p2SelectId);
	final player = ctx.players[playerId];
	// 支付雇用費
	player.money -= negoCost.playerCost.money;
	if (player.money < 0) {
		player.money = 0;
	}
	// 將人變成主公的
	hirePeople.belongToPlayerId = playerId;
	// 將人移到玩家上
	hirePeople.position.player = true;
	// 從格子上移除人
	hirePeople.position.gridId = null;
	return true;
}
