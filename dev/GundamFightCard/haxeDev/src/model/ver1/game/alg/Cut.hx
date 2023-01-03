package model.ver1.game.alg;

import model.ver1.game.define.Define;
import model.ver1.game.define.Block;

function getTopCut(ctx:Context):Array<Block> {
	if (ctx.cuts.length == 0) {
		ctx.cuts.push([]);
	}
	final topCut = ctx.cuts[ctx.cuts.length - 1];
	return topCut;
}

function cutIn(ctx:Context, block:Block):Void {
	getTopCut(ctx).push(block);
}

function newCut(ctx:Context, block:Block):Void {
	ctx.cuts.push([block]);
}
