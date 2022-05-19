package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Alg;
import model.ver2.alg.Nego;
import model.ver2.alg.Hire;
import model.ver2.alg.Explore;
import model.ver2.alg.War;
import model.ver2.alg.Resource;
import model.ver2.alg.Fire;
import model.ver2.alg.Snatch;
import model.ver2.alg.Transfer;
import model.ver2.alg.Strategy;
import model.ver2.alg.Building;
import model.ver2.alg.CostForBonus;
import model.ver2.alg.SaveLoad;
import model.ver2.alg.Pk;
import model.ver2.alg.Equip;

using Lambda;

typedef BrainMemory = {
	war:{
		peopleId:Null<Int>
	},
	transfer:{
		food:Float, money:Float, army:Float,
	},
	buySell:{
		peopleId:Null<Int>, moneyBase:Null<Float>,
	},
	explore:{
		peopleId:Null<Int>
	},
	hire:{
		peopleId:Null<Int>, inviteId:Null<Int>
	},
	fire:{
		peopleId:Null<Int>
	},
	pk:{
		peopleId:Null<Int>
	},
	nego:{
		peopleId:Null<Int>
	},
	strategy:{
		strategyId:Null<Int>, peopleId:Null<Int>, targetPeopleId:Null<Int>, targetGridId:Null<Int>, targetPlayerId:Null<Int>,
	},
	build:{
		peopleId:Null<Int>, attachmentId:Null<Int>
	},
	hasTransfer:Bool
}

