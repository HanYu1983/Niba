package model.ver1.alg;

import haxe.ds.Option;
import tool.Table;
import model.ver1.data.DataPool;
import model.ver1.game.Define;

//
// CardProto
//
function registerCardProto(ctx:Context, key:String, proto:CardProto) {
	ctx.cardProtoPool[key] = proto;
}

function getCurrentCardProto(ctx:Context, key:String):CardProto {
	final obj = ctx.cardProtoPool[key];
	if (obj == null) {
		return getCardProto(key);
	}
	return obj;
}

//
// Destroy
//
function isDestroyNow(ctx:Context, cardId:String, condition:{isByBattleDamage:Bool}):Bool {
	// cardId是否有破壞並廢棄的效果在堆疊中
	if (condition.isByBattleDamage) {}
	return false;
}

function removeDestroyEffect(ctx:Context, cardId:String):Void {
	trace("移除堆疊中的破壞效果");
}

//
//
//
function becomeG(ctx:Context, cardId:String):Void {
	trace("將自己變成G");
}

function getUnitOfSetGroup(ctx:Context, cardId:String):Option<String> {
	return None;
}

//
// Block
//

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

function getBlockRuntime(ctx:Context, blockId:String):ExecuteRuntime {
	final block = getBlock(ctx, blockId);
	return switch block.cause {
		case System(respnosePlayerId):
			new SystemExecuteRuntime(respnosePlayerId);
		case PlayCard(playCardPlayerId, cardId):
			final responsePlayerId = playCardPlayerId;
			new DefaultExecuteRuntime(cardId, responsePlayerId);
		case PlayText(cardId, textId):
			final responsePlayerId = getCard(ctx, cardId).owner;
			new DefaultExecuteRuntime(cardId, responsePlayerId);
		case TextEffect(cardId, textId):
			final responsePlayerId = getCard(ctx, cardId).owner;
			new DefaultExecuteRuntime(cardId, responsePlayerId);
		case _:
			new AbstractExecuteRuntime();
	}
}

function removeBlock(ctx:Context, blockId:String):Void {
	final block = getBlock(ctx, blockId);
	ctx.effectStack.remove(block);
	ctx.immediateStack.remove(block);
}

//
// Event
//
function sendEvent(ctx:Context, evt:Event):Void {
	for (info in getRuntimeText(ctx)) {
		final runtime = info.runtime;
		final text = info.text;
		text.onEvent(ctx, evt, runtime);
	}
	for(mark in ctx.marks){
		mark.onEvent(ctx, evt);
	}
}

//
// Runtime
//

function getRuntimeText(ctx:Context):Array<{runtime:ExecuteRuntime, text:CardText}> {
	final ret = new Array<{runtime:ExecuteRuntime, text:CardText}>();
	// 原始內文
	final originReturn = [
		for (card in ctx.table.cards) {
			final responsePlayerId = card.owner;
			final runtime = new DefaultExecuteRuntime(card.id, responsePlayerId);
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
			final responsePlayerId = card.owner;
			final runtime = new DefaultExecuteRuntime(card.id, responsePlayerId);
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
		final responsePlayerId = getCard(ctx, info.cardId).owner;
		final runtime = new DefaultExecuteRuntime(info.cardId, responsePlayerId);
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
		final responsePlayerId = getCard(ctx, info.cardId).owner;
		final runtime = new DefaultExecuteRuntime(info.cardId, responsePlayerId);
		ret.push({
			runtime: runtime,
			text: info.text
		});
	});
	return ret;
}

//
// Query
//

function getCardSetGroupCardIds(ctx:Context, cardId:String):Array<String> {
	return [];
}

@:nullSafety
function getCard(ctx:Context, cardId:String):Card {
	final card = ctx.table.cards[cardId];
	if (card == null) {
		throw new haxe.Exception('card not found: ${cardId}');
	}
	return card;
}

// 自軍カードが
function isMyCard(ctx:Context, playerId:String, cardId:String):Bool {
	return playerId == getCard(ctx, cardId).owner;
}

// 常駐增強內文
function getAddBattlePoint(ctx:Context) {
	// TODO
	final infos = [
		for (info in getRuntimeText(ctx)) {
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
function getAttackSpeed(ctx:Context) {
	// TODO
	final infos = [
		for (info in getRuntimeText(ctx)) {
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
