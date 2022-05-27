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
	// if (treasure.belongToPlayerId != playerId) {
	// 	throw new haxe.Exception("[_sellTreasure]treasure必須player");
	// }
	if (treasure.position.gridId != null) {
		throw new haxe.Exception("[_sellTreasure]treasure必須不在城裡");
	}
	final findCatelog = treasureList.filter(t -> t.id == treasure.protoId);
	if (findCatelog.length == 0) {
		throw new haxe.Exception('[_sellTreasure]findCatelog not found: ${treasure.protoId}');
	}
	final player = getPlayerById(ctx, playerId);
	final sellMoney = findCatelog[0].cost;
	final grid = ctx.grids[gridId];
	if (sellMoney >= grid.money) {
		warn("_sellTreasure", ["格子錢不夠, 無法買", grid, sellMoney]);
		return;
	}
	grid.money -= sellMoney;
	player.money += sellMoney;
	final gridBelongPlayerId = getGridBelongPlayerId(ctx, gridId);
	// 將寶放入城中
	treasure.belongToPlayerId = gridBelongPlayerId;
	treasure.position.gridId = grid.id;
	ctx.events.push(MESSAGE_EVENT({
		title: '賣出寶物',
		msg: '${player.name}賣出${findCatelog[0].name}',
	}, getGameInfo(ctx, false)));
}

function _buyTreasure(ctx:Context, playerId:Int, gridId:Int, buyId:Int) {
	final treasure = getTreasureById(ctx, buyId);
	if (treasure.position.gridId != gridId) {
		throw new haxe.Exception("[_sellTreasure]treasure必須在城裡");
	}
	final findCatelog = treasureList.filter(t -> t.id == treasure.protoId);
	if (findCatelog.length == 0) {
		throw new haxe.Exception('[_sellTreasure]findCatelog not found: ${treasure.protoId}');
	}
	final player = getPlayerById(ctx, playerId);
	final buyMoney = findCatelog[0].cost;
	final grid = ctx.grids[gridId];
	grid.money += buyMoney;
	final moreMoney = grid.money - getGridMaxMoney(ctx, gridId);
	final gridBelongPlayerId = getGridBelongPlayerId(ctx, gridId);
	if (moreMoney > 0) {
		grid.money = getGridMaxMoney(ctx, gridId);
		if (gridBelongPlayerId != null) {
			final targetPlayer = getPlayerById(ctx, gridBelongPlayerId);
			targetPlayer.money += moreMoney;
		} else {
			warn("_sellTreasure", ["gridBelongPlayerId not found", gridId]);
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