function doBrain(ctx, playerId:Int) {
	trace("doBrain", "start", playerId);
	var done = false;
	for (i in 0...100) {
		if (done) {
			break;
		}
		final player = ctx.players[playerId];
		if (player.brain == null) {
			throw new haxe.Exception("必須有Brain");
		}
		if (player.brain.memory == null) {
			player.brain.memory = ({
				war: {
					peopleId: null
				},
				transfer: {
					food: 0,
					money: 0,
					army: 0,
				},
				buySell: {
					peopleId: null,
					moneyBase: null,
				},
				explore: {
					peopleId: null
				},
				hire: {
					peopleId: null,
					inviteId: null
				},
				fire: {
					peopleId: null
				},
				pk: {
					peopleId: null
				},
				nego: {
					peopleId: null
				},
				strategy: {
					strategyId: null,
					targetPeopleId: null,
					peopleId: null,
					targetGridId: null,
					targetPlayerId: null,
				},
				build: {
					peopleId: null,
					attachmentId: null,
				},
				hasTransfer: false
			} : BrainMemory);
		}
		final brainMemory:Null<BrainMemory> = player.brain.memory;
		if (brainMemory == null) {
			throw new haxe.Exception("必須有Brain.memory");
		}
		final gridId = player.position;
		final grid = ctx.grids[gridId];
		final cmd = getMostGoodCommand(ctx, player.id, grid.id);
		trace("doBrain", playerId, i, cmd);
		final peopleInGrid = ctx.peoples.filter((p:People) -> p.position.gridId == grid.id);
		final peopleInPlayer = ctx.peoples.filter((p:People) -> p.belongToPlayerId == player.id);
		final p1People:Null<People> = if (peopleInPlayer.length > 0) {
			peopleInPlayer[0];
		} else {
			null;
		}
		final p2GridPeople:Null<People> = if (peopleInGrid.length > 0) {
			peopleInGrid[0];
		} else {
			null;
		}
		final gameInfo = getGameInfo(ctx, false);
		switch cmd {
			case END:
				// 結束回圈
				done = true;
				final isContinue = onPlayerEnd(ctx, playerId);
				if (isContinue) {
					// reset memory
					brainMemory.hasTransfer = false;
					// 如果下一個玩家又是AI
					final nextPlayer = ctx.players[ctx.currentPlayerId];
					// 如果又回到自己, 代表遊戲結束了
					final isLoop = nextPlayer.id == playerId;
					if (isLoop == false && nextPlayer.brain != null) {
						doBrain(ctx, nextPlayer.id);
					}
				}
			case MOVE:
				onPlayerDice(ctx, playerId);
				doEvent(ctx, playerId);
			case BUILD:
				if (brainMemory.build.peopleId == null) {
					throw new haxe.Exception("brainMemory.build.peopleId not found");
				}
				if (brainMemory.build.attachmentId == null) {
					throw new haxe.Exception("brainMemory.build.attachmentId not found");
				}
				final findAttachment = ctx.attachments.filter(a -> a.id == brainMemory.build.attachmentId);
				if (findAttachment.length == 0) {
					throw new haxe.Exception("findAttachment not found");
				}
				final firstBuilding = findAttachment[0].type;
				final toBuilding:BUILDING = switch firstBuilding {
					case MARKET(level):
						MARKET(Std.int(Math.min(3, level + 1)));
					case FARM(level):
						FARM(Std.int(Math.min(3, level + 1)));
					case BARRACKS(level):
						BARRACKS(Std.int(Math.min(3, level + 1)));
					case WALL(level):
						WALL(Std.int(Math.min(3, level + 1)));
					case EXPLORE(level):
						EXPLORE(Std.int(Math.min(1, level + 1)));
					case BANK(level):
						BANK(Std.int(Math.min(3, level + 1)));
					case BARN(level):
						BARN(Std.int(Math.min(3, level + 1)));
				}
				_takeBuilding(ctx, playerId, gridId, brainMemory.build.peopleId, firstBuilding, toBuilding);
				doEvent(ctx, playerId);
			case BUY_ARMY:
				if (brainMemory.buySell.peopleId == null) {
					throw new haxe.Exception("brainMemory.buySell.peopleId not found");
				}
				if (brainMemory.buySell.moneyBase == null) {
					throw new haxe.Exception("brainMemory.buySell.moneyBase not found");
				}
				final p1Id = brainMemory.buySell.peopleId;
				final moneyBase = brainMemory.buySell.moneyBase;
				_takeResource(ctx, playerId, gridId, p1Id, moneyBase, BUY, ARMY);
				doEvent(ctx, playerId);
			case BUY_FOOD:
				if (brainMemory.buySell.peopleId == null) {
					throw new haxe.Exception("brainMemory.buySell.peopleId not found");
				}
				if (brainMemory.buySell.moneyBase == null) {
					throw new haxe.Exception("brainMemory.buySell.moneyBase not found");
				}
				final p1Id = brainMemory.buySell.peopleId;
				final moneyBase = brainMemory.buySell.moneyBase;
				_takeResource(ctx, playerId, gridId, p1Id, moneyBase, BUY, FOOD);
				doEvent(ctx, playerId);
			case SELL_ARMY:
				if (brainMemory.buySell.peopleId == null) {
					throw new haxe.Exception("brainMemory.buySell.peopleId not found");
				}
				if (brainMemory.buySell.moneyBase == null) {
					throw new haxe.Exception("brainMemory.buySell.moneyBase not found");
				}
				final p1Id = brainMemory.buySell.peopleId;
				final moneyBase = brainMemory.buySell.moneyBase;
				_takeResource(ctx, playerId, gridId, p1Id, moneyBase, SELL, ARMY);
				doEvent(ctx, playerId);
			case SELL_FOOD:
				if (brainMemory.buySell.peopleId == null) {
					throw new haxe.Exception("brainMemory.buySell.peopleId not found");
				}
				if (brainMemory.buySell.moneyBase == null) {
					throw new haxe.Exception("brainMemory.buySell.moneyBase not found");
				}
				final p1Id = brainMemory.buySell.peopleId;
				final moneyBase = brainMemory.buySell.moneyBase;
				_takeResource(ctx, playerId, gridId, p1Id, moneyBase, SELL, FOOD);
				doEvent(ctx, playerId);
			case EARN_MONEY:
				if (brainMemory.buySell.peopleId == null) {
					throw new haxe.Exception("brainMemory.buySell.peopleId not found");
				}
				if (brainMemory.buySell.moneyBase == null) {
					throw new haxe.Exception("brainMemory.buySell.moneyBase not found");
				}
				final p1Id = brainMemory.buySell.peopleId;
				final moneyBase = brainMemory.buySell.moneyBase;
				_takeResource(ctx, playerId, gridId, p1Id, moneyBase, BUY, MONEY);
				doEvent(ctx, playerId);
			case CAMP:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeCostForBonus(ctx, playerId, p1People.id, 0);
				doEvent(ctx, playerId);
			case PRACTICE:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeCostForBonus(ctx, playerId, p1People.id, 1);
				doEvent(ctx, playerId);
			case PAY_FOR_FUN:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeCostForBonus(ctx, playerId, p1People.id, 2);
				doEvent(ctx, playerId);
			case EXPLORE:
				if (brainMemory.explore.peopleId == null) {
					throw new haxe.Exception("brainMemory.explore.peopleId not found");
				}
				_takeExplore(ctx, playerId, gridId, brainMemory.explore.peopleId);
				doEvent(ctx, playerId);
			case FIRE:
				if (brainMemory.fire.peopleId == null) {
					throw new haxe.Exception("brainMemory.fire.peopleId not found");
				}
				_takeFire(ctx, playerId, [brainMemory.fire.peopleId]);
				doEvent(ctx, playerId);
			case HIRE:
				if (brainMemory.hire.peopleId == null) {
					throw new haxe.Exception("brainMemory.hire.peopleId not found");
				}
				if (brainMemory.hire.inviteId == null) {
					throw new haxe.Exception("brainMemory.hire.inviteId not found");
				}
				doTakeHire(ctx, playerId, gridId, brainMemory.hire.peopleId, brainMemory.hire.inviteId, 0);
				doEvent(ctx, playerId);
			case NEGOTIATE:
				if (brainMemory.nego.peopleId == null) {
					throw new haxe.Exception("brainMemory.nego.peopleId not found");
				}
				if (p2GridPeople == null) {
					throw new haxe.Exception("p2GridPeople not found");
				}
				doTakeNegoOn(ctx, playerId, gridId, brainMemory.nego.peopleId, p2GridPeople.id);
				doEvent(ctx, playerId);
			case PK:
				if (brainMemory.pk.peopleId == null) {
					throw new haxe.Exception("brainMemory.pk.peopleId not found");
				}
				if (p2GridPeople == null) {
					throw new haxe.Exception("p2GridPeople not found");
				}
				_takePk(ctx, playerId, gridId, brainMemory.pk.peopleId, p2GridPeople.id);
				doEvent(ctx, playerId);
			case SNATCH | OCCUPATION:
				if (brainMemory.war.peopleId == null) {
					throw new haxe.Exception("player.memory.war.peopleId not found, 不能搶劫");
				}
				if (peopleInGrid.length <= 0) {
					throw new haxe.Exception("格子沒有人, 不能搶劫");
				}
				final p1Id = brainMemory.war.peopleId;
				final p2 = peopleInGrid[0];
				_takeSnatchOn(ctx, playerId, gridId, p1Id, p2.id, cmd == OCCUPATION);
				doEvent(ctx, playerId);
				brainMemory.hasTransfer = true;
			case STRATEGY:
				if (brainMemory.strategy.peopleId == null) {
					throw new haxe.Exception("player.memory.strategy.peopleId not found");
				}
				if (brainMemory.strategy.strategyId == null) {
					throw new haxe.Exception("player.memory.strategy.strategyId not found");
				}
				final targetPlayerId = brainMemory.strategy.targetPlayerId != null ? brainMemory.strategy.targetPlayerId : 0;
				final targetGridId = brainMemory.strategy.targetGridId != null ? brainMemory.strategy.targetGridId : 0;
				final targetPeopleId = brainMemory.strategy.targetPeopleId != null ? brainMemory.strategy.targetPeopleId : 0;
				_takeStrategy(ctx, brainMemory.strategy.peopleId, brainMemory.strategy.strategyId, targetPlayerId, targetPeopleId, targetGridId);
				doEvent(ctx, playerId);
			case TRANSFER:
				final tmpPlayer = getPlayerInfo(ctx, player);
				final tmpGrid = getGridInfo(ctx, grid);
				// 正數是給, 負數是拿
				final putMoney = brainMemory.transfer.money;
				final putFood = brainMemory.transfer.food;
				final putArmy = brainMemory.transfer.army;
				tmpPlayer.money -= putMoney;
				tmpPlayer.food -= putFood;
				tmpPlayer.army -= putArmy;
				tmpGrid.money += putMoney;
				tmpGrid.food += putFood;
				tmpGrid.army += putArmy;
				_takeTransfer(ctx, playerId, gridId, tmpPlayer, tmpGrid);
				doEvent(ctx, playerId);
				brainMemory.hasTransfer = true;
			case TREASURE:
				// 將未裝備的寶隨機裝備
				final myUnEquipTreasures = ctx.treasures.filter(t -> t.belongToPlayerId == player.id).filter(t -> t.position.peopleId == null);
				for (t in myUnEquipTreasures) {
					final choosePeopleId = Std.int(Math.random() * peopleInPlayer.length);
					final choosePeople = peopleInPlayer[choosePeopleId];
					t.position.peopleId = choosePeople.id;
				}
			case TREASURE_TAKE:
		}
	}
	trace("doBrain", "finished", playerId);
}

