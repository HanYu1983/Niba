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

function doBrain(ctx, playerId:Int) {
	var done = false;
	for (i in 0...100) {
		if (done) {
			break;
		}
		final cmd = getMostGoodCommand(ctx, playerId);
		trace("doBrain", playerId, i, cmd);
		final player = ctx.players[playerId];
		final gridId = player.position;
		final grid = ctx.grids[gridId];
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
		switch cmd {
			case END:
				// 結束回圈
				done = true;
				onPlayerEnd(ctx, playerId);
				// 如果下一個玩家又是AI
				final nextPlayer = ctx.players[ctx.currentPlayerId];
				if (nextPlayer.brain != null) {
					doBrain(ctx, nextPlayer.id);
				}
			case MOVE:
				onPlayerDice(ctx, playerId);
				doEvent(ctx, playerId);
			case BUILD:
			case BUY_ARMY:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeResource(ctx, playerId, gridId, p1People.id, BUY, ARMY);
				doEvent(ctx, playerId);
			case BUY_FOOD:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeResource(ctx, playerId, gridId, p1People.id, BUY, FOOD);
				doEvent(ctx, playerId);
			case SELL_ARMY:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeResource(ctx, playerId, gridId, p1People.id, SELL, ARMY);
				doEvent(ctx, playerId);
			case SELL_FOOD:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeResource(ctx, playerId, gridId, p1People.id, SELL, FOOD);
				doEvent(ctx, playerId);
			case EARN_MONEY:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeResource(ctx, playerId, gridId, p1People.id, BUY, MONEY);
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
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeExplore(ctx, playerId, gridId, p1People.id);
				doEvent(ctx, playerId);
			case FIRE:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeFire(ctx, playerId, [p1People.id]);
				doEvent(ctx, playerId);
			case HIRE:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				if (p2GridPeople == null) {
					throw new haxe.Exception("p2GridPeople not found");
				}
				doTakeHire(ctx, playerId, gridId, p1People.id, p2GridPeople.id);
				doEvent(ctx, playerId);
			case NEGOTIATE:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				if (p2GridPeople == null) {
					throw new haxe.Exception("p2GridPeople not found");
				}
				doTakeNegoOn(ctx, playerId, gridId, p1People.id, p2GridPeople.id);
				doEvent(ctx, playerId);
			case PK:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				if (p2GridPeople == null) {
					throw new haxe.Exception("p2GridPeople not found");
				}
				_takePk(ctx, playerId, gridId, p1People.id, p2GridPeople.id);
				doEvent(ctx, playerId);
			case SNATCH | OCCUPATION:
				if (peopleInPlayer.length <= 0) {
					throw new haxe.Exception("你沒有人, 不能搶劫");
				}
				if (peopleInGrid.length <= 0) {
					throw new haxe.Exception("格子沒有人, 不能搶劫");
				}
				final p1 = peopleInPlayer[0];
				final p2 = peopleInGrid[0];
				_takeSnatchOn(ctx, playerId, gridId, p1.id, p2.id, cmd == OCCUPATION);
				doEvent(ctx, playerId);
			case STRATEGY:
			case TRANSFER:
			case TREASURE:
			case TREASURE_TAKE:
		}
	}
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
			// case MESSAGE_EVENT(_, _) | GRID_RESOURCE_EVENT(_, _) | WORLD_EVENT(_, _) | WALK_STOP(_, _) | NEGOTIATE_RESULT(_, _) | HIRE_RESULT(_, _) |
			// 	SNATCH_RESULT(_, _) | RESOURCE_RESULT(_, _) | FIRE_RESULT(_, _) | STRATEGY_RESULT(_, _) | BUILDING_RESULT(_, _):
			// 	ctx.events.push(evt);
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
				} else {
					ctx.events.push(MESSAGE_EVENT({
						title: 'AI',
						msg: '${player.name}探索${grid.name}失敗',
					}, gameInfo));
				}
			case WAR_RESULT(value, gameInfo):
				if (value.success) {
					final tmpPlayer = getPlayerInfo(ctx, player);
					final tmpGrid = getGridInfo(ctx, grid);
					final putMoney = tmpPlayer.money / 3;
					final putFood = tmpPlayer.food / 3;
					final putArmy = tmpPlayer.army / 3;
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
							ctx.events.push(MESSAGE_EVENT({
								title: 'AI',
								msg: '${player.name}佔領${grid.name}',
							}, gameInfo));
						} else {
							ctx.events.push(MESSAGE_EVENT({
								title: 'AI',
								msg: '${player.name}想佔領${grid.name}卻沒有空閒的人',
							}, gameInfo));
						}
					} else {
						_takeTransfer(ctx, playerId, gridId, tmpPlayer, tmpGrid);
						doEvent(ctx, playerId);
						ctx.events.push(MESSAGE_EVENT({
							title: 'AI',
							msg: '${player.name}佔領${grid.name}',
						}, gameInfo));
					}
				} else {
					ctx.events.push(evt);
				}
			case _:
				ctx.events.push(evt);
		}
	}
	// js.Browser.console.log("doEvent", ctx.events);
}

private function getMostGoodCommand(ctx:Context, playerId:Int):ActionInfoID {
	final commands = getPlayerCommand(ctx, playerId);
	if (commands.length == 0) {
		throw new haxe.Exception("不該沒有指令");
	}
	final cmdWeights = commands.map(c -> {cmd: c, weight: getCommandWeight(ctx, playerId, c)});
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

private function getCommandWeight(ctx:Context, playerId:Int, cmd:ActionInfoID):Float {
	return switch cmd {
		case STRATEGY:
			0;
		case TRANSFER:
			0;
		case TREASURE:
			0;
		case TREASURE_TAKE:
			0;
		case OCCUPATION:
			1.2;
		case _:
			1;
	}
}
