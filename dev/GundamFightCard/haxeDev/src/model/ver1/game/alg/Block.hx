package model.ver1.game.alg;

using Lambda;

import haxe.ds.Option;
import model.ver1.game.define.Define;
import model.ver1.game.define.Block;
import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.alg.Context;
import model.ver1.game.entity.DefaultBlock;

interface IBlock {
	var cuts:Array<Array<DefaultBlock>>;
}

function getBlocks(ctx:IBlock):Array<DefaultBlock> {
	return ctx.cuts.fold((c, a) -> {
		return a.concat(c);
	}, []);
}

function getBlock(ctx:IBlock, blockId:String):DefaultBlock {
	final blocks = getBlocks(ctx);
	final findBlock = blocks.filter(block -> block.id == blockId);
	if (findBlock.length == 0) {
		throw new haxe.Exception("block not found");
	}
	return findBlock[0];
}

function getBlockRuntime(ctx:IBlock, blockId:String):ExecuteRuntime {
	final block = getBlock(ctx, blockId);
	return switch block.cause {
		case System(respnosePlayerId):
			new SystemExecuteRuntime(respnosePlayerId);
		case PlayCard(playCardPlayerId, cardId):
			new DefaultExecuteRuntime(cardId, playCardPlayerId);
		case PlayText(cardId, textId):
			final responsePlayerId = getCardControllerAndAssertExist(ctx, cardId);
			new DefaultExecuteRuntime(cardId, responsePlayerId);
		case TextEffect(cardId, textId):
			final responsePlayerId = getCardControllerAndAssertExist(ctx, cardId);
			new DefaultExecuteRuntime(cardId, responsePlayerId);
		case _:
			new AbstractExecuteRuntime();
	}
}

function removeBlock(ctx:IBlock, blockId:String):Void {
	final block = getBlock(ctx, blockId);
	for (cut in ctx.cuts) {
		cut.remove(block);
	}
}
