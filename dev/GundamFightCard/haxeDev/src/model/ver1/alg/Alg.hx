package model.ver1.alg;

import haxe.ds.Option;
import model.ver1.data.DataPool;
import model.ver1.game.Define;

@:nullSafety
function registerCardProto(ctx:Context, key:String, proto:AbstractCardProto) {
	ctx.cardProtoPool[key] = proto;
}

@:nullSafety
function getCurrentCardProto(ctx:Context, key:String):ICardProto {
	final obj = ctx.cardProtoPool[key];
	if (obj == null) {
		return getCardProto(key);
	}
	return obj;
}

@:nullSafety
function isDestroyNow(ctx:Context, cardId:String, condition:{isByBattleDamage:Bool}):Bool {
	// cardId是否有破壞並廢棄的效果在堆疊中
	if (condition.isByBattleDamage) {}
	return false;
}

@:nullSafety
function removeDestroyEffect(ctx:Context, cardId:String):Void {
	trace("移除堆疊中的破壞效果");
}

@:nullSafety
function becomeG(ctx:Context, cardId:String):Void {
	trace("將自己變成G");
}

@:nullSafety
function getUnitOfSetGroup(ctx:Context, cardId:String):Option<String> {
	return None;
}

function getBlocks(ctx:Context):Array<Block> {
	return ctx.effectStack.concat(ctx.immediateStack);
}

function getBlock(ctx:Context, blockId:String):Block {
	final blocks = getBlocks(ctx);
	final findBlock = blocks.filter(block -> block.id == blockId);
	if (findBlock.length == 0) {
		throw new haxe.Exception("block not found");
	}
	return findBlock[0];
}

function getBlockRuntime(ctx:Context, playerId:String, blockId:String):ExecuteRuntime {
	final block = getBlock(ctx, blockId);
	return switch block.cause {
		case System:
			new DefaultExecuteRuntime("0", playerId);
		case PlayCard(cardId):
			new DefaultExecuteRuntime(cardId, playerId);
		case PlayText(cardId, textId):
			new DefaultExecuteRuntime(cardId, playerId);
		case TextEffect(cardId, textId):
			new DefaultExecuteRuntime(cardId, playerId);
		case _:
			new DefaultExecuteRuntime("0", playerId);
	}
}

function removeBlock(ctx:Context, blockId:String):Void {
	final block = getBlock(ctx, blockId);
	ctx.effectStack.remove(block);
	ctx.immediateStack.remove(block);
}

@:nullSafety
function getRuntimeText(ctx:Context, playerId:String):Array<{runtime:ExecuteRuntime, text:CardText}> {
	final ret = new Array<{runtime:ExecuteRuntime, text:CardText}>();
	// 原始內文
	final originReturn = [
		for (card in ctx.table.cards) {
			final runtime = new DefaultExecuteRuntime(card.id, playerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime)) {
				ret.push({
					runtime: runtime,
					text: text
				});
			}
		}
	];
	// 計算常駐能力新增內文
	final originMarkEffects = [
		for (card in ctx.table.cards) {
			final runtime = new DefaultExecuteRuntime(card.id, playerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime)) {
				for (effect in text.getEffect(ctx, runtime)) {
					effect;
				}
			}
		}
	];
	final attachTextEffect = originMarkEffects.filter(effect -> {
		return switch effect {
			case AddText(_, _):
				true;
			case _:
				false;
		}
	});
	final addedReturn = attachTextEffect.map(effect -> {
		final info = switch effect {
			case AddText(cardId, text):
				{
					cardId: cardId,
					text: text
				};
			case _:
				throw new haxe.Exception("addedReturn xxx");
		}
		final runtime = new DefaultExecuteRuntime(info.cardId, playerId);
		ret.push({
			runtime: runtime,
			text: info.text
		});
	});
	// 計算效果新增內文
	final globalMarkEffects = [
		for (mark in ctx.marks)
			for (effect in mark.getEffect(ctx))
				effect
	];
	final globalAttachTextEffect = globalMarkEffects.filter(effect -> {
		return switch effect {
			case AddText(_, _):
				true;
			case _:
				false;
		}
	});
	final globalAddedReturn = globalAttachTextEffect.map(effect -> {
		final info = switch effect {
			case AddText(cardId, text):
				{
					cardId: cardId,
					text: text
				};
			case _:
				throw new haxe.Exception("globalAddedReturn xxx");
		}
		final runtime = new DefaultExecuteRuntime(info.cardId, playerId);
		ret.push({
			runtime: runtime,
			text: info.text
		});
	});
	return ret;
}

// 常駐增強內文
function getAddBattlePoint(ctx:Context, playerId:String) {
	// TODO
	final infos = [
		for (info in getRuntimeText(ctx, playerId)) {
			final runtime = info.runtime;
			final text = info.text;
			final effects = text.getEffect(ctx, runtime);
			for (effect in effects) {
				switch effect {
					case AddBattlePoint(cardId, battlePoint):
						{
							cardId: cardId,
							battlePoint: battlePoint
						};
					case _:
						null;
				}
			}
		}
	];
}

// 速攻
function getAttackSpeed(ctx:Context, playerId:String) {
	// TODO
	final infos = [
		for (info in getRuntimeText(ctx, playerId)) {
			final runtime = info.runtime;
			final text = info.text;
			final effects = text.getEffect(ctx, runtime);
			for (effect in effects) {
				switch effect {
					case AttackSpeed(cardId, speed):
						{
							cardId: cardId,
							speed: speed
						};
					case _:
						null;
				}
			}
		}
	];
}