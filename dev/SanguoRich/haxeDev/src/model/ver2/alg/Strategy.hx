package model.ver2.alg;

import haxe.Exception;
import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Alg;

using Lambda;

function getStrategyCost(ctx:Context, p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int) {
	final p1 = getPeopleById(ctx, p1PeopleId);
	final strategy = StrategyList[strategyId];
	final useEnergy = p1.energy / (100 / ENERGY_COST_ON_STRATEGY);
	// 基本值最高0.5
	final base = getBase(useEnergy, ENERGY_COST_ON_STRATEGY, 0.0) * BASE_RATE_STRATEGY;
	final fact1 = getPeopleIntelligence(ctx, p1.id) / Math.max(strategy.intelligence, 1.0);
	final fact2 = switch strategy.targetType {
		case TARGET_PEOPLE:
			final p2 = getPeopleById(ctx, targetPeopleId);
			Math.pow(getPeopleIntelligence(ctx, p1.id) / getPeopleIntelligence(ctx, p2.id), 0.20);
		case _:
			1.0;
	}
	final fact3 = switch strategyId {
		case 2:
			// 遠交近攻對空地沒有作用
			if (p1.belongToPlayerId == null) {
				throw new Exception("belongToPlayerId not found");
			}
			final player = ctx.players[p1.belongToPlayerId];
			final grid = ctx.grids[player.position];
			final isEmpty = getGridInfo(ctx, grid).buildtype == GROWTYPE.EMPTY;
			isEmpty ? 0.0 : 1;
		case 4:
			// 火中取栗
			// 對沒路障的地沒有作用
			final player = ctx.players[p1.belongToPlayerId];
			final itemWillRemoved = ctx.groundItems.filter(i -> i.position == targetGridId /* && i.belongToPlayerId != player.id*/);
			itemWillRemoved.length <= 0 ? 0.0 : 1;
		case _:
			1;
	}
	// final fact4 = switch strategy.targetType {
	// 	case TARGET_PLAYER:
	// 		//
	// 		if(p1.belongToPlayerId == targetPlayerId){
	// 			0.0;
	// 		} else {
	// 			1.0;
	// 		}
	// 	case _:
	// 		1.0;
	// }
	final rate = base * fact1 * fact2 * fact3;
	return {
		peopleCost: {
			id: p1.id,
			energy: useEnergy,
		},
		successRate: rate,
	}
}

