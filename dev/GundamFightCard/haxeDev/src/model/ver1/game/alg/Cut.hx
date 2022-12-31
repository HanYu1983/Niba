package model.ver1.game.alg;

import model.ver1.game.define.Define;

function cutIn(ctx:Context, block:Block):Void {
	if (ctx.cuts.length == 0) {
		ctx.cuts.push([]);
	}
	final lastCut = ctx.cuts[ctx.cuts.length - 1];
	lastCut.push(block);
}

function newCut(ctx:Context, block:Block):Void {
	ctx.cuts.push([block]);
}