private function doEvent(ctx:Context, playerId:Int) {
	final events = ctx.events;
	ctx.events = [];
	for (evt in events) {
		final player = ctx.players[playerId];
		final gridId = player.position;
		final grid = ctx.grids[gridId];
		final peopleInPlayer = ctx.peoples.filter((p:People) -> p.belongToPlayerId == player.id);
		final p1People:Null<People> = if (peopleInPlayer.length > 0) {
			peopleInPlayer[0];
		} else {
			null;
		}
		switch evt {
			case PEOPLE_LEVEL_UP_EVENT(_, _):
			// do nothing
			case EXPLORE_RESULT(value, gameInfo):
				if (value.success) {
					if (value.peopleList.length == 0) {
						throw new haxe.Exception("找到人但是peopleList沒有值");
					}
					if (p1People == null) {
						throw new haxe.Exception("p1People not found");
					}
					final firstFindPeopleId = value.peopleList[0].id;
					doTakeHire(ctx, playerId, gridId, p1People.id, firstFindPeopleId, 0);
					doEvent(ctx, playerId);
				}
			case WAR_RESULT(value, gameInfo):
				if (value.success) {
					final tmpPlayer = getPlayerInfo(ctx, player);
					final tmpGrid = getGridInfo(ctx, grid);
					// 先清空
					tmpPlayer.money += tmpGrid.money;
					tmpPlayer.food += tmpGrid.food;
					tmpPlayer.army += tmpGrid.army;
					tmpGrid.money = 0;
					tmpGrid.food = 0;
					tmpGrid.army = 0;
					final putArmy = Math.min(getGridMaxArmy(ctx, gridId) * 0.65, Math.max(200, tmpPlayer.army / 3));
					if (tmpPlayer.army < putArmy) {
						ctx.events.push(MESSAGE_EVENT({
							title: 'AI',
							msg: '${player.name}想佔領${grid.name}卻沒有足夠兵源, 拿走所有物資',
						}, gameInfo));
						// 收回攻城的人
						tmpPlayer.people = tmpPlayer.people.concat(tmpGrid.people);
						tmpGrid.people = [];
						_takeTransfer(ctx, playerId, gridId, tmpPlayer, tmpGrid);
						doEvent(ctx, playerId);
					} else {
						if (tmpGrid.people.length == 0) {
							final peopleNotGrid = tmpPlayer.people.filter(p -> p.gridId == null);
							if (peopleNotGrid.length > 0) {
								final willEnterPeople = peopleNotGrid[0];
								tmpPlayer.people = tmpPlayer.people.filter(p -> p.id == willEnterPeople.id);
								tmpGrid.people = [willEnterPeople];
								final putMoney = Math.min(tmpPlayer.money, putArmy) * 0.8;
								final putFood = Math.min(tmpPlayer.food, putArmy) * 0.8;
								tmpPlayer.money -= putMoney;
								tmpPlayer.food -= putFood;
								tmpPlayer.army -= putArmy;
								tmpGrid.money += putMoney;
								tmpGrid.food += putFood;
								tmpGrid.army += putArmy;
								_takeTransfer(ctx, playerId, gridId, tmpPlayer, tmpGrid);
								doEvent(ctx, playerId);
							} else {
								ctx.events.push(MESSAGE_EVENT({
									title: 'AI',
									msg: '${player.name}想佔領${grid.name}卻沒有空閒的人, 拿走所有物資',
								}, gameInfo));
								_takeTransfer(ctx, playerId, gridId, tmpPlayer, tmpGrid);
								doEvent(ctx, playerId);
							}
						} else {
							final putMoney = Math.min(tmpPlayer.money, putArmy) * 0.8;
							final putFood = Math.min(tmpPlayer.food, putArmy) * 0.8;
							tmpPlayer.money -= putMoney;
							tmpPlayer.food -= putFood;
							tmpPlayer.army -= putArmy;
							tmpGrid.money += putMoney;
							tmpGrid.food += putFood;
							tmpGrid.army += putArmy;
							_takeTransfer(ctx, playerId, gridId, tmpPlayer, tmpGrid);
							doEvent(ctx, playerId);
						}
					}
				} else {
					ctx.events.push(getAnimationEventFromEvent(evt));
				}
			case _:
				ctx.events.push(getAnimationEventFromEvent(evt));
		}
	}
	// js.Browser.console.log("doEvent", ctx.events);
}

private function getMostGoodCommand(ctx:Context, playerId:Int, gridId:Int):ActionInfoID {
	final commands = getPlayerCommand(ctx, playerId);
	if (commands.length == 0) {
		throw new haxe.Exception("不該沒有指令");
	}
	final cmdWeights = commands.map(c -> {cmd: c, weight: getCommandWeight(ctx, playerId, gridId, c)});
	cmdWeights.sort((a, b) -> {
		return switch [a, b] {
			case [{weight: w1}, {weight: w2}]:
				Std.int(w2 * 100) - Std.int(w1 * 100);
			case _:
				throw new haxe.Exception("cmdWeight error");
		}
	});
	final chooseOne = cmdWeights[0].cmd;
	return chooseOne;
}

