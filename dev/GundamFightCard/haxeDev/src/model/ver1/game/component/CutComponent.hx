package model.ver1.game.component;

import model.ver1.game.define.Define;
import model.ver1.game.define.Effect;
import model.ver1.game.component.EffectComponent;

interface ICutComponent extends IEffectComponent {
	var cuts:Array<Array<String>>;
}

function getTopCut(ctx:ICutComponent):Array<Effect> {
	if (ctx.cuts.length == 0) {
		return [];
	}
	final topCut = ctx.cuts[ctx.cuts.length - 1];
	if (topCut.length == 0) {
		ctx.cuts.pop();
		if (ctx.cuts.length == 0) {
			return [];
		}
	}
	return topCut.map(id -> ctx.effects[id]);
}

function cutIn(ctx:ICutComponent, block:Effect):Void {
	if (ctx.cuts.length == 0) {
		ctx.cuts.push([]);
	}
	final topCut = ctx.cuts[ctx.cuts.length - 1];
	topCut.push(block.id);
	addEffect(ctx, block);
}

function newCut(ctx:ICutComponent, block:Effect):Void {
	ctx.cuts.push([block.id]);
	addEffect(ctx, block);
}

function removeEffect(ctx:ICutComponent, blockId:String):Void {
	for (sub in ctx.cuts) {
		sub.remove(blockId);
	}
	model.ver1.game.component.EffectComponent.removeEffect(ctx, blockId);
}

function getImmediateEffects(ctx:ICutComponent):Array<Effect> {
	return getTopCut(ctx).filter(e -> e.isImmediate);
}
