package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;

using Lambda;

function _sellTreasure(ctx:Context, playerId:Int, gridId:Int, sellId:Int) {
	ctx.events.push(MESSAGE_EVENT({
		title: 'sell item!',
		msg: 'sell item!',
	}, getGameInfo(ctx, false)));
}

function _buyTreasure(ctx:Context, playerId:Int, gridId:Int, buyId:Int) {
	ctx.events.push(MESSAGE_EVENT({
		title: 'buy item!',
		msg: 'buy item!',
	}, getGameInfo(ctx, false)));
}
