package model.ver1.game.alg;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Event;
import model.ver1.game.alg.Runtime;
import model.ver1.game.alg.CardProto;
import model.ver1.game.entity.Context;
//
// General
//
// 持ち主の手札に移す
function returnToOwnerHand(ctx:Context, cardId:String):Void {
	final from = getCardBaSyouAndAssertExist(ctx, cardId);
	final to = BaSyou.Default(getCardOwner(ctx, cardId), TeHuTa);
	moveCard(ctx, cardId, from, to);
}

@:nullSafety
function getCardOwner(ctx:Context, cardId:String):String {
	final owner = getCard(ctx.table, cardId).owner;
	if (owner == null) {
		throw "owner not set yet";
	}
	return owner;
}

function becomeG(ctx:Context, cardId:String):Void {
	trace("將自己變成G");
}

function getUnitOfSetGroup(ctx:Context, cardId:String):Option<String> {
	return None;
}

function tapCard(ctx:Context, cardId:String):Void {
	final card = getCard(ctx.table, cardId);
	if (card.isTap) {
		throw new haxe.Exception("already tap");
	}
	card.isTap = true;
	// TODO: put here?
	sendEvent(ctx, CardRoll(card.id));
}

function moveCard(ctx:Context, cardId:String, from:BaSyou, to:BaSyou) {
	tool.Table.moveCard(ctx.table, cardId, (from : BaSyouId), (to : BaSyouId));
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

function getCardsByBaSyou(ctx:Context, baSyou: BaSyou):Array<String> {
	return getCardStack(ctx.table, (baSyou:BaSyouId)).cardIds;
}

function getCardType(ctx:Context, cardId:String):CardCategory {
	final proto = getCurrentCardProto(ctx, getCard(ctx.table, cardId).protoId);
	return proto.category;
}

function getCardEntityCategory(ctx:Context, cardId:String):Option<CardEntityCategory> {
	return switch getCardBaSyouAndAssertExist(ctx, cardId) {
		case Default(_, GZone):
			Some(G);
		case Default(_, kw) if (isBa(kw)):
			switch getCardType(ctx, cardId) {
				case Unit:
					Some(Unit);
				case Operation | OperationUnit:
					Some(Operation);
				case Character:
					Some(Character);
				case _:
					throw '不知到為什麼在這裡:${kw}:${cardId}';
			}
		case _:
			None;
	}
}

// Selection

function getThisCardSetGroupCardIds(ctx:Context, cardId:String):Array<String> {
	return [cardId];
}

function getPlayerSelectionCardId(ctx:Context, key:String):Array<String> {
	final selection = ctx.memory.playerSelection.cardIds[key];
	if (selection == null) {
		throw new haxe.Exception("selection not found");
	}
	return selection;
}

function setPlayerSelectionCardId(ctx:Context, key:String, values:Array<String>):Void {
	ctx.memory.playerSelection.cardIds[key] = values;
}

// p.63
// 手札、ハンガー中的卡沒有控制者，但有Play的權利
// 本国、捨て山、ジャンクヤード中的卡沒有控制者
// 沒有控制者的情況也就代表不能使用內文也不能出擊
function getCardController(ctx:Context, cardId:String):Option<String> {
	// 所在區域的管理者
	// 所在部隊的管理者
	// 其它的都沒有管理者
	return switch getCardBaSyouAndAssertExist(ctx, cardId) {
		case Default(playerId, baSyouKeyword) if (isBa(baSyouKeyword)):
			Some(playerId);
		case _:
			None;
	}
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
			(cardStack.id : BaSyouId);
		case _:
			trace(ctx);
			throw new haxe.Exception('card baSyou not found: ${cardId}');
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
	return [cardId];
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

function isOpponentsCard(ctx:Context, masterCardId:String, slaveCardId:String):Bool {
	return switch [getCardController(ctx, masterCardId), getCardController(ctx, slaveCardId)] {
		case [Some(c1), Some(c2)] if (c1 != c2):
			true;
		case _:
			false;
	}
}

function getEnterFieldThisTurnCardIds(ctx:Context):Array<String> {
	return getMarkEffects(ctx).filter(e -> {
		return switch e {
			case EnterFieldThisTurn(_):
				true;
			case _:
				false;
		}
	}).map(e -> {
		return switch e {
			case EnterFieldThisTurn(cardId):
				cardId;
			case _:
				throw "should not go here";
		}
	});
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
