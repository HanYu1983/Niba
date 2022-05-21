package model.ver2.alg;

import haxe.Exception;
import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Alg;
import model.tool.Fact;

using Lambda;

private function getStrategyCost(ctx:Context, p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int) {
	final p1 = getPeopleById(ctx, p1PeopleId);
	final strategy = StrategyList[strategyId];
	final useEnergy = p1.energy / (100 / ENERGY_COST_ON_STRATEGY);
	final base = getBase(useEnergy, ENERGY_COST_ON_STRATEGY, 0.0) * BASE_RATE_STRATEGY;
	final fact1 = getFact(getPeopleIntelligence(ctx, p1.id) / Math.max(strategy.intelligence, 1.0));
	final fact2 = switch strategy.targetType {
		case TARGET_PEOPLE:
			final p2 = getPeopleById(ctx, targetPeopleId);
			factVery(getFact(getPeopleIntelligence(ctx, p1.id) / getPeopleIntelligence(ctx, p2.id)), 0.25);
		case _:
			1.0;
	};
	final zeroOne3 = switch strategyId {
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
	};
	final rate = base * getZeroOneFromFact(fact1 * fact2) * zeroOne3;
	return {
		peopleCost: {
			id: p1.id,
			energy: useEnergy,
		},
		successRate: rate,
	}
}

private function onStrategyCost(ctx:Context, p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int) {
	final p1 = getPeopleById(ctx, p1PeopleId);
	if (p1.belongToPlayerId == null) {
		throw new Exception("belongToPlayerId not found");
	}
	final player = ctx.players[p1.belongToPlayerId];
	final cost = getStrategyCost(ctx, p1PeopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId);
	final success = Math.random() < cost.successRate;
	wrapStrategyEvent(ctx, player.id, p1.id, strategyId, () -> {
		return switch strategyId {
			case 0:
				// 暗渡陳艙
				p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
				if (success) {
					onPlayerGoToPosition(ctx, player.id, targetGridId);
					player.memory.hasDice = true;
					onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
				}
				success;
			case 1:
				// 步步為營
				p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
				if (success) {
					final p2 = getPeopleById(ctx, targetPeopleId);
					p2.energy = Math.min(100, p2.energy + 30);
					onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
				}
				success;
			case 2:
				// 遠交近攻
				wrapResourceResultEvent(ctx, p1.belongToPlayerId, p1.id, () -> {
					p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
					if (success) {
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
						onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
					}
					success;
				});
			case 3:
				// 緩兵之計
				p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
				if (success) {
					ctx.groundItems.push({
						id: getNextId(),
						belongToPlayerId: p1.belongToPlayerId,
						position: targetGridId
					});
					onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
				}
				success;
			case 4:
				// 火中取栗
				wrapResourceResultEvent(ctx, p1.belongToPlayerId, p1.id, () -> {
					p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
					if (success) {
						// 格子裡將移除的路障
						final itemWillRemoved = ctx.groundItems.filter(i -> i.position == targetGridId);
						// , 當中是我的路障
						final myItem = itemWillRemoved.filter(i -> i.belongToPlayerId == player.id);
						// 如果除了我的以外有其它的路障存在就只移除其它的路障, 否則移除全部
						final isRemoveOtherButNotMe = itemWillRemoved.length - myItem.length > 0;
						for (item in itemWillRemoved) {
							// 中立路障不搶錢
							if (item.belongToPlayerId == null) {
								throw new haxe.Exception("不該有中立路障");
							}
							if (isRemoveOtherButNotMe) {
								if (item.belongToPlayerId == player.id) {
									continue;
								}
							}
							// 搶錢
							if (item.belongToPlayerId != player.id) {
								final targetPlayer = ctx.players[item.belongToPlayerId];
								final tax = 10;
								targetPlayer.money = Math.max(0, player.money - tax);
								player.money += tax;
							}
							// 拆除
							ctx.groundItems = ctx.groundItems.filter(i -> i.id != item.id);
						}

						onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
					}
					success;
				});
			case 5:
				// 趁虛而入
				p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
				if (success) {
					final p2 = getPeopleById(ctx, targetPeopleId);
					p2.energy = Math.max(0, p2.energy - 20);
					onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
				}
				success;
			case 6:
				// 按兵不动
				p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
				if (success) {
					onPlayerGoToPosition(ctx, player.id, player.position);
					player.memory.hasDice = true;
					onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
				}
				success;
			case 7:
				// 急功近利
				wrapResourceResultEvent(ctx, targetPlayerId, p1.id, () -> {
					p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
					if (success) {
						final targetPlayer = ctx.players[targetPlayerId];
						final give = Math.min(20, targetPlayer.food);
						targetPlayer.food -= give;
						targetPlayer.money += give;
						onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
					}
					success;
				});
			case 8:
				// 五穀豐登
				p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
				if (success) {
					final myGrids = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == p1.belongToPlayerId);
					for (grid in myGrids) {
						grid.food = Math.min(getGridMaxFood(ctx, grid.id), grid.food + grid.food * 0.05);
					}
					onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
				}
				success;
			case _:
				throw new haxe.Exception('unknown strategyId:${strategyId}');
		}
	});
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
	onStrategyCost(ctx, p1PeopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId);
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasStrategy = true;
	}
	sortEventWhenRealPlayer(ctx);
}
