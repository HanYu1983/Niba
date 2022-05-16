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
		peopleId:Null<Int>
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
					peopleId: null
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
				onPlayerEnd(ctx, playerId);
				brainMemory.hasTransfer = false;
				// 如果下一個玩家又是AI
				final nextPlayer = ctx.players[ctx.currentPlayerId];
				if (nextPlayer.brain != null) {
					doBrain(ctx, nextPlayer.id);
				}
			case MOVE:
				onPlayerDice(ctx, playerId);
				doEvent(ctx, playerId);
			case BUILD:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				final buildingsInGrid = ctx.attachments.filter(a -> a.belongToGridId == gridId);
				if (buildingsInGrid.length > 0) {
					// 隨機建造
					final chooseId = Std.int(Math.random() * buildingsInGrid.length);
					final firstBuilding = buildingsInGrid[chooseId].type;
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
							EXPLORE(Std.int(Math.min(3, level + 1)));
					}
					_takeBuilding(ctx, playerId, gridId, p1People.id, firstBuilding, toBuilding);
					doEvent(ctx, playerId);
				}
			case BUY_ARMY:
				if (brainMemory.buySell.peopleId == null) {
					throw new haxe.Exception("brainMemory.buySell.peopleId not found");
				}
				final p1Id = brainMemory.buySell.peopleId;
				_takeResource(ctx, playerId, gridId, p1Id, BUY, ARMY);
				doEvent(ctx, playerId);
			case BUY_FOOD:
				if (brainMemory.buySell.peopleId == null) {
					throw new haxe.Exception("brainMemory.buySell.peopleId not found");
				}
				final p1Id = brainMemory.buySell.peopleId;
				_takeResource(ctx, playerId, gridId, p1Id, BUY, FOOD);
				doEvent(ctx, playerId);
			case SELL_ARMY:
				if (brainMemory.buySell.peopleId == null) {
					throw new haxe.Exception("brainMemory.buySell.peopleId not found");
				}
				final p1Id = brainMemory.buySell.peopleId;
				_takeResource(ctx, playerId, gridId, p1Id, SELL, ARMY);
				doEvent(ctx, playerId);
			case SELL_FOOD:
				if (brainMemory.buySell.peopleId == null) {
					throw new haxe.Exception("brainMemory.buySell.peopleId not found");
				}
				final p1Id = brainMemory.buySell.peopleId;
				_takeResource(ctx, playerId, gridId, p1Id, SELL, FOOD);
				doEvent(ctx, playerId);
			case EARN_MONEY:
				if (brainMemory.buySell.peopleId == null) {
					throw new haxe.Exception("brainMemory.buySell.peopleId not found");
				}
				final p1Id = brainMemory.buySell.peopleId;
				_takeResource(ctx, playerId, gridId, p1Id, BUY, MONEY);
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
				doTakeHire(ctx, playerId, gridId, brainMemory.hire.peopleId, brainMemory.hire.inviteId);
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
			case STRATEGY:
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
					doTakeHire(ctx, playerId, gridId, p1People.id, firstFindPeopleId);
					doEvent(ctx, playerId);
				}
			case WAR_RESULT(value, gameInfo):
				if (value.success) {
					final tmpPlayer = getPlayerInfo(ctx, player);
					final tmpGrid = getGridInfo(ctx, grid);
					final putArmy = Math.min(tmpPlayer.food, tmpPlayer.army) / 3;
					final putMoney = Math.min(tmpPlayer.money, putArmy);
					final putFood = Math.min(tmpPlayer.food, putArmy);
					tmpPlayer.money -= putMoney;
					tmpPlayer.food -= putFood;
					tmpPlayer.army -= putArmy;
					tmpGrid.money += putMoney;
					tmpGrid.food += putFood;
					tmpGrid.army += putArmy;
					if (tmpGrid.people.length == 0) {
						final peopleNotGrid = tmpPlayer.people.filter(p -> p.gridId == null);
						if (peopleNotGrid.length > 0) {
							final willEnterPeople = peopleNotGrid[0];
							tmpPlayer.people = tmpPlayer.people.filter(p -> p.id == willEnterPeople.id);
							tmpGrid.people = [willEnterPeople];
							_takeTransfer(ctx, playerId, gridId, tmpPlayer, tmpGrid);
							doEvent(ctx, playerId);
						} else {
							ctx.events.push(MESSAGE_EVENT({
								title: 'AI',
								msg: '${player.name}想佔領${grid.name}卻沒有空閒的人, 拿走所有物資',
							}, gameInfo));
							final tmpPlayer = getPlayerInfo(ctx, player);
							final tmpGrid = getGridInfo(ctx, grid);
							tmpPlayer.money += tmpGrid.money;
							tmpPlayer.food += tmpGrid.food;
							tmpPlayer.army += tmpGrid.army;
							tmpGrid.money = 0;
							tmpGrid.food = 0;
							tmpGrid.army = 0;
							_takeTransfer(ctx, playerId, gridId, tmpPlayer, tmpGrid);
							doEvent(ctx, playerId);
						}
					} else {
						_takeTransfer(ctx, playerId, gridId, tmpPlayer, tmpGrid);
						doEvent(ctx, playerId);
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
	if (player.brain == null) {
		throw new haxe.Exception("必須有Brain");
	}
	final brainMemory:Null<BrainMemory> = player.brain.memory;
	if (brainMemory == null) {
		throw new haxe.Exception("必須有Brain.memory");
	}
	final grid = ctx.grids[gridId];
	final peopleInGrid = ctx.peoples.filter((p:People) -> p.position.gridId == grid.id);
	final peopleInPlayer = ctx.peoples.filter((p:People) -> p.belongToPlayerId == player.id);
	return switch cmd {
		case STRATEGY:
			0.0;
		case TREASURE:
			0.0;
		case TREASURE_TAKE:
			0.0;
		case FIRE:
			final fact1 = if (player.money <= 0) {
				1.0;
			} else {
				// 維護費佔金錢的10分之1就覺得要裁員了
				final mainPeople = getMaintainPeople(ctx, playerId);
				Math.min(1.0, (mainPeople / player.money) / 0.1);
			}
			// 小於4人不裁
			// 越多人越想裁
			final fact2 = switch peopleInPlayer.length {
				case len if (len <= 4):
					-1.0;
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
					- 1.0;
				} else {
					1.0;
				}
			}
			final score = 1.0 * fact1 * fact2 * fact3;
			trace("getCommandWeight", playerId, cmd, score);
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
					final fact1 = result.successRate;
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
						final result = doGetPreResultOfHire(ctx, playerId, gridId, p1.id, p2.id);
						// 成功率
						final fact1 = result.successRate;
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
					final result = _getPreResultOfResource(ctx, playerId, gridId, p1.id, BUY, ARMY);
					trace(result);
					final earn = result.armyAfter - result.armyBefore;
					final cost = MONEY_PER_DEAL;
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
					}
				}
				maxScore;
			}
			final score = 1.0 * fact1 * fact2;
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
					final result = _getPreResultOfResource(ctx, playerId, gridId, p1.id, BUY, FOOD);
					final earn = result.foodAfter - result.foodBefore;
					final cost = MONEY_PER_DEAL;
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
					final result = _getPreResultOfResource(ctx, playerId, gridId, p1.id, SELL, ARMY);
					final earn = result.moneyAfter - result.moneyBefore;
					final cost = ARMY_PER_DEAL;
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
					final result = _getPreResultOfResource(ctx, playerId, gridId, p1.id, SELL, FOOD);
					final earn = result.moneyAfter - result.moneyBefore;
					final cost = FOOD_PER_DEAL;
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
					final result = _getPreResultOfResource(ctx, playerId, gridId, p1.id, BUY, MONEY);
					final earn = result.moneyAfter - result.moneyBefore;
					final cost = 10;
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
					}
				}
				maxScore;
			}
			final score = 0.1 * fact1;
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case TRANSFER:
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
				// 食物小於兵就要拿食物
				final foodRate = if (player.food == 0) {
					1.0;
				} else {
					1.0 - Math.min(1, player.food / player.army);
				};
				// 少於200就一定要拿錢, 越多錢就越不拿
				final moneyRate = 1.0 - Math.min(1, Math.max(0, player.money - 200) / INIT_RESOURCE);
				final score = 1.0 * armyRate * foodRate * moneyRate;
				if (score > maxScore) {
					maxScore = score;
					brainMemory.transfer.food = -Math.min(grid.food, foodRate * 1.8 * grid.food);
					brainMemory.transfer.money = -Math.min(grid.money, moneyRate * 1.8 * grid.money);
					brainMemory.transfer.army = -Math.min(grid.army, armyRate * 1.8 * grid.army);
				}
			}
			{
				final armyRate = grid.army / GRID_RESOURCE_MAX;
				final foodRate = grid.food / GRID_RESOURCE_MAX;
				final moneyRate = grid.money / GRID_RESOURCE_MAX;
				final maxRate = Math.max(armyRate, Math.max(foodRate, moneyRate));
				// 有其中一個資源超過8成再拿
				final fact1 = maxRate > 0.8 ? maxRate : 0.0;
				final score = 1.0 * fact1;
				if (score > maxScore) {
					maxScore = score;
					brainMemory.transfer.food = -Math.min(grid.food, foodRate * 400);
					brainMemory.transfer.money = -Math.min(grid.money, moneyRate * 400);
					brainMemory.transfer.army = -Math.min(grid.army, armyRate * 400);
				}
			}
			{
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
				final score = maxNeedArmyRate > 1.3 ? 999.0 : 0.0;
				if (score > maxScore) {
					maxScore = score;
					brainMemory.transfer.food = 0;
					brainMemory.transfer.money = -Math.min(grid.money, Math.max(0, grid.money - grid.army) / 2);
					brainMemory.transfer.army = Math.min(player.army, Math.max(0, grid.food - grid.army));
				}
			}
			final score = brainMemory.hasTransfer ? -1 : maxScore;
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
					case p if (p >= 0.6):
						0.1;
					case p if (p >= 0.3):
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
				var tmpMaxScore = -1.0;
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
							final fact1 = successRate;
							// 體力剩下越多越好
							final fact2 = Math.pow(energyAfter / 100.0, 0.5);
							// 拿越多越好
							final fact3 = {
								final earn = (armyAfter - armyBefore) + (moneyAfter - moneyBefore) + (foodAfter - foodBefore);
								earn / 100.0;
							}
							final score = 1.0 * fact1 * fact2 * fact3;
							if (score > tmpMaxScore) {
								tmpMaxScore = score;
								brainMemory.nego.peopleId = p1PeopleId;
							}
					}
				}
				tmpMaxScore;
			}
			final score = 1.0 * fact1;
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case PK:
			// 沒人在城裡
			if (peopleInGrid.length == 0) {
				return 0.0;
			}
			final p2PeopleId = peopleInGrid[0].id;
			final fact1 = {
				var tmpMaxScore = -1.0;
				for (p in peopleInPlayer) {
					final p1PeopleId = p.id;
					switch _getPreResultOfPk(ctx, playerId, gridId, p1PeopleId, p2PeopleId) {
						case {
							energyAfter: energyAfter,
							energyBefore: energyBefore,
							armyChange: armyChange,
							successRate: successRate
						}:
							final fact1 = successRate;
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
									final p2PlayerId = getGridBelongPlayerId(ctx, gridId);
									if (p2PlayerId == null) {
										// 對象為中立玩家就不搶, 反正也搶了也只是幫削兵
										0.0;
									} else {
										final armyCost2 = result2.armyAfter - result2.armyBefore;
										final moneyCost2 = result2.moneyAfter - result2.moneyBefore;
										final foodCost2 = result2.foodAfter - result2.foodBefore;
										final totalCost2 = moneyCost + foodCost + armyCost;
										// 敵人必須損失比我多
										Math.min(1.0, totalCost2 / totalCost);
									}
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
							final score = 1.0 * fact1 * fact2 * fact3;
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
									switch (moneyCost + foodCost) / armyCost {
										case rate if (rate >= 3):
											0.1;
										case rate if (rate >= 2):
											0.2;
										case rate if (rate >= 1):
											0.5;
										case rate if (rate >= 0.5):
											0.8;
										case _:
											1.0;
									}
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
							final fact5 = Math.pow(1 + (result2.moneyAfter / GRID_RESOURCE_MAX), 2);
							// 糧越多
							final fact6 = Math.pow(1 + (result2.foodAfter / GRID_RESOURCE_MAX), 2);
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
				tmpMaxScore;
			}
			trace("getCommandWeight", playerId, cmd, score);
			score;
		case _:
			final score = Math.random() * 0.3;
			trace("getCommandWeight", playerId, cmd, score);
			score;
	}
}
