package model.ver2.alg;

import haxe.Exception;
import model.GridGenerator;
import model.IModel;
import model.Config;
import tool.Debug;
import model.tool.Fact;
import model.tool.Mock;
import model.ver2.Define;
import model.ver2.alg.Alg;
import model.ver2.alg.AlgPlayer;
import model.ver2.alg.AlgGrid;
import model.ver2.alg.AlgPeople;

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
			// 遠交近攻
			if (p1.belongToPlayerId == null) {
				throw new Exception("belongToPlayerId not found");
			}
			final player = getPlayerById(ctx, p1.belongToPlayerId);
			final grid = ctx.grids[player.position];
			final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
			// 必須有人
			if (peopleInGrid.length == 0) {
				0.0;
			} else {
				// 必須不是空地
				final isEmpty = switch getGridInfo(ctx, grid).buildtype {
					case EMPTY | CHANCE | DESTINY:
						true;
					case _:
						false;
				}
				if (isEmpty) {
					0.0;
				} else {
					// 必須不是主公的城
					final gridBelongPlayerId = getGridBelongPlayerId(ctx, grid.id);
					if (gridBelongPlayerId != null) {
						0.0;
					} else {
						1.0;
					}
				}
			}
		case 3:
			// 緩兵之計
			if (p1.belongToPlayerId == null) {
				throw new Exception("belongToPlayerId not found");
			}
			final player = getPlayerById(ctx, p1.belongToPlayerId);
			final position = targetGridId;
			final myGroundItemInGrid = ctx.groundItems.filter(item -> item.position == position && item.strategyId == strategyId
				&& item.belongToPlayerId == player.id);
			// 不能重復放置
			if (myGroundItemInGrid.length > 0) {
				0.0;
			} else {
				1.0;
			}
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
		case 12 | 14 | 18:
			// 火計 | 攻其不備 | 萬箭齊發
			if (p1.belongToPlayerId == null) {
				throw new Exception("belongToPlayerId not found");
			}
			final player = getPlayerById(ctx, p1.belongToPlayerId);
			final steps:Array<Int> = try {
				cast(strategy.value.valid : Array<Int>);
			} catch (e) {
				throw new haxe.Exception("strategy.value.valid必須是Array");
			}
			final hasEnemyGrid = [
				for (s in steps) {
					final nextPosition = ((player.position + s) + ctx.grids.length) % ctx.grids.length;
					switch getGridBelongPlayerId(ctx, nextPosition) {
						case null:
							false;
						case gridBelongPlayerId if (gridBelongPlayerId != player.id):
							true;
						case _:
							false;
					}
				}
			].has(true);
			// 範圍內必須有敵城
			if (hasEnemyGrid == false) {
				0.0;
			} else {
				switch strategyId {
					case 18:
						// 萬箭齊發
						// 需要有弓將
						p1Abilities.has(1) == false ? 0.0 : 1.0;
					case _:
						1.0;
				}
			}
		case 15:
			// 破壞
			// 需要有槍將
			if (p1Abilities.has(0) == false) {
				0.0;
			} else {
				if (p1.belongToPlayerId == null) {
					throw new Exception("belongToPlayerId not found");
				}
				final player = getPlayerById(ctx, p1.belongToPlayerId);
				final attachInGrid = ctx.attachments.filter(a -> a.belongToGridId == player.position);
				// 需有建物
				final isNoAttach = attachInGrid.length == 0;
				if (isNoAttach) {
					0.0;
				} else {
					1.0;
				}
			}
		case 16:
			// 減免貢奉金
			// 必須有人脈
			if (p1Abilities.has(10) == false) {
				0.0;
			} else {
				// 効果不能重復
				if (p1.belongToPlayerId == null) {
					throw new Exception("belongToPlayerId not found");
				}
				final effectStrategy16 = ctx.effects.filter(e -> e.belongToPlayerId == p1.belongToPlayerId).filter(e -> switch e.proto {
					case Strategy({id: 16}):
						true;
					case _:
						false;
				});
				effectStrategy16.length > 0 ? 0.0 : 1.0;
			}
		case 17:
			// 需要有騎將
			p1Abilities.has(2) == false ? 0.0 : 1.0;
		case 20:
			// 野火種
			if (p1.belongToPlayerId == null) {
				throw new Exception("belongToPlayerId not found");
			}
			final player = getPlayerById(ctx, p1.belongToPlayerId);
			final grid = ctx.grids[player.position];
			switch grid.buildtype {
				case CHANCE | DESTINY:
					// 不能放在機會命運
					0.0;
				case _:
					final position = grid.id;
					final myGroundItemInGrid = ctx.groundItems.filter(item -> item.position == position && item.strategyId == strategyId
						&& item.belongToPlayerId == player.id);
					// 不能重復放置
					if (myGroundItemInGrid.length > 0) {
						0.0;
					} else {
						1.0;
					}
			}
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
	final success = random() < cost.successRate;
	info("onStrategyCost", '${player.name}使用計策${strategy.name}${success ? "成功" : "失敗"}, 目標是[${targetPlayerId}, ${targetPeopleId}, ${targetGridId}]');
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
								final isEmpty = switch getGridInfo(ctx, grid).buildtype {
									case EMPTY | CHANCE | DESTINY:
										true;
									case _:
										false;
								}
								if (isEmpty) {
									throw new Exception("這是空地, 搶了沒資源");
								}
								player.money = Math.max(0, player.money - cost.playerCost.money);
								final gainRate = gainResourceRate;
								final gainFood = grid.food * gainRate;
								final gainMoney = grid.money * gainRate;
								final gainArmy = grid.army * gainRate;
								verbose("onStrategyCost", ["gainFood", gainFood]);
								verbose("onStrategyCost", ["gainMoney", gainMoney]);
								verbose("onStrategyCost", ["gainArmy", gainArmy]);
								grid.food -= gainFood;
								grid.money -= gainMoney;
								grid.army -= gainArmy;
								player.food += gainFood;
								player.money += gainMoney;
								player.army += gainArmy;
								verbose("onStrategyCost", ["player.food", player.food]);
								verbose("onStrategyCost", ["player.money ", player.money]);
								verbose("onStrategyCost", ["player.army", player.army]);
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
				final myGroundItemInGrid = ctx.groundItems.filter(item -> item.position == targetGridId && item.strategyId == strategyId
					&& item.belongToPlayerId == player.id);
				if (myGroundItemInGrid.length > 0) {
					throw new haxe.Exception("已經存在我的緩兵之計");
				}
				switch strategy {
					case {money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							ctx.groundItems.push({
								id: ctx.idSeq++,
								belongToPlayerId: p1.belongToPlayerId,
								position: targetGridId,
								strategyId: strategyId
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
							if (p2.belongToPlayerId != null) {
								// hate you
								final targetPlayer = getPlayerById(ctx, p2.belongToPlayerId);
								targetPlayer.hate.push(player.id);
							}
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
							wrapGridResourceEvent(ctx, myGrids, strategy.name, () -> {
								for (grid in myGrids) {
									grid.food = Math.min(getGridMaxFood(ctx, grid.id), grid.food + grid.food * gainRate);
								}
								true;
							});
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
								final gainAmount = random() * (maxAmount - minAmount) + minAmount;
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
								onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
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
								final newPeople = PeopleGenerator.getInst().generate(random() < 0.5 ? 1 : 2);
								addPeopleInfo(ctx, player.id, null, newPeople);
							}
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
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
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
						success;
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 12 | 13 | 18:
				// 火計 | 時來運轉 | 萬箭齊發
				switch strategy {
					case {value: {float: [resourceOffsetRate]}, money: _}:
						wrapResourceResultEvent(ctx, p1.belongToPlayerId, p1.id, () -> {
							p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
							final targetGrid = ctx.grids[targetGridId];
							final targetGridBelongPlayerId = getGridBelongPlayerId(ctx, targetGrid.id);
							if (success) {
								player.money = Math.max(0, player.money - cost.playerCost.money);
								wrapGridResourceEvent(ctx, [targetGrid], strategy.name, () -> {
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
										case 18:
											targetGrid.army = Math.max(0,
												Math.min(getGridMaxFood(ctx, targetGridId), targetGrid.army + targetGrid.army * resourceOffsetRate));
											if (targetGridBelongPlayerId != null) {
												// hate you
												final targetPlayer = getPlayerById(ctx, targetGridBelongPlayerId);
												targetPlayer.hate.push(player.id);
												targetPlayer.hate.push(player.id);
											}
									}
									true;
								});
								onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
							} else {
								player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
							}
							success;
						});
						success;
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
			case 14:
				// 攻其不備
				switch strategy {
					case {value: {float: [rate]}}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							wrapResourceResultEvent(ctx, p1.belongToPlayerId, p1.id, () -> {
								final gridInPlayer = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == player.id);
								for (g in gridInPlayer) {
									final getFood = g.food * rate;
									final getArmy = g.army * rate;
									final getMoney = g.money * rate;
									g.food -= getFood;
									g.army -= getArmy;
									g.money -= getMoney;
									player.food += getFood;
									player.army += getArmy;
									player.money += getMoney;
								}
								true;
							});
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
			case 15:
				// 破壞
				switch strategy {
					case {value: _, money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							final attachInGrid = ctx.attachments.filter(a -> a.belongToGridId == player.position);
							if (attachInGrid.length > 0) {
								final chooseId = Std.int(random() * attachInGrid.length);
								final chooseOne = attachInGrid[chooseId];
								// 移除0級的建物
								ctx.attachments = ctx.attachments.filter(a -> {
									if (a.id != chooseOne.id) {
										return true;
									}
									return switch a.type {
										case TREASURE(level): level > 0;
										case MARKET(level): level > 0;
										case BANK(level): level > 0;
										case FARM(level): level > 0;
										case BARN(level): level > 0;
										case BARRACKS(level): level > 0;
										case HOME(level): level > 0;
										case EXPLORE(level): level > 0;
										case WALL(level): level > 0;
										case SIEGEFACTORY(level): level > 0;
										case ACADEMY(level): level > 0;
										case FISHING(level): level > 0;
										case HUNTING(level): level > 0;
										case MINE(level): level > 0;
									}
								});
								// 若非0級, 就降級
								ctx.attachments = ctx.attachments.map(a -> {
									if (a.id != chooseOne.id) {
										return a;
									}
									a.type = switch a.type {
										case TREASURE(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											TREASURE(level - 1);
										case MARKET(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											MARKET(level - 1);
										case BANK(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											BANK(level - 1);
										case FARM(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											FARM(level - 1);
										case BARN(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											BARN(level - 1);
										case BARRACKS(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											BARRACKS(level - 1);
										case HOME(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											HOME(level - 1);
										case EXPLORE(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											EXPLORE(level - 1);
										case WALL(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											WALL(level - 1);
										case SIEGEFACTORY(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											SIEGEFACTORY(level - 1);
										case ACADEMY(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											ACADEMY(level - 1);
										case FISHING(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											FISHING(level - 1);
										case HUNTING(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											HUNTING(level - 1);
										case MINE(level):
											if (level == 0) {
												throw new haxe.Exception("這時不該為0級");
											}
											MINE(level - 1);
									}
									return a;
								});
								onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
							} else {
								warn("onStrategyCost", '沒有任何建物存在:${targetGridId}');
							}
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
				success;
			case 16:
				// 減免貢奉金
				switch strategy {
					case {value: _, money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							final effect = {
								final tmp = getDefaultEffect();
								tmp.id = ctx.idSeq++;
								tmp.proto = Strategy({id: strategy.id, fromPlayerId: player.id});
								tmp.belongToPlayerId = player.id;
								tmp.expireTurn = ctx.turn;
								tmp;
							}
							ctx.effects.push(effect);
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
				success;
			case 17:
				// 千里奔襲
				switch strategy {
					case {value: {valid: valid}, money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							final randomId = Std.int(random() * valid.length);
							final moveStep = valid[randomId];
							onPlayerDice(ctx, player.id, moveStep);
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
				success;
			case 19:
				// 強妨害
				switch strategy {
					case {value: {float: [cnt]}, money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							final myGrid = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == player.id).filter(g -> {
								// 如果沒有我的路障才要
								final myGroundItemInGrid = ctx.groundItems.filter(item -> item.position == g.id && item.strategyId == 3
									&& item.belongToPlayerId == player.id);
								return myGroundItemInGrid.length == 0;
							});
							info("onStrategyCost", '${strategy.name}找到的格子${myGrid.map(g -> g.id)}');
							myGrid.sort((a, b) -> {
								return Std.int(random() * 10) - 5;
							});
							final chooseGrid = myGrid.slice(0, Std.int(cnt));
							info("onStrategyCost", '${strategy.name}選擇隨機的前5個${chooseGrid.map(g -> g.id)}');
							for (g in chooseGrid) {
								ctx.groundItems.push({
									id: ctx.idSeq++,
									belongToPlayerId: player.id,
									position: g.id,
									strategyId: 3
								});
							}
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
				success;
			case 20:
				// 野火種
				final grid = ctx.grids[player.position];
				switch grid.buildtype {
					case CHANCE | DESTINY:
						throw new haxe.Exception("機會命運不能用野火種");
					case _:
				}
				final myGroundItemInGrid = ctx.groundItems.filter(item -> item.position == grid.id && item.strategyId == strategyId
					&& item.belongToPlayerId == player.id);
				if (myGroundItemInGrid.length > 0) {
					throw new haxe.Exception("已經存在我的野火種");
				}
				switch strategy {
					case {value: _, money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							// 放野火種
							ctx.groundItems.push({
								id: ctx.idSeq++,
								belongToPlayerId: player.id,
								position: grid.id,
								strategyId: strategyId
							});
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
				success;
			case 21:
				// 糧草徵收令
				switch strategy {
					case {value: {float: [rate]}, money: _}:
						p1.energy = Math.max(0, p1.energy - cost.peopleCost.energy);
						if (success) {
							player.money = Math.max(0, player.money - cost.playerCost.money);
							final myGrid = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == player.id);
							wrapGridResourceEvent(ctx, myGrid, strategy.name, () -> {
								for (g in myGrid) {
									final getFood = g.food * rate;
									g.food -= getFood;
									player.food += getFood;
								}
								true;
							});
							onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_STRATEGY));
						} else {
							player.money = Math.max(0, player.money - cost.playerCost.money * 0.2);
						}
					case _:
						throw new haxe.Exception('strategy value not found:${strategy}');
				}
				success;
			case _:
				throw new haxe.Exception('unknown strategyId:${strategyId}');
		}
	});
}

function _getStrategyRate(ctx:Context, p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int):PreResultOfStrategy {
	final p1 = getPeopleById(ctx, p1PeopleId);
	final cost = getStrategyCost(ctx, p1PeopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId);
	return {
		energyBefore: Std.int(p1.energy),
		energyAfter: Std.int(Math.max(0, p1.energy - cost.peopleCost.energy)),
		moneyBefore: {
			if (p1.belongToPlayerId == null) {
				warn("_getStrategyRate", "p1.belongToPlayerId == null");
				0;
			} else {
				final player = getPlayerById(ctx, p1.belongToPlayerId);
				Std.int(player.money);
			}
		},
		moneyAfter: {
			if (p1.belongToPlayerId == null) {
				warn("_getStrategyRate", "p1.belongToPlayerId == null");
				0;
			} else {
				final player = getPlayerById(ctx, p1.belongToPlayerId);
				Std.int(Math.max(0, player.money - cost.playerCost.money));
			}
		},
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

function test() {
	testStrategy15();
	testStrategy19();
}

private function testStrategy15() {
	final ctx = getDefaultContext();
	ctx.grids.push({
		final grid = getDefaultGrid();
		grid;
	});
	ctx.players.push({
		final player = getDefaultPlayer();
		player;
	});
	ctx.peoples = [
		{
			final people = getDefaultPeople();
			people.belongToPlayerId = 0;
			people.energy = 100;
			people;
		}
	];
	ctx.attachments = [
		{
			final attach = getDefaultAttachment();
			attach.belongToGridId = 0;
			attach.type = MARKET(0);
			attach;
		}
	];
	setRandomMock([-1]);
	_takeStrategy(ctx, 0, 15, 0, 0, 0);
	{
		final attachInGrid = ctx.attachments.filter(a -> a.belongToGridId == 0);
		if (attachInGrid.length != 0) {
			throw new haxe.Exception("建物必須被移除");
		}
	}
	final attach0 = {
		final attach = getDefaultAttachment();
		attach.belongToGridId = 0;
		attach.type = MARKET(1);
		attach;
	};
	ctx.attachments = [attach0];
	setRandomMock([-1]);
	_takeStrategy(ctx, 0, 15, 0, 0, 0);
	if (attach0.type.equals(MARKET(0)) == false) {
		throw new haxe.Exception("建物必須被降級");
	}
	assertRandomMockFinish();
}

private function testStrategy19() {
	final ctx:Context = getDefaultContext();
	final grid0:Grid = {
		final grid = getDefaultGrid();
		grid.buildtype = CITY;
		grid;
	}
	final grid1:Grid = {
		final grid = getDefaultGrid();
		grid.id = 1;
		grid.buildtype = CITY;
		grid;
	}
	ctx.grids = [grid0, grid1];
	final player0 = {
		final player = getDefaultPlayer();
		player;
	};
	final player1 = {
		final player = getDefaultPlayer();
		player.id = 1;
		player;
	};
	ctx.players = [player0, player1];
	final people0 = {
		final tmp = getDefaultPeople();
		tmp.belongToPlayerId = player0.id;
		tmp.position.gridId = grid0.id;
		tmp;
	}
	final people1 = {
		final tmp = getDefaultPeople();
		tmp.id = 1;
		tmp.belongToPlayerId = player0.id;
		tmp.position.gridId = grid1.id;
		tmp;
	}
	ctx.peoples = [people0, people1];
	setRandomMock([-1, 0, 0, 0, 0, 0]);
	_takeStrategy(ctx, people0.id, 19, 0, 0, 0);
	trace(ctx.groundItems);
	if (ctx.groundItems.length != 2) {
		throw new haxe.Exception("必須有2個路障");
	}
	if (ctx.groundItems[0].position != 1) {
		throw new haxe.Exception("第一個路障在格子1");
	}
	if (ctx.groundItems[1].position != 0) {
		throw new haxe.Exception("第二個路障在格子0");
	}
	trace("切換目前玩家為玩家1");
	ctx.currentPlayerId = player1.id;
	trace("玩家1走5格");
	onPlayerDice(ctx, player1.id, 5);
	if (player1.position != 1) {
		throw new haxe.Exception("玩家1必須被擋在格子1");
	}
	clearRandomMock();
	assertRandomMockFinish();
}
