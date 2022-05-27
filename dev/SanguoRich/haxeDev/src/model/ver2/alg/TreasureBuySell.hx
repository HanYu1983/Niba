package model.ver2.alg;

import tool.Debug;
import model.GridGenerator;
import model.TreasureGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;

using Lambda;

function _sellTreasure(ctx:Context, playerId:Int, gridId:Int, sellId:Int) {
	final treasure = getTreasureById(ctx, sellId);
	if (treasure.belongToPlayerId != playerId) {
		throw new haxe.Exception("[_sellTreasure]treasure必須是主公的");
	}
	if (treasure.position.gridId != null) {
		throw new haxe.Exception("[_sellTreasure]treasure必須不在城裡");
	}
	final findCatelog = treasureList.filter(t -> t.id == treasure.protoId);
	if (findCatelog.length == 0) {
		throw new haxe.Exception('[_sellTreasure]findCatelog not found: ${treasure.protoId}');
	}
	final sellMoney = findCatelog[0].cost;
	final player = getPlayerById(ctx, playerId);
	final grid = ctx.grids[gridId];
	if (sellMoney >= grid.money) {
		warn("_sellTreasure", ["格子錢不夠, 無法買", grid, sellMoney]);
		return;
	}
	grid.money -= sellMoney;
	player.money += sellMoney;
	// 將寶變成中立
	treasure.belongToPlayerId = null;
	treasure.position.gridId = grid.id;
	ctx.events.push(MESSAGE_EVENT({
		title: '賣出寶物',
		msg: '${player.name}賣出${findCatelog[0].name}',
	}, getGameInfo(ctx, false)));
}

function _buyTreasure(ctx:Context, playerId:Int, gridId:Int, buyId:Int) {
	final treasure = getTreasureById(ctx, buyId);
	if (treasure.belongToPlayerId != null) {
		throw new haxe.Exception("[_buyTreasure]treasure必須是中立的");
	}
	if (treasure.position.gridId != gridId) {
		throw new haxe.Exception("[_buyTreasure]treasure必須在城裡");
	}
	final findCatelog = treasureList.filter(t -> t.id == treasure.protoId);
	if (findCatelog.length == 0) {
		throw new haxe.Exception('[_buyTreasure]findCatelog not found: ${treasure.protoId}');
	}
	final buyMoney = findCatelog[0].cost;
	final player = getPlayerById(ctx, playerId);
	final grid = ctx.grids[gridId];
	final gridBelongPlayerId = getGridBelongPlayerId(ctx, grid.id);
	if (gridBelongPlayerId == playerId) {
		verbose("_buyTreasure", ["自己的寶物所, 取得免費寶物", playerId, gridId, buyId]);
	} else {
		if (player.money < buyMoney) {
			throw new haxe.Exception("[_buyTreasure]主公不夠錢買寶");
		}
		player.money -= buyMoney;
		grid.money += buyMoney;
		final maxMoney = getGridMaxMoney(ctx, gridId);
		final moreMoney = grid.money - maxMoney;
		verbose("_buyTreasure", '計算有沒有超出格子最大限:${moreMoney}/${maxMoney}');
		if (moreMoney > 0) {
			verbose("_buyTreasure", '多出的錢${moreMoney}放不下了, 交給格子所有人');
			grid.money = getGridMaxMoney(ctx, gridId);
			if (gridBelongPlayerId == null) {
				verbose("_buyTreasure", "格子沒有所有人, 多出的錢就讓它消失");
			} else {
				final targetPlayer = getPlayerById(ctx, gridBelongPlayerId);
				targetPlayer.money += moreMoney;
				verbose("_buyTreasure", '多出的錢${moreMoney}交給格子所有人${targetPlayer.name}');
			}
		}
	}
	// 將寶拿走
	treasure.position.gridId = null;
	treasure.belongToPlayerId = playerId;
	ctx.events.push(MESSAGE_EVENT({
		title: '買寶物',
		msg: '${player.name}買入${findCatelog[0].name}',
	}, getGameInfo(ctx, false)));
}

function test() {
	testSell();
	testBuy();
}

private function testSell() {
	final ctx:Context = getDefaultContext();
	final grid0:Grid = {
		final grid = getDefaultGrid();
		trace("送給格子1000錢");
		grid.money = 1000;
		grid;
	}
	ctx.grids = [grid0];
	final player0 = {
		final player = getDefaultPlayer();
		player;
	};
	ctx.players = [player0];
	final treasure0 = {
		final tmp = getDefaultTreasure();
		tmp.belongToPlayerId = player0.id;
		tmp.position.gridId = null;
		tmp;
	}
	ctx.treasures = [treasure0];
	_sellTreasure(ctx, player0.id, grid0.id, treasure0.id);
	if (grid0.money == 1000) {
		throw new haxe.Exception("格子的錢必須減少");
	}
	if (player0.money == 0) {
		throw new haxe.Exception("主公必須得到賣的錢");
	}
	if (treasure0.belongToPlayerId != null) {
		throw new haxe.Exception("寶物必須變成中立");
	}
	if (treasure0.position.gridId != grid0.id) {
		throw new haxe.Exception("寶物必須在格子裡");
	}
}

private function testBuy() {
	final ctx:Context = getDefaultContext();
	final grid0:Grid = {
		final grid = getDefaultGrid();
		grid;
	}
	ctx.grids = [grid0];
	trace("將格子放滿錢, 測試爆倉後錢要交給主公");
	grid0.money = getGridMaxMoney(ctx, grid0.id);
	final player0 = {
		final player = getDefaultPlayer();
		trace("送給主公1000錢");
		player.money = 1000;
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
		tmp.belongToPlayerId = player1.id;
		tmp.position.gridId = grid0.id;
		tmp;
	}
	ctx.peoples = [people0];
	final treasure0 = {
		final tmp = getDefaultTreasure();
		tmp.belongToPlayerId = null;
		tmp.position.gridId = 0;
		tmp;
	}
	ctx.treasures = [treasure0];
	_buyTreasure(ctx, player0.id, grid0.id, treasure0.id);
	if (player0.money == 1000) {
		throw new haxe.Exception("player0主公的錢必須減少");
	}
	if (player1.money == 0) {
		throw new haxe.Exception("player1主公必須得到錢");
	}
	if (treasure0.belongToPlayerId != player0.id) {
		throw new haxe.Exception("寶物必須變成player0的");
	}
	if (treasure0.position.gridId != null) {
		throw new haxe.Exception("寶物必須敵開格子");
	}
}
