package model.ver1.alg;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.Define;
import model.ver1.game.Context;
import model.ver1.game.ExecuteRuntimeImpl;
import model.ver1.data.DataPool;
import model.ver1.data.PlayerPlayCard;

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

function tapCard(ctx:Context, cardId:String):Void {
	final card = getCard(ctx, cardId);
	if (card.isTap) {
		throw new haxe.Exception("already tap");
	}
	card.isTap = true;
}

function playCardToField(ctx:Context, cardId:String):Void {
	sendEvent(ctx, CardEnterField(cardId));
}

function cutIn(ctx:Context, block:Block):Void {
	if (ctx.cuts.length == 0) {
		ctx.cuts.push([]);
	}
	final lastCut = ctx.cuts[ctx.cuts.length - 1];
	lastCut.push(block);
}

function newCut(ctx:Context, block:Block):Void {
	ctx.cuts.push([block]);
}

//
// Block
//

function getBlocks(ctx:Context):Array<Block> {
	return ctx.cuts.fold((c, a) -> {
		return a.concat(c);
	}, []);
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

function removeBlock(ctx:Context, blockId:String):Void {
	final block = getBlock(ctx, blockId);
	for (cut in ctx.cuts) {
		cut.remove(block);
	}
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
	for (mark in ctx.marks) {
		mark.onEvent(ctx, evt);
	}
}

//
// Runtime
//

function getRuntimeText(ctx:Context):Array<{runtime:ExecuteRuntime, text:CardText}> {
	final cardsNotHome = [for (card in ctx.table.cards) card];
	final cardsHasNoController = cardsNotHome.filter(card -> {
		return switch getCardController(ctx, card.id) {
			case Some(_): false;
			case _: true;
		};
	});
	// 手牌，hanger中的牌, 直接給它Play的權力
	final cardsInHandAndHanger = cardsHasNoController.filter(card -> {
		return true;
	});
	final playReturn = [
		for (card in cardsInHandAndHanger) {
			final responsePlayerId = getCardStackControllerAndAssertExist(ctx, getCardCardStackId(ctx, card.id));
			final runtime:ExecuteRuntime = new DefaultExecuteRuntime(card.id, responsePlayerId);
			final playCardEffect = new PlayerPlayCard("");
			// TODO: text是恆常
			for (text in [(playCardEffect : CardText)].concat(getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime).filter(text -> true))) {
				{
					runtime: runtime,
					text: text
				};
			}
		}
	];
	// 手牌，hanger以外的沒有控制中的牌(倒置G，廢棄庫...)
	final cardsNotInHandAndHanger = cardsHasNoController.filter(card -> {
		// TODO: 本國以外
		return cardsInHandAndHanger.contains(card) == false;
	});
	// 倒置G的情況可以使用<>內文
	final cardsUseG = cardsNotInHandAndHanger.filter(card -> {
		// 標記為倒置的卡並在配置區
		return true;
	});
	final specialReturn = [
		for (card in cardsUseG) {
			final responsePlayerId = getCardStackControllerAndAssertExist(ctx, getCardCardStackId(ctx, card.id));
			final runtime:ExecuteRuntime = new DefaultExecuteRuntime(card.id, responsePlayerId);
			// TODO: text是<>
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime).filter(text -> true)) {
				{
					runtime: runtime,
					text: text
				};
			}
		}
	];
	// 廢棄庫可以使用恆常內文
	final cardsNotUseG = cardsNotInHandAndHanger.filter(card -> {
		return cardsUseG.contains(card) == false;
	});
	final specialReturn2 = [
		for (card in cardsNotUseG) {
			final responsePlayerId = getCardStackControllerAndAssertExist(ctx, getCardCardStackId(ctx, card.id));
			final runtime:ExecuteRuntime = new DefaultExecuteRuntime(card.id, responsePlayerId);
			// TODO: text是恆常
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime).filter(text -> true)) {
				{
					runtime: runtime,
					text: text
				};
			}
		}
	];
	//
	final cardsHasController = cardsNotHome.filter(card -> {
		return cardsHasNoController.contains(card) == false;
	});
	// 原始內文
	final originReturn = [
		for (card in cardsHasController) {
			final responsePlayerId = getCardControllerAndAssertExist(ctx, card.id);
			final runtime:ExecuteRuntime = new DefaultExecuteRuntime(card.id, responsePlayerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime)) {
				{
					runtime: runtime,
					text: text
				};
			}
		}
	];
	// 計算常駐能力新增內文
	final originMarkEffects = [
		for (card in cardsHasController) {
			final responsePlayerId = getCardControllerAndAssertExist(ctx, card.id);
			final runtime:ExecuteRuntime = new DefaultExecuteRuntime(card.id, responsePlayerId);
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
		final responsePlayerId = getCardControllerAndAssertExist(ctx, info.cardId);
		final runtime:ExecuteRuntime = new DefaultExecuteRuntime(info.cardId, responsePlayerId);
		{
			runtime: runtime,
			text: info.text
		};
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
		final responsePlayerId = getCardControllerAndAssertExist(ctx, info.cardId);
		final runtime:ExecuteRuntime = new DefaultExecuteRuntime(info.cardId, responsePlayerId);
		{
			runtime: runtime,
			text: info.text
		};
	});
	return playReturn.concat(specialReturn).concat(specialReturn2).concat(originReturn).concat(addedReturn).concat(globalAddedReturn);
}

//
// Query
//
function getPlayerSelectionCardId(ctx:Context, key:String):Array<String> {
	final selection = ctx.memory.playerSelection.cardIds[key];
	if (selection == null) {
		throw new haxe.Exception("selection not found");
	}
	return selection;
}

// p.63
// 手札、ハンガー中的卡沒有控制者，但有Play的權利
// 本国、捨て山、ジャンクヤード中的卡沒有控制者
// 沒有控制者的情況也就代表不能使用內文也不能出擊
function getCardController(ctx:Context, cardId:String):Option<String> {
	// 所在區域的管理者
	// 所在部隊的管理者
	// 其它的都沒有管理者
	return None;
}

function getCardControllerAndAssertExist(ctx:Context, cardId:String):String {
	return switch getCardController(ctx, cardId) {
		case Some(playerId): playerId;
		case _: throw new haxe.Exception("卡片被除外，沒有控制者");
	}
}

// (p.63)場所管理者
function getCardStackController(ctx:Context, cardStackId:String):Option<String> {
	// 判斷cardStackId在哪個player身上
	return None;
}

function getCardStackControllerAndAssertExist(ctx:Context, cardStackId:String):String {
	return switch getCardStackController(ctx, cardStackId) {
		case Some(playerId): playerId;
		case _: throw new haxe.Exception("沒有控制者");
	}
}

function getCardCardStackId(ctx:Context, cardId:String):String {
	return "";
}

function getCardGSign(ctx:Context, cardId:String):GSign {
	return {
		colors: [Red],
		production: ""
	}
}

function getPlayerGCountForPlay(ctx:Context, playerId:String):Int {
	// 查詢有沒有增加國力的卡
	return 0;
}

function getPlayerGCardIds(ctx:Context, playerId:String):Array<String> {
	return [];
}

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

// (p.63) 自軍カードが
function isMyCard(ctx:Context, masterCardId:String, slaveCardId:String):Bool {
	return switch {l: getCardController(ctx, masterCardId), r: getCardController(ctx, slaveCardId)} {
		case {l: Some(c1), r: Some(c2)} if (c1 == c2):
			true;
		case _:
			false;
	}
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