private function getCommandWeight(ctx:Context, playerId:Int, gridId:Int, cmd:ActionInfoID):Float {
	final player = ctx.players[playerId];
	if (player == null) {
		throw new haxe.Exception('player not found:${playerId}');
	}
	if (player.brain == null) {
		throw new haxe.Exception("必須有Brain");
	}
	final brainMemory:Null<BrainMemory> = player.brain.memory;
	if (brainMemory == null) {
		throw new haxe.Exception("必須有Brain.memory");
	}
	final grid = ctx.grids[gridId];
	if (grid == null) {
		throw new haxe.Exception("grid not found");
	}
	final peopleInGrid = ctx.peoples.filter((p:People) -> p.position.gridId == grid.id);
	final peopleInPlayer = ctx.peoples.filter((p:People) -> p.belongToPlayerId == player.id);
	if (peopleInPlayer.length == 0) {
		return switch cmd {
			case END:
				1.0;
			case _:
				0.0;
		}
	}
	return switch cmd {
		case TREASURE_TAKE:
			0.0;
		case BUILD:
			final buildingsInGrid = ctx.attachments.filter(a -> a.belongToGridId == gridId);
			final score = if (buildingsInGrid.length > 0) {
				final buildingNotMax = buildingsInGrid.filter(b -> {
					return switch b.type {
						case MARKET(level) if (level < 3):
							true;
						case BANK(level) if (level < 3):
							true;
						case FARM(level) if (level < 3):
							true;
						case BARN(level) if (level < 3):
							true;
						case BARRACKS(level) if (level < 3):
							true;
						case WALL(level) if (level < 3):
							true;
						case EXPLORE(level) if (level < 1):
							true;
						case _:
							false;
					}
				});
				if (buildingNotMax.length == 0) {
					0.0;
				} else {
					var score = 0.0;
					for (i in 0...buildingNotMax.length) {
						// 隨機挑一個錢夠的, 運氣不好就買不到
						final chooseId = Std.int(Math.random() * buildingNotMax.length);
						final attachment = buildingNotMax[chooseId];
						final findBuildingCatelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, attachment.type));
						if (findBuildingCatelog.length == 0) {
							throw new haxe.Exception('findBuildingCatelog找不到:${attachment.type}');
						}
						final costMoney = findBuildingCatelog[0].money;
						if (player.money > costMoney) {
							score = 1.0;
							brainMemory.build.attachmentId = attachment.id;
							brainMemory.build.peopleId = peopleInPlayer[0].id;
						}
					}
					score;
				}
			} else {
				0.0;
			}
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case STRATEGY:
			final fact1 = {
				var maxScore = 0.0;
				for (strategy in StrategyList) {
					switch strategy.id {
						case 0:
							// 暗渡陳艙
							final steps:Array<Int> = try {
								cast(strategy.value.valid : Array<Int>);
							} catch (e) {
								throw new haxe.Exception("strategy.value.valid必須是Array");
							}
							for (s in steps) {
								final nextPosition = ((player.position + s) + ctx.grids.length) % ctx.grids.length;
								final nextGrid = ctx.grids[nextPosition];
								if (nextGrid == null) {
									throw new haxe.Exception('nextGrid not found: ${nextPosition}');
								}
								final isMyGrid = getGridBelongPlayerId(ctx, nextGrid.id) == player.id;
								final fact1 = isMyGrid ? 1.0 : 0.0;
								for (p1 in peopleInPlayer) {
									final result = _getStrategyRate(ctx, p1.id, strategy.id, 0, 0, nextGrid.id);
									// 成功率
									final fact2 = result.rate > 0.7 ? result.rate : 0.0;
									// 體力剩下越多越好
									final fact3 = Math.pow(result.energyAfter / 100.0, 0.5);
									final score = 1.0 * fact1 * fact2 * fact3;
									if (score > maxScore) {
										maxScore = score;
										brainMemory.strategy.peopleId = p1.id;
										brainMemory.strategy.strategyId = strategy.id;
										brainMemory.strategy.targetGridId = nextGrid.id;
									}
								}
							}
						case 1:
							// 步步為營
							if (peopleInPlayer.length == 0) {
								0.0;
							} else {
								final peopleEnergyIsLow = peopleInPlayer.copy();
								peopleEnergyIsLow.sort((a, b) -> Std.int(a.energy) - Std.int(b.energy));
								final firstLowPeople = peopleEnergyIsLow[0];
								final fact1 = if (firstLowPeople.energy < 40) {
									1 - ((firstLowPeople.energy - 40) / 40.0);
								} else {
									0.0;
								}
								for (p1 in peopleInPlayer) {
									final result = _getStrategyRate(ctx, p1.id, strategy.id, 0, firstLowPeople.id, 0);
									// 成功率
									final fact2 = result.rate > 0.7 ? result.rate : 0.0;
									final fact3 = result.energyAfter > 65 ? 1.0 : 0.0;
									final score = 1.0 * fact1 * fact2 * fact3;
									if (score > maxScore) {
										maxScore = score;
										brainMemory.strategy.strategyId = strategy.id;
										brainMemory.strategy.peopleId = p1.id;
										brainMemory.strategy.targetPeopleId = firstLowPeople.id;
									}
								}
							}
						case 2:
							// 遠交近攻
							// 在中立格
							final fact1 = getGridBelongPlayerId(ctx, grid.id) == null ? 1.0 : 0.0;
							// 有人在
							final fact2 = peopleInGrid.length > 0 ? 1.0 : 0.0;
							final fact3 = {
								final totalResource = grid.money + grid.food + grid.army;
								totalResource > 500 ? Math.min(1, totalResource - 500 / 1000.0) : 0.0;
							}
							for (p1 in peopleInPlayer) {
								final result = _getStrategyRate(ctx, p1.id, strategy.id, 0, 0, 0);
								// 成功率
								final fact4 = result.rate > 0.7 ? result.rate : 0.0;
								// 體力剩下越多越好
								final fact5 = Math.pow(result.energyAfter / 100.0, 0.5);
								final score = 0.7 * fact1 * fact2 * fact3 * fact4 * fact5;
								if (score > maxScore) {
									maxScore = score;
									brainMemory.strategy.strategyId = strategy.id;
									brainMemory.strategy.peopleId = p1.id;
								}
							}
						case 3:
							// 緩兵之計
							final steps:Array<Int> = try {
								cast(strategy.value.valid : Array<Int>);
							} catch (e) {
								throw new haxe.Exception("strategy.value.valid必須是Array");
							}
							for (s in steps) {
								final nextPosition = ((player.position + s) + ctx.grids.length) % ctx.grids.length;
								final nextGrid = ctx.grids[nextPosition];
								if (nextGrid == null) {
									throw new haxe.Exception('nextGrid not found: ${nextPosition}');
								}
								final isMyGrid = getGridBelongPlayerId(ctx, nextGrid.id) == player.id;
								// 是我的格子
								final fact1 = isMyGrid ? 1.0 : 0.0;
								// 沒有放路障
								final fact2 = {
									final myItems = ctx.groundItems.filter(i -> i.position == nextGrid.id && i.belongToPlayerId == player.id);
									myItems.length == 0.0 ? 1.0 : 0.0;
								}
								// 總資源數大於600
								final fact3 = {
									final totalResource = nextGrid.money + nextGrid.food + nextGrid.army;
									totalResource > 600 ? 1.0 : 0.0;
								}
								for (p1 in peopleInPlayer) {
									final result = _getStrategyRate(ctx, p1.id, strategy.id, 0, 0, nextGrid.id);
									// 成功率
									final fact4 = result.rate > 0.7 ? result.rate : 0.0;
									// 體力剩下越多越好
									final fact5 = Math.pow(result.energyAfter / 100.0, 0.5);
									final score = 0.8 * fact1 * fact2 * fact3 * fact4 * fact5;
									if (score > maxScore) {
										maxScore = score;
										brainMemory.strategy.peopleId = p1.id;
										brainMemory.strategy.strategyId = strategy.id;
										brainMemory.strategy.targetGridId = nextGrid.id;
									}
								}
							}
						case 4:
							// 火中取栗
							for (s in 1...7) {
								final nextPosition = ((player.position + s) + ctx.grids.length) % ctx.grids.length;
								final nextGrid = ctx.grids[nextPosition];
								if (nextGrid == null) {
									throw new haxe.Exception('nextGrid not found: ${nextPosition}');
								}
								// 是敵人的路障
								final fact1 = {
									final notMyItems = ctx.groundItems.filter(i -> i.position == nextGrid.id && i.belongToPlayerId != player.id);
									notMyItems.length > 0 ? 1.0 : 0.0;
								}
								// 對方兵越多
								final fact2 = if (nextGrid.army == 0) {
									0.0;
								} else {
									1 - Math.min(1, (player.army / 10) / nextGrid.army);
								}
								for (p1 in peopleInPlayer) {
									final result = _getStrategyRate(ctx, p1.id, strategy.id, 0, 0, nextGrid.id);
									// 成功率
									final fact3 = result.rate > 0.7 ? result.rate : 0.0;
									// 體力剩下越多越好
									final fact4 = Math.pow(result.energyAfter / 100.0, 0.5);
									final score = 1.5 * fact1 * fact2 * fact3 * fact4;
									// if (fact1 > 0) {
									// 	trace("火中取栗", score, "=", fact1, fact2, fact3, fact4, result);
									// }
									if (score > maxScore) {
										maxScore = score;
										brainMemory.strategy.peopleId = p1.id;
										brainMemory.strategy.strategyId = strategy.id;
										brainMemory.strategy.targetGridId = nextGrid.id;
									}
								}
							}
						case 5:
							// 趁虛而入
							// 只針對非AI玩家使用
							final peopleInRealPlayer = ctx.peoples.filter(p -> p.belongToPlayerId != null /*&& ctx.players[p.belongToPlayerId].brain == null*/);
							for (p2 in peopleInRealPlayer) {
								final fact1 = Math.pow(1 - (p2.energy / 100.0), 0.5);
								for (p1 in peopleInPlayer) {
									final result = _getStrategyRate(ctx, p1.id, strategy.id, 0, p2.id, 0);
									// 成功率
									final fact2 = result.rate > 0.7 ? result.rate : 0.0;
									// 體力剩下越多越好
									final fact3 = Math.pow(result.energyAfter / 100.0, 0.5);
									final fact4 = p2.energy > 50.0 ? 1.0 : 0.0;
									final fact5 = Math.pow(Math.random(), 0.8);
									final score = 0.7 * fact1 * fact2 * fact3 * fact4 * fact5;
									if (score > maxScore) {
										maxScore = score;
										brainMemory.strategy.peopleId = p1.id;
										brainMemory.strategy.strategyId = strategy.id;
										brainMemory.strategy.targetPeopleId = p2.id;
									}
								}
							}
						case 6:
							// 按兵不動
							// 在自己格
							final fact1 = getGridBelongPlayerId(ctx, grid.id) == player.id ? 1.0 : 0.0;
							final fact2 = {
								final totalResource = grid.money + grid.food + grid.army;
								totalResource > 200 ? Math.min(1, totalResource - 200 / 1000.0) : 0.0;
							}
							for (p1 in peopleInPlayer) {
								final result = _getStrategyRate(ctx, p1.id, strategy.id, 0, 0, 0);
								// 成功率
								final fact3 = result.rate > 0.7 ? result.rate : 0.0;
								// 體力剩下越多越好
								final fact4 = Math.pow(result.energyAfter / 100.0, 0.5);
								final score = 0.7 * fact1 * fact2 * fact3 * fact4;
								if (score > maxScore) {
									maxScore = score;
									brainMemory.strategy.strategyId = strategy.id;
									brainMemory.strategy.peopleId = p1.id;
								}
							}
						case 7:
						// 急功近利
						case 8:
							// 五穀豐登
							final fact1 = {
								final myGrid = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == player.id);
								myGrid.length > 3 ? Math.min(1, (myGrid.length - 3) / 5.0) : 0.0;
							}
							for (p1 in peopleInPlayer) {
								final result = _getStrategyRate(ctx, p1.id, strategy.id, 0, 0, 0);
								// 成功率
								final fact2 = result.rate > 0.7 ? result.rate : 0.0;
								// 體力剩下越多越好
								final fact3 = Math.pow(result.energyAfter / 100.0, 0.5);
								final score = 1.0 * fact1 * fact2 * fact3;
								if (score > maxScore) {
									maxScore = score;
									brainMemory.strategy.strategyId = strategy.id;
									brainMemory.strategy.peopleId = p1.id;
								}
							}
					}
				}
				maxScore;
			}
			final score = 1.0 * fact1;
			trace("getCommandWeight", playerId, cmd, score, brainMemory.strategy);
			score;
		case TREASURE:
			final myUnEquipTreasures = ctx.treasures.filter(t -> t.belongToPlayerId == player.id).filter(t -> t.position.peopleId == null);
			// 有未裝備的寶物
			final fact1 = myUnEquipTreasures.length == 0 ? 0.0 : 1.0;
			final score = 1.0 * fact1;
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case FIRE:
			final fact1 = if (player.money <= 0) {
				1.0;
			} else {
				// 維護費佔金錢的10分之1就覺得要裁員了
				final mainPeople = getMaintainPeople(ctx, playerId);
				if (mainPeople > (player.money * 0.1)) {
					0.8;
				} else {
					0.0;
				}
			}
			// 小於4人不裁
			// 越多人越想裁
			final fact2 = switch peopleInPlayer.length {
				case len if (len <= 4):
					0.0;
				case len:
					Math.pow(Math.min(1, len - 4 / 10.0), 0.5);
			}
			// 要裁誰
			final fact3 = {
				var maxScore = 0.0;
				for (p1 in peopleInPlayer) {
					// 佔城的不能解雇
					if (p1.position.gridId != null) {
						continue;
					}
					final score = 10000 - p1.exp;
					if (score > maxScore) {
						maxScore = score;
						brainMemory.fire.peopleId = p1.id;
					}
				}
				if (maxScore == 0) {
					// 無人可裁
					0.0;
				} else {
					1.0;
				}
			}
			// 先不裁，權重不好計算
			final score = 0.0 * fact1 * fact2 * fact3;
			trace("getCommandWeight", playerId, cmd, "score:", score, "=", fact1, fact2, fact3);
			score;
		case EXPLORE:
			// 小於5人時想拿人, 越多人越不想拿
			final fact1 = switch peopleInPlayer.length {
				case len if (len < 5):
					1.0;
				case len:
					1.0 - Math.min(1, (len - 5) / 10.0);
			}
			// 機率越大
			final fact2 = {
				var maxScore = 0.0;
				for (p1 in peopleInPlayer) {
					final result = _getPreResultOfExplore(ctx, playerId, gridId, p1.id);
					// 成功率
					final fact1 = result.successRate > 0.7 ? result.successRate : 0.0;
					// 找寶率0.3就很高了
					final fact2 = 1 + result.successRateOnTreasure * 0.2;
					// 體力剩下越多越好
					final fact3 = Math.pow(result.energyAfter / 100.0, 0.5);
					final score = 1.0 * fact1 * fact2 * fact3;
					if (score > maxScore) {
						maxScore = score;
						brainMemory.explore.peopleId = p1.id;
					}
				}
				maxScore;
			}
			final score = 1.0 * fact1 * fact2;
			trace("getCommandWeight", playerId, cmd, score, "=", fact1, fact2);
			score;
		case HIRE:
			// 小於3人時想拿人, 越多人越不想拿
			// 超過10人就不拿
			final fact1 = switch peopleInPlayer.length {
				case len if (len <= 5):
					1.0;
				case len:
					1.0 - Math.min(1, len - 5 / 10.0);
			}
			// 機率越大
			final fact2 = {
				var maxScore = 0.0;
				for (p1 in peopleInPlayer) {
					for (p2 in peopleInGrid) {
						final result = doGetPreResultOfHire(ctx, playerId, gridId, p1.id, p2.id, 0);
						// 成功率
						final fact1 = result.successRate > 0.7 ? result.successRate : 0.0;
						// 體力剩下越多越好
						final fact2 = Math.pow(result.energyAfter / 100.0, 0.5);
						final score = 1.0 * fact1 * fact2;
						if (score > maxScore) {
							maxScore = score;
							brainMemory.hire.peopleId = p1.id;
							brainMemory.hire.inviteId = p2.id;
						}
					}
				}
				maxScore;
			}
			final score = 1.0 * fact1 * fact2;
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case BUY_ARMY:
			// 錢佔比越大
			final fact1 = if (player.money <= MONEY_PER_DEAL) {
				0.0;
			} else {
				1.0 - Math.min(1, (player.army / (player.money - MONEY_PER_DEAL)));
			}
			// 利益越大
			final fact2 = {
				var maxScore = 0.0;
				for (p1 in peopleInPlayer) {
					// 利益越大越好
					final moneyBase = 100;
					final result = _getPreResultOfResource(ctx, playerId, gridId, p1.id, moneyBase, BUY, ARMY);
					final earn = result.armyAfter - result.armyBefore;
					final cost = moneyBase;
					final fact1 = if (earn <= 0) {
						0.0;
					} else {
						1.0 - Math.min(1, (cost / (earn * 5)));
					}
					// 體力剩下越多越好
					final fact2 = Math.pow(result.energyAfter / 100.0, 0.5);
					final score = 1.0 * fact1 * fact2;
					if (score > maxScore) {
						maxScore = score;
						brainMemory.buySell.peopleId = p1.id;
						brainMemory.buySell.moneyBase = moneyBase;
					}
				}
				maxScore;
			}
			final score = 2.0 * fact1 * fact2;
			trace("getCommandWeight", playerId, cmd, "score:", score, "=", fact1, fact2);
			score;
		case BUY_FOOD:
			// 食少錢多
			final fact1 = if (player.money <= MONEY_PER_DEAL) {
				0.0;
			} else {
				1.0 - Math.min(1, (player.food / (player.money - MONEY_PER_DEAL)));
			}
			// 利益越大
			final fact2 = {
				var maxScore = 0.0;
				for (p1 in peopleInPlayer) {
					// 利益越大越好
					final moneyBase = 100;
					final result = _getPreResultOfResource(ctx, playerId, gridId, p1.id, moneyBase, BUY, FOOD);
					final earn = result.foodAfter - result.foodBefore;
					final cost = moneyBase;
					final fact1 = if (earn <= 0) {
						0.0;
					} else {
						1.0 - Math.min(1, (cost / (earn * 5)));
					}
					// 體力剩下越多越好
					final fact2 = Math.pow(result.energyAfter / 100.0, 0.5);
					final score = 1.0 * fact1 * fact2;
					if (score > maxScore) {
						maxScore = score;
						brainMemory.buySell.peopleId = p1.id;
						brainMemory.buySell.moneyBase = moneyBase;
					}
				}
				maxScore;
			}
			final score = 1.0 * fact1 * fact2;
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case SELL_ARMY:
			final fact1 = if (player.army <= ARMY_PER_DEAL) {
				0.0;
			} else {
				1.0 - Math.min(1, (player.money / (player.army - ARMY_PER_DEAL)));
			}
			// 利益越大
			final fact2 = {
				var maxScore = 0.0;
				for (p1 in peopleInPlayer) {
					// 利益越大越好
					final moneyBase = 100;
					final result = _getPreResultOfResource(ctx, playerId, gridId, p1.id, moneyBase, SELL, ARMY);
					final earn = result.moneyAfter - result.moneyBefore;
					final cost = moneyBase;
					final fact1 = if (earn <= 0) {
						0.0;
					} else {
						1.0 - Math.min(1, (cost / (earn * 5)));
					}
					// 體力剩下越多越好
					final fact2 = Math.pow(result.energyAfter / 100.0, 0.5);
					final score = 1.0 * fact1 * fact2;
					if (score > maxScore) {
						maxScore = score;
						brainMemory.buySell.peopleId = p1.id;
						brainMemory.buySell.moneyBase = moneyBase;
					}
				}
				maxScore;
			}
			final score = 1.0 * fact1 * fact2;
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case SELL_FOOD:
			final fact1 = if (player.food <= FOOD_PER_DEAL) {
				0.0;
			} else {
				1.0 - Math.min(1, (player.money / (player.food - FOOD_PER_DEAL)));
			}
			// 利益越大
			final fact2 = {
				var maxScore = 0.0;
				for (p1 in peopleInPlayer) {
					// 利益越大越好
					final moneyBase = 100;
					final result = _getPreResultOfResource(ctx, playerId, gridId, p1.id, moneyBase, SELL, FOOD);
					final earn = result.moneyAfter - result.moneyBefore;
					final cost = moneyBase;
					final fact1 = if (earn <= 0) {
						0.0;
					} else {
						1.0 - Math.min(1, (cost / (earn * 5)));
					}
					// 體力剩下越多越好
					final fact2 = Math.pow(result.energyAfter / 100.0, 0.5);
					final score = 1.0 * fact1 * fact2;
					if (score > maxScore) {
						maxScore = score;
						brainMemory.buySell.peopleId = p1.id;
						brainMemory.buySell.moneyBase = moneyBase;
					}
				}
				maxScore;
			}
			final score = 1.0 * fact1 * fact2;
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case EARN_MONEY:
			final fact1 = {
				var maxScore = 0.0;
				for (p1 in peopleInPlayer) {
					final moneyBase = 100;
					final result = _getPreResultOfResource(ctx, playerId, gridId, p1.id, moneyBase, BUY, MONEY);
					final earn = result.moneyAfter - result.moneyBefore;
					final cost = moneyBase;
					final fact1 = if (earn <= 0) {
						0.0;
					} else {
						1.0 - Math.min(1, (cost / (earn * 5)));
					}
					// 體力剩下越多越好
					final fact1 = Math.pow(result.energyAfter / 100.0, 0.5);
					final score = 1.0 * fact1;
					if (score > maxScore) {
						maxScore = score;
						brainMemory.buySell.peopleId = p1.id;
						brainMemory.buySell.moneyBase = moneyBase;
					}
				}
				maxScore;
			}
			final score = 0.1 * fact1;
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case TRANSFER:
			final score = getTransferWeightV2(ctx, playerId, gridId);
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case PRACTICE:
			if (peopleInPlayer.length == 0) {
				0.0;
			} else {
				final totalEnergy = peopleInPlayer.fold((p, a) -> {
					return a + p.energy;
				}, 0.0);
				final score = switch totalEnergy / (peopleInPlayer.length * 100) {
					case p if (p >= 0.8):
						0.7;
					case _:
						0.0;
				}
				trace("getCommandWeight", playerId, cmd, score);
				score;
			}
		case CAMP | PAY_FOR_FUN:
			if (peopleInPlayer.length == 0) {
				0.0;
			} else {
				final totalEnergy = peopleInPlayer.fold((p, a) -> {
					return a + p.energy;
				}, 0.0);
				final score = switch totalEnergy / (peopleInPlayer.length * 100) {
					// 有足夠的體力, 不休息
					case p if (p >= 0.4):
						0.1;
					case p if (p >= 0.2):
						0.5;
					case p:
						p;
				}
				trace("getCommandWeight", playerId, cmd, score);
				score;
			}
		case NEGOTIATE:
			// 沒人在城裡
			if (peopleInGrid.length == 0) {
				return 0.0;
			}
			final p2PeopleId = peopleInGrid[0].id;
			final fact1 = {
				var tmpMaxScore = -0.0;
				for (p in peopleInPlayer) {
					final p1PeopleId = p.id;
					switch doGetPreResultOfNego(ctx, playerId, gridId, p1PeopleId, p2PeopleId) {
						case {
							energyAfter: energyAfter,
							energyBefore: energyBefore,
							armyBefore: armyBefore,
							armyAfter: armyAfter,
							moneyBefore: moneyBefore,
							moneyAfter: moneyAfter,
							foodBefore: foodBefore,
							foodAfter: foodAfter,
							successRate: successRate
						}:
							final fact1 = successRate > 0.7 ? successRate : 0.0;
							// 體力剩下越多越好
							final fact2 = Math.pow(energyAfter / 100.0, 0.5);
							// 拿越多越好
							final fact3 = Math.min(1, {
								final earn = (armyAfter - armyBefore) + (moneyAfter - moneyBefore) + (foodAfter - foodBefore);
								(earn / 100.0) * 0.75;
							});
							final score = 1.0 * fact1 * fact2 * fact3;
							if (score > tmpMaxScore) {
								tmpMaxScore = score;
								brainMemory.nego.peopleId = p1PeopleId;
							}
					}
				}
				tmpMaxScore;
			}
			final score = 0.9 * fact1;
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case PK:
			// 沒人在城裡
			if (peopleInGrid.length == 0) {
				return 0.0;
			}
			final p2PeopleId = peopleInGrid[0].id;
			final fact1 = {
				var tmpMaxScore = 0.0;
				for (p in peopleInPlayer) {
					final p1PeopleId = p.id;
					switch _getPreResultOfPk(ctx, playerId, gridId, p1PeopleId, p2PeopleId) {
						case {
							energyAfter: energyAfter,
							energyBefore: energyBefore,
							armyChange: armyChange,
							successRate: successRate
						}:
							final fact1 = successRate > 0.7 ? successRate : 0.0;
							// 體力剩下越多越好
							final fact2 = Math.pow(energyAfter / 100.0, 0.5);
							// 拿越多越好
							final fact3 = armyChange / 100.0;
							final score = 1.0 * fact1 * fact2 * fact3;
							if (score > tmpMaxScore) {
								tmpMaxScore = score;
								brainMemory.pk.peopleId = p1PeopleId;
							}
					}
				}
				tmpMaxScore;
			}
			final score = 1.0 * fact1;
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case SNATCH:
			// 沒人在城裡
			if (peopleInGrid.length == 0) {
				return 0.0;
			}
			final p2PeopleId = peopleInGrid[0].id;
			final score = {
				var tmpMaxScore = 0.0;
				for (p in peopleInPlayer) {
					final p1PeopleId = p.id;
					switch _getPreResultOfSnatch(ctx, playerId, gridId, p1PeopleId, p2PeopleId, false) {
						case {war: [result1, result2], money: money, food: food}:
							final armyCost = result1.armyBefore - result1.armyAfter;
							final moneyCost = result1.moneyBefore - result1.moneyAfter;
							final foodCost = result1.foodBefore - result1.foodAfter;
							final totalCost = moneyCost + foodCost + armyCost;
							final totalEarn = money + food;
							// 得到比失去多, 越多越好
							// 如果沒有成本, 就搶
							final fact1 = if (totalCost <= 0) {
								1.0;
							} else {
								final tmp = totalEarn / totalCost;
								// 基本上獲利必須大於成本
								if (tmp >= 1.0) {
									1.0;
								} else {
									// final p2PlayerId = getGridBelongPlayerId(ctx, gridId);
									// if (p2PlayerId == null) {
									// 	// 對象為中立玩家就不搶, 反正也搶了也只是幫削兵
									// 	0.0;
									// } else {
									// 	final armyCost2 = result2.armyAfter - result2.armyBefore;
									// 	final moneyCost2 = result2.moneyAfter - result2.moneyBefore;
									// 	final foodCost2 = result2.foodAfter - result2.foodBefore;
									// 	final totalCost2 = moneyCost + foodCost + armyCost;
									// 	// 敵人必須損失比我多
									// 	Math.min(1.0, totalCost2 / totalCost);
									// }
									final armyCost2 = result2.armyAfter - result2.armyBefore;
									final moneyCost2 = result2.moneyAfter - result2.moneyBefore;
									final foodCost2 = result2.foodAfter - result2.foodBefore;
									final totalCost2 = moneyCost + foodCost + armyCost;
									// 敵人必須損失比我多
									Math.min(1.0, totalCost2 / totalCost);
								}
							}
							// 體力剩下越多越好
							final fact2 = Math.pow(result1.energyAfter / 100.0, 0.5);
							// 少於3個城之前不想搶劫
							final fact3 = {
								final gridCnt = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).length;
								if (gridCnt < 3) {
									0.1;
								} else {
									1.0;
								}
							}
							final score = 0.7 * fact1 * fact2 * fact3;
							if (score > tmpMaxScore) {
								tmpMaxScore = score;
								brainMemory.war.peopleId = p1PeopleId;
							}
						case _:
							throw new haxe.Exception("_getPreResultOfSnatch not found");
					}
				}
				tmpMaxScore;
			}
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case OCCUPATION:
			// 沒人在城裡, 不需攻城
			if (peopleInGrid.length == 0) {
				return 0.0;
			}
			final p2PeopleId = peopleInGrid[0].id;
			final score = {
				var tmpMaxScore = 0.0;
				for (p in peopleInPlayer) {
					final p1PeopleId = p.id;
					switch _getPreResultOfSnatch(ctx, playerId, gridId, p1PeopleId, p2PeopleId, true) {
						case {war: [result1, result2]}:
							final successOccupy = result2.armyAfter <= 0;
							// 佔領是一切
							final fact1 = successOccupy ? 1.0 : 0.0;
							// 體力剩下越多越好
							final fact2 = Math.pow(result1.energyAfter / 100.0, 0.5);
							// 成本佔死兵越少越好
							final fact3 = {
								final armyCost = result1.armyBefore - result1.armyAfter;
								if (armyCost <= 0) {
									1.0;
								} else {
									final moneyCost = result1.moneyBefore - result1.moneyAfter;
									final foodCost = result1.foodBefore - result1.foodAfter;
									final totalCost = moneyCost + foodCost + armyCost;
									final moneyEarn = result2.moneyAfter;
									final foodEarn = result2.foodAfter;
									final totalEarn = moneyEarn + foodEarn;
									((totalEarn / totalCost) * 0.8);
								}
							}
							// 3個城以下時, 食物越足夠越想打
							// 超過3個城時就不在乎身上食物
							final fact4 = {
								final gridCnt = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).length;
								if (gridCnt < 3) {
									switch result1.foodAfter / INIT_RESOURCE {
										case p if (p >= 0.8):
											1.0;
										case p if (p >= 0.5):
											0.75;
										case p if (p >= 0.3):
											0.5;
										case _:
											0.1;
									}
								} else {
									1.0;
								}
							}
							// 錢越多
							final fact5 = Math.pow(1 + (result2.moneyAfter / getGridMaxMoney(ctx, grid.id)), 2);
							// 糧越多
							final fact6 = Math.pow(1 + (result2.foodAfter / getGridMaxFood(ctx, grid.id)), 2);
							final score = 1.0 * fact1 * fact2 * fact3 * fact4 * fact5 * fact6;
							final isBestScore = score > tmpMaxScore;
							if (isBestScore) {
								tmpMaxScore = score;
								brainMemory.war.peopleId = p1PeopleId;
							}
						case _:
							throw new haxe.Exception("_getPreResultOfSnatch not found");
					}
				}
				grid.army == 0 ? 1.0 : tmpMaxScore;
			}
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case _:
			// 最少要0.1
			final score = Math.random() * 0.2 + 0.1;
			trace("getCommandWeight", playerId, cmd, score);
			score;
	}
}

