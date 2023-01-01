package model.ver1.game.alg;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.ExecuteRuntimeImpl;
import model.ver1.game.alg.Runtime;

//
// General
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

function moveCard(ctx:Context, cardId:String, from:BaSyou, to:BaSyou) {
	tool.Table.moveCard(ctx.table, cardId, getCardStackId(from), getCardStackId(to));
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
// Query
//

function getCardType(ctx:Context, cardId:String):CardCategory {
	return Unit;
}

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
function getBaSyouController(ctx:Context, baSyou:BaSyou):Option<String> {
	return switch baSyou {
		case Default(playerId, baSyouKeyword):
			return Some(playerId);
	}
}

function getBaSyouControllerAndAssertExist(ctx:Context, baSyou:BaSyou):String {
	return switch getBaSyouController(ctx, baSyou) {
		case Some(playerId):
			playerId;
		case _:
			throw new haxe.Exception("沒有控制者");
	}
}

function getCardBaSyouAndAssertExist(ctx:Context, cardId:String):BaSyou {
	return switch tool.Table.getCardCardStack(ctx.table, cardId) {
		case Some(cardStack):
			getBaSyou(cardStack.id);
		case _:
			throw new haxe.Exception('card baSyou not found');
	}
}

function getCardGSign(ctx:Context, cardId:String):GSign {
	return Default(Red, Uc);
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
	return switch [getCardController(ctx, masterCardId), getCardController(ctx, slaveCardId)] {
		case [Some(c1), Some(c2)] if (c1 == c2):
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
