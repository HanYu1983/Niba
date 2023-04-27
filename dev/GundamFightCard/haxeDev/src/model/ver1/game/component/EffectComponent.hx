package model.ver1.game.component;

import model.ver1.game.define.Block;

interface IEffectComponent {
	var effects:Map<String, Block>;
}

function getEffects(ctx:IEffectComponent):Array<Block> {
	return [for (block in ctx.effects) block];
}

function getEffect(ctx:IEffectComponent, blockId:String):Block {
	if (ctx.effects[blockId] == null) {
		throw new haxe.Exception("block not found");
	}
	return ctx.effects[blockId];
}

function removeEffect(ctx:IEffectComponent, blockId:String):Void {
	ctx.effects.remove(blockId);
}

function addEffect(ctx:IEffectComponent, block:Block):Void {
	if (ctx.effects[block.id] != null) {
		throw new haxe.Exception("block exists");
	}
	ctx.effects[block.id] = block;
}
