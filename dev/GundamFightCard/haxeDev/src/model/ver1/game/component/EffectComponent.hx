package model.ver1.game.component;

import model.ver1.game.define.Effect;

interface IEffectComponent {
	var effects:Map<String, Effect>;
}

function getEffects(ctx:IEffectComponent):Array<Effect> {
	return [for (block in ctx.effects) block];
}

function getEffect(ctx:IEffectComponent, blockId:String):Effect {
	if (ctx.effects[blockId] == null) {
		throw new haxe.Exception("block not found");
	}
	return ctx.effects[blockId];
}

function removeEffect(ctx:IEffectComponent, blockId:String):Void {
	ctx.effects.remove(blockId);
}

function addEffect(ctx:IEffectComponent, block:Effect):Void {
	if (ctx.effects[block.id] != null) {
		throw new haxe.Exception("block exists");
	}
	ctx.effects[block.id] = block;
}
