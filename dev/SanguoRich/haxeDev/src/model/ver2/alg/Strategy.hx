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
	final p1Abilities = getPeopleAbilities(ctx, p1.id);
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
	final fact3 = getFact(switch strategyId {
		case 2:
			// 遠交近攻對空地沒有作用
			if (p1.belongToPlayerId == null) {
				throw new Exception("belongToPlayerId not found");
			}
			final player = getPlayerById(ctx, p1.belongToPlayerId);
			final grid = ctx.grids[player.position];
			final isEmpty = getGridInfo(ctx, grid).buildtype == GROWTYPE.EMPTY;
			isEmpty ? 0.0 : 1;
		case 4:
			// 火中取栗
			// 對沒路障的地沒有作用
			final player = getPlayerById(ctx, p1.belongToPlayerId);
			final itemWillRemoved = ctx.groundItems.filter(i -> i.position == targetGridId /* && i.belongToPlayerId != player.id*/);
			itemWillRemoved.length <= 0 ? 0.0 : 1;
		case 10:
			// 三顧茅廬
			// 需要有人脈
			p1Abilities.has(10) == false ? 0.0 : 1.0;
		case 11:
			// 草船借箭
			// 需要有鑒別
			p1Abilities.has(12) == false ? 0.0 : 1.0;
		case _:
			1;
	});
	final rate = base * getFact(fact1 * fact2) * factOn(fact3, 1);
	return {
		playerCost: {
			money: strategy.money
		},
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
	final player = getPlayerById(ctx, p1.belongToPlayerId);
	final strategy = StrategyList[strategyId];
	final cost = getStrategyCost(ctx, p1PeopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId);
	final success = Math.random() < cost.successRate;
	wrapStrategyEvent(ctx, player.id, p1.id, strategyId, () -> {
		return switch strategyId {
			case 0:
				// 暗渡陳艙
				switch strategy {
					case {money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							onPlayerGoToPosition(ctx, player.id, targetGridId);
							player.memory.hasDice = true;
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
						success;
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 1:
				// 步步為營
				switch strategy {
					case {value: {float: [gainEnergy]}, money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							final p2 = getPeopleById(ctx, targetPeopleId);
							p2.energy = Math.min(100, p2.energy + gainEnergy);
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
						success;
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 2:
				// 遠交近攻
				switch strategy {
					case {value: {float: [gainResourceRate, gainFavor]}, money: _}:
						wrapResourceResultEvent(ctx, p1.belongToPlayerId, p1.id, () -> {
							p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
							if (success) {
								final grid = ctx.grids[player.position];
								final isEmpty = getGridInfo(ctx, grid).buildtype == GROWTYPE.EMPTY;
								if (isEmpty) {
									throw new Exception("這是空地, 搶了沒資源");
								}
								player.money = Math.max(0, player.money - cost.playerCost.money);
								final gainRate = gainResourceRate;
								final gainFood = grid.food * gainRate;
								final gainMoney = grid.money * gainRate;
								final gainArmy = grid.army * gainRate;
								trace("gainFood", gainFood);
								trace("gainMoney", gainMoney);
								trace("gainArmy", gainArmy);
								grid.food -= gainFood;
								grid.money -= gainMoney;
								grid.army -= gainArmy;
								player.food += gainFood;
								player.money += gainMoney;
								player.army += gainArmy;
								trace("player.food", player.food);
								trace("player.money ", player.money);
								trace("player.army", player.army);
								for (targetPlayerId in 0...grid.favor.length) {
									if (targetPlayerId == player.id) {
										// 對你提升友好
										grid.favor[targetPlayerId] = Std.int(Math.min(MAX_GRID_FAVOR, grid.favor[targetPlayerId] + Std.int(gainFavor)));
									} else {
										// 對其它人降低友好
										grid.favor[targetPlayerId] = Std.int(Math.max(MIN_GRID_FAVOR, grid.favor[targetPlayerId] - 1));
									}
								}
								onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
							} else {
								player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
							}
							success;
						});
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 3:
				// 緩兵之計
				switch strategy {
					case {money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							ctx.groundItems.push({
								id: getNextId(),
								belongToPlayerId: p1.belongToPlayerId,
								position: targetGridId
							});
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
						success;
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 4:
				// 火中取栗
				switch strategy {
					case {value: {float: [getMoney]}, money: _}:
						wrapResourceResultEvent(ctx, p1.belongToPlayerId, p1.id, () -> {
							p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
							if (success) {
								player.money = Math.max(0, player.money - cost.playerCost.money);
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
										final tax = getMoney;
										targetPlayer.money = Math.max(0, targetPlayer.money - tax);
										player.money += tax;
									}
									// 拆除
									ctx.groundItems = ctx.groundItems.filter(i -> i.id != item.id);
									// hate you
									final targetPlayer = getPlayerById(ctx, item.belongToPlayerId);
									targetPlayer.hate.push(player.id);
								}
								onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
							} else {
								player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
							}
							success;
						});
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 5:
				// 趁虛而入
				switch strategy {
					case {value: {float: [moneyOffset]}, money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							final p2 = getPeopleById(ctx, targetPeopleId);
							p2.energy = Math.max(0, p2.energy + moneyOffset);
							// hate you
							final targetPlayer = getPlayerById(ctx, p2.belongToPlayerId);
							targetPlayer.hate.push(player.id);
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
						success;
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 6:
				// 按兵不动
				switch strategy {
					case {money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							onPlayerGoToPosition(ctx, player.id, player.position);
							player.memory.hasDice = true;
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
						success;
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 7:
				// 急功近利
				switch strategy {
					case {value: {float: [foodOffset, moneyOffset]}, money: _}:
						wrapResourceResultEvent(ctx, targetPlayerId, p1.id, () -> {
							p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
							if (success) {
								player.money = Math.max(0, player.money - cost.playerCost.money);
								final targetPlayer = ctx.players[targetPlayerId];
								targetPlayer.food = Math.max(0, targetPlayer.food + foodOffset);
								targetPlayer.money = Math.max(0, targetPlayer.money + moneyOffset);
								// hate you
								targetPlayer.hate.push(player.id);
								onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
							} else {
								player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
							}
							success;
						});
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 8:
				// 五穀豐登
				switch strategy {
					case {value: {float: [gainRate]}, money: _}:
						player.money = Math.max(0, player.money - cost.playerCost.money);
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							final myGrids = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == p1.belongToPlayerId);
							for (grid in myGrids) {
								grid.food = Math.min(getGridMaxFood(ctx, grid.id), grid.food + grid.food * gainRate);
							}
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
						}
						success;
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 9:
				// 無中生有
				switch strategy {
					case {value: {float: [minAmount, maxAmount]}, money: _}:
						wrapResourceResultEvent(ctx, player.id, p1.id, () -> {
							p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
							if (success) {
								player.money = Math.max(0, player.money - cost.playerCost.money);
								final gainAmount = Math.random() * (maxAmount - minAmount) + minAmount;
								switch Math.min(player.money, Math.min(player.food, player.army)) {
									case which if (which == player.food):
										player.food += gainAmount;
									case which if (which == player.army):
										player.army += gainAmount;
									case which if (which == player.money):
										player.money += gainAmount;
									case _:
										throw new haxe.Exception("Math.min(player.food, player.army) not found");
								}
							} else {
								player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
							}
							success;
						});
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 10:
				// 三顧茅廬
				switch strategy {
					case {value: {float: [count]}, money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							for (i in 0...Std.int(count)) {
								final newPeople = PeopleGenerator.getInst().generate(Math.random() < 0.5 ? 1 : 2);
								addPeopleInfo(ctx, player.id, null, newPeople);
							}
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
						success;
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 11:
				// 草船借箭
				switch strategy {
					case {value: {float: [count]}, money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							for (i in 0...Std.int(count)) {
								final newItem = TreasureGenerator.getInst().generator();
								addTreasureInfo(ctx, player.id, null, null, newItem);
							}
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
						success;
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 12 | 13:
				// 火計 | 時來運轉
				switch strategy {
					case {value: {float: [resourceOffsetRate]}, money: _}:
						final success = wrapResourceResultEvent(ctx, p1.belongToPlayerId, p1.id, () -> {
							p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
							final targetGrid = ctx.grids[targetGridId];
							final targetGridBelongPlayerId = getGridBelongPlayerId(ctx, targetGrid.id);
							if (success) {
								player.money = Math.max(0, player.money - cost.playerCost.money);
								switch strategy.id {
									case 12:
										targetGrid.food = Math.max(0,
											Math.min(getGridMaxFood(ctx, targetGridId), targetGrid.food + targetGrid.food * resourceOffsetRate));
										if (targetGridBelongPlayerId != null) {
											// hate you
											final targetPlayer = getPlayerById(ctx, targetGridBelongPlayerId);
											targetPlayer.hate.push(player.id);
											targetPlayer.hate.push(player.id);
										}
									case 13:
										targetGrid.money = Math.max(0,
											Math.min(getGridMaxMoney(ctx, targetGridId), targetGrid.money + targetGrid.money * resourceOffsetRate));
										targetGrid.food = Math.max(0,
											Math.min(getGridMaxFood(ctx, targetGridId), targetGrid.food + targetGrid.food * resourceOffsetRate));
										targetGrid.army = Math.max(0,
											Math.min(getGridMaxArmy(ctx, targetGridId), targetGrid.army + targetGrid.army * resourceOffsetRate));
								}
							} else {
								player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
							}
							success;
						});
						if (success) {
							ctx.events.push(GRID_RESOURCE_EVENT({
								grids: [
									{
										gridBefore: getGridInfo(ctx, ctx.grids[targetGridId]),
										gridAfter: getGridInfo(ctx, ctx.grids[targetGridId]),
									}
								],
								describtion: strategy.name
							}, getGameInfo(ctx, false)));
						}
						success;
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case _:
				throw new haxe.Exception('unknown strategyId:${strategyId}');
		}
	});
}

function _getStrategyRate(ctx:Context, p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int):PreResultOfStrategy {
	final p1 = getPeopleById(ctx, p1PeopleId);
	final player = getPlayerById(ctx, p1.belongToPlayerId);
	final cost = getStrategyCost(ctx, p1PeopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId);
	return {
		energyBefore: Std.int(p1.energy),
		energyAfter: Std.int(Math.max(0, p1.energy - cost.peopleCost.energy)),
		moneyBefore: Std.int(player.money),
		moneyAfter: Std.int(Math.max(0, player.money - cost.playerCost.money)),
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
