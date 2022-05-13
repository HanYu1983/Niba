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
	final player = ctx.players[playerId];
	final gridId = player.position;
	final grid = ctx.grids[gridId];
	var done = false;
	for (i in 0...100) {
		if (done) {
			break;
		}
		final cmd = getMostGoodCommand(ctx, player.id);
		trace("doBrain", player.id, i, cmd);
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
				onPlayerEnd(ctx, playerId);
				// 結束回圈
				done = true;
				// 如果下一個玩家又是AI
				final nextPlayer = ctx.players[ctx.currentPlayerId];
				if (nextPlayer.brain != null) {
					doBrain(ctx, nextPlayer.id);
				}
			case MOVE:
				onPlayerDice(ctx, playerId);
				doEvent(ctx);
			case BUILD:
			case BUY_ARMY:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeResource(ctx, playerId, gridId, p1People.id, BUY, ARMY);
				doEvent(ctx);
			case BUY_FOOD:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeResource(ctx, playerId, gridId, p1People.id, BUY, FOOD);
				doEvent(ctx);
			case SELL_ARMY:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeResource(ctx, playerId, gridId, p1People.id, SELL, ARMY);
				doEvent(ctx);
			case SELL_FOOD:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeResource(ctx, playerId, gridId, p1People.id, SELL, FOOD);
				doEvent(ctx);
			case EARN_MONEY:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeResource(ctx, playerId, gridId, p1People.id, BUY, MONEY);
				doEvent(ctx);
			case CAMP:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeCostForBonus(ctx, playerId, p1People.id, 0);
				doEvent(ctx);
			case PRACTICE:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeCostForBonus(ctx, playerId, p1People.id, 1);
				doEvent(ctx);
			case PAY_FOR_FUN:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeCostForBonus(ctx, playerId, p1People.id, 2);
				doEvent(ctx);
			case EXPLORE:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeExplore(ctx, playerId, gridId, p1People.id);
				doEvent(ctx);
			// TODO: hire after explore success
			case FIRE:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				_takeFire(ctx, playerId, [p1People.id]);
				doEvent(ctx);
			case HIRE:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				if (p2GridPeople == null) {
					throw new haxe.Exception("p2GridPeople not found");
				}
				doTakeHire(ctx, playerId, gridId, p1People.id, p2GridPeople.id);
				doEvent(ctx);
			case NEGOTIATE:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				if (p2GridPeople == null) {
					throw new haxe.Exception("p2GridPeople not found");
				}
				doTakeNegoOn(ctx, playerId, gridId, p1People.id, p2GridPeople.id);
				doEvent(ctx);
			case PK:
				if (p1People == null) {
					throw new haxe.Exception("p1People not found");
				}
				if (p2GridPeople == null) {
					throw new haxe.Exception("p2GridPeople not found");
				}
				_takePk(ctx, playerId, gridId, p1People.id, p2GridPeople.id);
				doEvent(ctx);
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
				doEvent(ctx);
			case STRATEGY:
			case TRANSFER:
			case TREASURE:
			case TREASURE_TAKE:
		}
	}
}

private function doEvent(ctx:Context) {
	final events = ctx.events;
	ctx.events = [];
	for (evt in events) {
		switch evt {
			case MESSAGE_EVENT(_, _) | GRID_RESOURCE_EVENT(_, _):
				ctx.events.push(evt);
			case _:
				ctx.events.push(MESSAGE_EVENT({
					title: "ai response",
					msg: Std.string(evt).substring(0, 20),
				}, getGameInfo(ctx, false)));
		}
	}
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
