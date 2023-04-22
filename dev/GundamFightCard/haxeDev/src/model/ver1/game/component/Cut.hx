package model.ver1.game.component;

import model.ver1.game.define.Define;
import model.ver1.game.define.Block;

interface ICutComponent {
	var cuts:Array<Array<Block>>;
}

function getTopCut(ctx:ICutComponent):Array<Block> {
	if (ctx.cuts.length == 0) {
		ctx.cuts.push([]);
	}
	final topCut = ctx.cuts[ctx.cuts.length - 1];
	return topCut;
}

function cutIn(ctx:ICutComponent, block:Block):Void {
	getTopCut(ctx).push(block);
}

function newCut(ctx:ICutComponent, block:Block):Void {
	ctx.cuts.push([block]);
}
