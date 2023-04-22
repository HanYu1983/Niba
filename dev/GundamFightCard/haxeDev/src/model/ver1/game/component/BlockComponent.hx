package model.ver1.game.component;

using Lambda;

import haxe.ds.Option;
import model.ver1.game.define.Define;
import model.ver1.game.define.Block;
import model.ver1.game.define.Runtime;

interface IBlockComponent {
	var cuts:Array<Array<Block>>;
}

function getBlocks(ctx:IBlockComponent):Array<Block> {
	return ctx.cuts.fold((c, a) -> {
		return a.concat(c);
	}, []);
}

function getBlock(ctx:IBlockComponent, blockId:String):Block {
	final blocks = getBlocks(ctx);
	final findBlock = blocks.filter(block -> block.id == blockId);
	if (findBlock.length == 0) {
		throw new haxe.Exception("block not found");
	}
	return findBlock[0];
}

function removeBlock(ctx:IBlockComponent, blockId:String):Void {
	final block = getBlock(ctx, blockId);
	for (cut in ctx.cuts) {
		cut.remove(block);
	}
}
