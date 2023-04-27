package model.ver1.game.component;

import model.ver1.game.define.Define;
import model.ver1.game.define.Block;
import model.ver1.game.component.EffectComponent;

interface ICutComponent extends IEffectComponent {
	var cuts:Array<Array<String>>;
}

function getTopCut(ctx:ICutComponent):Array<Block> {
	if (ctx.cuts.length == 0) {
		ctx.cuts.push([]);
	}
	final topCut = ctx.cuts[ctx.cuts.length - 1];
	return topCut.map(id -> ctx.effects[id]);
}

function cutIn(ctx:ICutComponent, block:Block):Void {
	getTopCut(ctx);
	final topCut = ctx.cuts[ctx.cuts.length - 1];
	topCut.push(block.id);
	addEffect(ctx, block);
}

function newCut(ctx:ICutComponent, block:Block):Void {
	ctx.cuts.push([block.id]);
	addEffect(ctx, block);
}

function removeEffect(ctx:ICutComponent, blockId:String):Void {
	for (sub in ctx.cuts) {
		sub.remove(blockId);
	}
	model.ver1.game.component.EffectComponent.removeEffect(ctx, blockId);
}
