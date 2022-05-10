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
		final peopleInGrid = ctx.peoples.filter((p:People) -> p.position.gridId == grid.id);
		final peopleInPlayer = ctx.peoples.filter((p:People) -> p.belongToPlayerId == player.id);
		switch cmd {
			case END:
				onPlayerEnd(ctx, playerId);
				done = true;
				// 如果下一個玩家又是AI
				final nextPlayer = ctx.players[ctx.currentPlayerId];
				if (nextPlayer.brain != null) {
					doBrain(ctx, nextPlayer.id);
				}
			case MOVE:
				onPlayerDice(ctx, playerId);
			case BUILD:
			case BUY_ARMY:
			case BUY_FOOD:
			case CAMP:
			case EARN_MONEY:
			case EXPLORE:
			case FIRE:
			case HIRE:
			case NEGOTIATE:
			case OCCUPATION:
			case PAY_FOR_FUN:
			case PK:
			case PRACTICE:
			case SELL_ARMY:
			case SELL_FOOD:
			case SNATCH:
				if (peopleInPlayer.length <= 0) {
					throw new haxe.Exception("你沒有人, 不能搶劫");
				}
				if (peopleInGrid.length <= 0) {
					throw new haxe.Exception("格子沒有人, 不能搶劫");
				}
				final p1 = peopleInPlayer[0];
				final p2 = peopleInGrid[0];
				_takeSnatchOn(ctx, playerId, gridId, p1.id, p2.id, false);
			case STRATEGY:
			case TRANSFER:
			case TREASURE:
			case TREASURE_TAKE:
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
		case END:
			1;
		case MOVE:
			1;
		case _:
			0;
	}
}