private function getTransferWeightV1(ctx:Context, playerId:Int, gridId:Int):Float {
	final player = ctx.players[playerId];
	if (player == null) {
		throw new haxe.Exception('player not found:${playerId}');
	}
	if (player.brain == null) {
		throw new haxe.Exception("必須有Brain");
	}
	final brainMemory:Null<BrainMemory> = player.brain.memory;
	if (brainMemory == null) {
		throw new haxe.Exception("必須有Brain.memory");
	}
	final grid = ctx.grids[gridId];
	if (grid == null) {
		throw new haxe.Exception("grid not found");
	}
	var maxScore = 0.0;
	{
		final foodRate = if (player.food <= 0) {
			0.0;
		} else {
			1.0 - Math.min(1, grid.food / player.food);
		}
		final moneyRate = if (player.money <= 0) {
			0.0;
		} else {
			1.0 - Math.min(1, grid.money / player.money);
		}
		final armyRate = if (player.army <= 0) {
			0.0;
		} else {
			1.0 - Math.min(1, grid.army / player.army);
		}
		// 少於3個城之前不想給城
		final fact1 = {
			final gridCnt = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).length;
			if (gridCnt < 3) {
				0.0;
			} else {
				0.7;
			}
		}
		final score = 1.0 * fact1 * armyRate * foodRate * moneyRate;
		if (score > maxScore) {
			maxScore = score;
			brainMemory.transfer.food = Math.min(player.food, foodRate * 0.8 * player.food);
			brainMemory.transfer.money = Math.min(player.money, moneyRate * 0.8 * player.money);
			brainMemory.transfer.army = Math.min(player.army, armyRate * 0.8 * player.army);
		}
	}
	{
		// 少於200就一定要拿兵, 越多兵就越不拿
		final armyRate = 1.0 - Math.min(1, Math.max(0, player.army - 200) / INIT_RESOURCE);
		// 城兵比我多越多
		final gridArmyRate = grid.army / player.army;
		// 食物小於兵就要拿食物
		final foodRate = if (player.food == 0) {
			1.0;
		} else {
			1.0 - Math.min(1, player.food / player.army);
		};
		// 少於200就一定要拿錢, 越多錢就越不拿
		final moneyRate = 1.0 - Math.min(1, Math.max(0, player.money - 200) / INIT_RESOURCE);
		final score = 1.5 * Math.max(Math.max(armyRate * gridArmyRate, foodRate), moneyRate);
		if (score > maxScore) {
			maxScore = score;
			brainMemory.transfer.food = -Math.min(grid.food, Math.max(foodRate, armyRate) * grid.food);
			brainMemory.transfer.money = -Math.min(grid.money, Math.max(moneyRate, armyRate) * grid.money);
			brainMemory.transfer.army = -Math.min(grid.army, armyRate * grid.army);
		}
	}
	{
		final armyRate = grid.army / getGridMaxArmy(ctx, grid.id);
		final foodRate = grid.food / getGridMaxFood(ctx, grid.id);
		final moneyRate = grid.money / getGridMaxMoney(ctx, grid.id);
		final maxRate = Math.max(armyRate, Math.max(foodRate, moneyRate));
		// 有其中一個資源超過9成再拿
		final fact1 = maxRate > 0.8 ? maxRate : 0.0;
		final score = 1.2 * fact1;
		if (score > maxScore) {
			maxScore = score;
			brainMemory.transfer.food = -Math.min(grid.food, 0.3 * grid.food);
			brainMemory.transfer.money = -Math.min(grid.money, 0.3 * grid.money);
			brainMemory.transfer.army = -Math.min(grid.army, 0.3 * grid.army);
		}
	}
	{
		final fact1 = player.army > 200 ? 1.0 : 0.0;
		final needArmyRate = if (grid.army <= 0) {
			1.5;
		} else {
			grid.food / grid.army;
		}
		final needArmyRate2 = if (grid.army <= 0) {
			1.5;
		} else {
			grid.money / grid.army;
		}
		final maxNeedArmyRate = Math.max(needArmyRate, needArmyRate2);
		final fact2 = maxNeedArmyRate > 1.3 ? 3.0 : 0.0;
		final score = 1.0 * fact1 * fact2;
		if (score > maxScore) {
			maxScore = score;
			brainMemory.transfer.food = 0;
			brainMemory.transfer.money = -Math.min(grid.money, Math.max(0, grid.money - grid.army) / 2);
			brainMemory.transfer.army = Math.min(player.army, Math.max(0, grid.food - grid.army));
		}
	}
	final score = brainMemory.hasTransfer ? -1 : maxScore;
	return score;
}

