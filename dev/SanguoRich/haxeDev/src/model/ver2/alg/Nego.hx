package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.ver2.Config;
import model.ver2.Define;

using Lambda;

// =================================
// 交涉
// 向城池奪取%資源
// =================================
// 稅收
// 主公會得到所有城池的成數
// =========================================
// config
// 以下的方法都不定義回傳的類型, 因為是動態設計, 做到哪想到哪
// 每一個回傳都是依靠編譯器的類型推理
// 所以可以把回傳最多欄位的放在case的第1個, 讓編譯器告訴你其它的回傳少了哪些欄位
// =========================================
// 交涉計算
// 參與能力為:7良官
function getNegoCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	// 使用switch達成策略模式
	// 0代表預設的隨意實作
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final fightPeople = [p1SelectId, p2SelectId].map(id -> getPeopleById(ctx, id));
			return switch fightPeople {
				case [p1, p2]:
					// 用掉1/5的體力(最多20)
					// 體力越少效率越低
					final useEnergy = p1.energy / (100 / ENERGY_COST_ON_NEGO);
					// 使用20體力的情況下基礎值為0.5
					final base = getBase(useEnergy, ENERGY_COST_ON_NEGO, -.15);
					final intelligenceFactor = p1.intelligence / p2.intelligence;
					final politicalFactor = p1.political / p2.political;
					final charmFactor = p1.charm / p2.charm;
					
					// 沒有良官的時候，rate最高限制在1.2
					var rate = base * intelligenceFactor * politicalFactor * charmFactor;
					rate = Math.min(rate, 1.2);

					// 良官加成，rate最高可以突破1.2
					final abiFactor = p1.abilities.has(7) ? 1.5 : 1;
					rate *= abiFactor;

					// 根據友好度決定基本%數
					final favor = grid.favor[playerId];
					final basePersent = if(favor <= -2) {
						0.02;
					} else if (favor <= -1) {
						0.05;
					} else if (favor <= 0) {
						0.1;
					} else if (favor <= 1) {
						0.15;
					} else {
						0.2;
					}

					// 商才，務農，徵兵分別可以提高獲得數量（rate些微影響獲得的數量）
					final gainRate = basePersent + rate / 50;
					{
						playerCost: {
							id: playerId,
							army: ENABLE_NEGO_ARMY ? grid.army * (gainRate + (p1.abilities.has(11) ? .05 : 0)) : 0.0,
							money: grid.money * (gainRate + (p1.abilities.has(4) ? .05 : 0)),
							food: grid.food * (gainRate + (p1.abilities.has(5) ? .05 : 0))
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
		case 1:
			// 版本1
			{
				playerCost: {
					id: 0,
					army: 0.0,
					money: 0.0,
					food: 0.0,
				},
				peopleCost: {
					id: 0,
					energy: 0.0,
				},
				successRate: 0.0,
			}
		case _:
			throw new haxe.Exception("not impl");
	}
}

function doGetTakeNegoPreview(ctx:Context, playerId:Int, gridId:Int):NegoPreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
		p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people,
	};
}

function doGetPreResultOfNego(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, inviteId:Int):PreResultOnNego {
	final player = ctx.players[playerId];
	final people = getPeopleById(ctx, peopleId);
	final negoCost = getNegoCost(ctx, playerId, gridId, peopleId, inviteId);
	final totalArmy = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).fold((p, a) -> {
		return a + p.army;
	}, 0.0) + ctx.players[playerId].army;
	return {
		energyBefore: Std.int(people.energy),
		energyAfter: Std.int(people.energy - negoCost.peopleCost.energy),
		armyBefore: Std.int(player.army),
		armyAfter: Std.int(player.army + negoCost.playerCost.army),
		moneyBefore: Std.int(player.money),
		moneyAfter: Std.int(player.money + negoCost.playerCost.money),
		foodBefore: Std.int(player.food),
		foodAfter: Std.int(player.food + negoCost.playerCost.food),
		maintainFoodBefore: getMaintainArmy(ctx, playerId),
		maintainFoodAfter: getMaintainArmyPure(totalArmy + negoCost.playerCost.army),
		successRate: negoCost.successRate
	};
}

function doTakeNegoOn(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final p2 = getPeopleById(ctx, p2SelectId);
	final player = ctx.players[playerId];
	final grid = ctx.grids[gridId];
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
		favorBefore: grid.favor[playerId],
		favorAfter: grid.favor[playerId],
	}
	final success = applyNegoCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	resultValue.success = success;
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	resultValue.favorAfter = grid.favor[playerId];
	ctx.events = [Event.NEGOTIATE_RESULT(resultValue)];
}

function applyNegoCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int):Bool {
	final negoCost = getNegoCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	final grid = ctx.grids[gridId];
	people.energy -= Std.int(negoCost.peopleCost.energy);
	//
	final success = Math.random() < negoCost.successRate;
	if (success == false) {
		// 降低友好度
		final isHateYou = Math.random() < NEGO_HATE_RATE;
		if (isHateYou) {
			grid.favor[playerId] = Std.int(Math.max(grid.favor[playerId] - 1, MIN_GRID_FAVOR));
		}
		return false;
	}
	// 城池被搶奪
	grid.army -= negoCost.playerCost.army;
	if (grid.army < 0) {
		grid.army = 0;
	}
	grid.money -= negoCost.playerCost.money;
	if (grid.money < 0) {
		grid.money = 0;
	}
	grid.food -= negoCost.playerCost.food;
	if (grid.food < 0) {
		grid.food = 0;
	}
	// 玩家搶奪
	final player = ctx.players[playerId];
	player.army += negoCost.playerCost.army;
	player.money += negoCost.playerCost.money;
	player.food += negoCost.playerCost.food;
	// 提升友好度
	final isLikeYou = Math.random() < NEGO_LIKE_RATE;
	if (isLikeYou) {
		grid.favor[playerId] = Std.int(Math.min(grid.favor[playerId] + 1, MAX_GRID_FAVOR));
	}
	return true;
}
