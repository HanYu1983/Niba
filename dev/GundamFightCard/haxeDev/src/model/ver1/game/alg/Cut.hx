package model.ver1.game.alg;

import model.ver1.game.define.Define;
import model.ver1.game.define.Block;
import model.ver1.game.entity.DefaultBlock;

interface ICut {
	var cuts:Array<Array<DefaultBlock>>;
}

function getTopCut(ctx:ICut):Array<DefaultBlock> {
	if (ctx.cuts.length == 0) {
		ctx.cuts.push([]);
	}
	final topCut = ctx.cuts[ctx.cuts.length - 1];
	return topCut;
}

function cutIn(ctx:ICut, block:DefaultBlock):Void {
	getTopCut(ctx).push(block);
}

function newCut(ctx:ICut, block:DefaultBlock):Void {
	ctx.cuts.push([block]);
}