private function getTransferWeightV2(ctx:Context, playerId:Int, gridId:Int):Float {
	final player = ctx.players[playerId];
	if (player == null) {
		throw new haxe.Exception('player not found:${playerId}');
	}
	if (player.brain == null) {
		throw new haxe.Exception("必須有Brain");
	}
	final brainMemory:Null<BrainMemory> = player.brain.memory;
	if (brainMemory == null) {
		throw new haxe.Exception("必須有Brain.memory");
	}
	if (brainMemory.hasTransfer) {
		return 0.0;
	}
	final grid = ctx.grids[gridId];
	if (grid == null) {
		throw new haxe.Exception("grid not found");
	}
	var maxScore = 0.0;
	{
		// 放在主公的成數
		final playerResourceWeight = {
			final gridTotal = grid.army /*+ grid.food + grid.money*/;
			switch gridTotal {
				case total if (total > 1600):
					1 / 1.5;
				case total if (total > 1200):
					1 / 1.75;
				case total if (total > 800):
					1 / 2.0;
				case total if (total > 400):
					1 / 2.25;
				case _:
					1 / 2.5;
			}
		}
		final midArmy = Math.min(getGridMaxArmy(ctx, grid.id) * 0.8, (grid.army + player.army) * playerResourceWeight);
		// final midFood = Math.min(getGridMaxFood(ctx, grid.id) * 0.8, (grid.food + player.food) * playerResourceWeight);
		// final midMoney = Math.min(getGridMaxMoney(ctx, grid.id) * 0.8, (grid.money + player.money) * playerResourceWeight);
		final offsetArmy = midArmy - grid.army;
		final offsetFood = midArmy - grid.food;
		final offsetMoney = midArmy - grid.money;
		brainMemory.transfer.food = offsetFood;
		brainMemory.transfer.money = offsetMoney;
		brainMemory.transfer.army = offsetArmy;
		// 先讓給蓋建物(1.0)
		maxScore = 0.9;
	}
	final score = maxScore;
	return score;
}
