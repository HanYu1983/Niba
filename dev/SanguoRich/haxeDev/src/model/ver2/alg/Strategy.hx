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
	final base = getBase(useEnergy, ENERGY_COST_ON_STRATEGY, 0.0);
	final fact1 = getPeopleIntelligence(ctx, p1.id) / Math.max(strategy.intelligence, 1.0);
	final fact2 = switch strategy.targetType {
		case TARGET_PEOPLE:
			final p2 = getPeopleById(ctx, targetPeopleId);
			getPeopleIntelligence(ctx, p1.id) / getPeopleIntelligence(ctx, p2.id);
		case _:
			1.0;
	}
	// 遠交近攻對空地沒有作用
	final fact3 = switch strategyId {
		case 2:
			// 遠交近攻
			if (p1.belongToPlayerId == null) {
				throw new Exception("belongToPlayerId not found");
			}
			final player = ctx.players[p1.belongToPlayerId];
			final grid = ctx.grids[player.position];
			final isEmpty = getGridInfo(ctx, grid).buildtype == GROWTYPE.EMPTY;
			trace(strategyId, isEmpty);
			isEmpty ? 0.0 : 1;
		case _:
			1;
	}
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
	p1.exp += getExpAdd(cost.successRate);
	switch strategyId {
		case 0:
			// 暗渡陳艙
			if (p1.belongToPlayerId == null) {
				throw new Exception("belongToPlayerId not found");
			}
			final player = ctx.players[p1.belongToPlayerId];
			player.position = targetGridId;
		case 1:
			// 步步為營
			final p2 = getPeopleById(ctx, targetPeopleId);
			p2.energy = Math.min(100, p2.energy + 40);
		case 2:
			// 遠交近攻
			if (p1.belongToPlayerId == null) {
				throw new Exception("belongToPlayerId not found");
			}
			final player = ctx.players[p1.belongToPlayerId];
			final grid = ctx.grids[player.position];
			final isEmpty = getGridInfo(ctx, grid).buildtype == GROWTYPE.EMPTY;
			if (isEmpty) {
				throw new Exception("這是空地, 搶了沒資源");
			}
			final gainFood = grid.food * 0.2;
			final gainMoney = grid.money * 0.2;
			grid.food -= gainFood;
			grid.money -= gainMoney;
			player.food += gainFood;
			player.money += gainMoney;
			grid.favor[player.id] = Std.int(Math.min(MAX_GRID_FAVOR, grid.favor[player.id] + 1));
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
	ctx.events = [Event.STRATEGY_RESULT(strategyResultValue)];
	final isPositionChange = player.position != playerOriginPosition;
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasStrategy = true;
		if (isPositionChange) {
			player.memory.hasDice = true;
			{
				final toGrid = ctx.grids[player.position];
				final toGridBelongPlayerId = getGridBelongPlayerId(ctx, toGrid.id);
				final isStopAtEnemyGrid = toGridBelongPlayerId != null && toGridBelongPlayerId != player.id;
				if (isStopAtEnemyGrid) {
					final eventValue = {
						armyBefore: player.army,
						armyAfter: player.army,
						moneyBefore: player.money,
						moneyAfter: player.money,
						foodBefore: player.food,
						foodAfter: player.food,
					}
					doPayTaxToGrid(ctx, player.id, toGrid.id);
					eventValue.moneyAfter = player.money;
					ctx.events.push({
						Event.PAY_FOR_OVER_ENEMY_GRID(eventValue);
					});
				}
			}
		}
	}
}