function applyStrategyCost(ctx:Context, p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int):Bool {
	final cost = getStrategyCost(ctx, p1PeopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId);
	final p1 = getPeopleById(ctx, p1PeopleId);
	p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
	final success = Math.random() < cost.successRate;
	if (success == false) {
		return false;
	}
	// 功績
	onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
	switch strategyId {
		case 0:
			// 暗渡陳艙
			if (p1.belongToPlayerId == null) {
				throw new Exception("belongToPlayerId not found");
			}
			final player = ctx.players[p1.belongToPlayerId];
			player.position = targetGridId;
			onPlayerGoToPosition(ctx, player.id, player.position);
			{
				final player = ctx.players[player.id];
				player.memory.hasDice = true;
			}
		case 1:
			// 步步為營
			final p2 = getPeopleById(ctx, targetPeopleId);
			p2.energy = Math.min(100, p2.energy + 30);
		case 2:
			// 遠交近攻
			if (p1.belongToPlayerId == null) {
				throw new Exception('belongToPlayerId not found: ${p1.id}');
			}
			final player = ctx.players[p1.belongToPlayerId];
			final grid = ctx.grids[player.position];
			final isEmpty = getGridInfo(ctx, grid).buildtype == GROWTYPE.EMPTY;
			if (isEmpty) {
				throw new Exception("這是空地, 搶了沒資源");
			}
			final gainRate = 0.1;
			final gainFood = grid.food * gainRate;
			final gainMoney = grid.money * gainRate;
			final gainArmy = grid.army * gainRate;
			grid.food -= gainFood;
			grid.money -= gainMoney;
			grid.army -= gainArmy;
			player.food += gainFood;
			player.money += gainMoney;
			player.army += gainArmy;
			for (targetPlayerId in 0...grid.favor.length) {
				if (targetPlayerId == player.id) {
					// 對你提升友好
					grid.favor[targetPlayerId] = Std.int(Math.min(MAX_GRID_FAVOR, grid.favor[targetPlayerId] + 1));
				} else {
					// 對其它人降低友好
					grid.favor[targetPlayerId] = Std.int(Math.max(MIN_GRID_FAVOR, grid.favor[targetPlayerId] - 1));
				}
			}
		case 3:
			// 緩兵之計
			ctx.groundItems.push({
				id: getNextId(),
				belongToPlayerId: p1.belongToPlayerId,
				position: targetGridId
			});
		case 4:
			// 火中取栗
			// 將拆除指定格中非自己的路障
			final player = ctx.players[p1.belongToPlayerId];
			final itemWillRemoved = ctx.groundItems.filter(i -> i.position == targetGridId /*&& i.belongToPlayerId != player.id*/);
			for (item in itemWillRemoved) {
				// 中立路障不搶錢
				if (item.belongToPlayerId == null) {
					throw new haxe.Exception("不該有中立路障");
				}
				// 搶錢
				final targetPlayer = ctx.players[item.belongToPlayerId];
				final tax = 10;
				targetPlayer.money = Math.max(0, player.money - tax);
				player.money += tax;
			}
			// 拆除
			ctx.groundItems = ctx.groundItems.filter(i -> itemWillRemoved.map(j -> j.id).has(i.id) == false);
		case 5:
			// 趁虛而入
			final p2 = getPeopleById(ctx, targetPeopleId);
			p2.energy = Math.max(0, p2.energy - 20);
		case 6:
			// 按兵不动
			if (p1.belongToPlayerId == null) {
				throw new Exception('belongToPlayerId not found: ${p1.id}');
			}
			final player = ctx.players[p1.belongToPlayerId];
			player.memory.hasDice = true;
		case 7:
			// 急功近利
			final targetPlayer = ctx.players[targetPlayerId];
			final give = Math.min(20, targetPlayer.food);
			targetPlayer.food -= give;
			targetPlayer.money += give;
		case 8:
			// 五穀豐登
			final myGrids = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == p1.belongToPlayerId);
			for (grid in myGrids) {
				grid.food = Math.min(GRID_RESOURCE_MAX, grid.food * 0.05);
			}
	}
	return true;
}

function _getStrategyRate(ctx:Context, p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int):{
	energyBefore:Int,
	energyAfter:Int,
	rate:Float
} {
	final p1 = getPeopleById(ctx, p1PeopleId);
	final cost = getStrategyCost(ctx, p1PeopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId);
	return {
		energyAfter: Std.int(Math.max(0, p1.energy - cost.peopleCost.energy)),
		energyBefore: Std.int(p1.energy),
		rate: cost.successRate
	}
}

function _takeStrategy(ctx:Context, p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int):Void {
	ctx.events = [];
	final p1 = getPeopleById(ctx, p1PeopleId);
	if (p1.belongToPlayerId == null) {
		throw new Exception("belongToPlayerId not found");
	}
	final player = ctx.players[p1.belongToPlayerId];
	final playerOriginPosition = player.position;
	final strategy = StrategyList[strategyId];
	final strategyResultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		strategy: strategy,
		energyBefore: p1.energy,
		energyAfter: 0.0,
	}
	final success = applyStrategyCost(ctx, p1PeopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId);
	strategyResultValue.success = success;
	strategyResultValue.people = getPeopleInfo(ctx, p1);
	strategyResultValue.energyAfter = p1.energy;
	ctx.events.push(Event.STRATEGY_RESULT(strategyResultValue));
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasStrategy = true;
	}
}
