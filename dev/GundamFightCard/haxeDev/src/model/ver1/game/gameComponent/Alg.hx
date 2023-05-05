package model.ver1.game.gameComponent;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Player;
import model.ver1.game.component.CardProtoPoolComponent;
import model.ver1.game.component.EffectComponent;
import model.ver1.game.component.MarkComponent;
import model.ver1.game.gameComponent.Event;
import model.ver1.game.gameComponent.Runtime;
import model.ver1.game.gameComponent.MarkEffect;
import model.ver1.game.gameComponent.GameComponent;

//
// General
//
// 持ち主の手札に移す
function returnToOwnerHand(ctx:IGameComponent, cardId:String):Void {
	final from = getCardBaSyouAndAssertExist(ctx, cardId);
	final to = BaSyou.Default(getCardOwner(ctx, cardId), TeHuTa);
	moveCard(ctx, cardId, from, to);
}

function getCardOwner(ctx:IGameComponent, cardId:String):String {
	final owner = getCard(ctx.table, cardId).owner;
	if (owner == null) {
		throw "owner not set yet";
	}
	return owner;
}

function becomeG(ctx:IGameComponent, cardId:String):Void {
	trace("將自己變成G");
}

function getUnitOfSetGroup(ctx:IGameComponent, cardId:String):Option<String> {
	return None;
}

function rollCard(ctx:IGameComponent, cardId:String):Void {
	final card = getCard(ctx.table, cardId);
	if (card.isTap) {
		throw new haxe.Exception("already tap");
	}
	card.isTap = true;
	sendEvent(ctx, CardRoll(card.id));
}

function rerollCard(ctx:IGameComponent, cardId:String):Void {
	final card = getCard(ctx.table, cardId);
	if (card.isTap == false) {
		throw new haxe.Exception("already reroll");
	}
	card.isTap = false;
}

function moveCard(ctx:IGameComponent, cardId:String, from:BaSyou, to:BaSyou) {
	tool.Table.moveCard(ctx.table, cardId, (from : BaSyouId), (to : BaSyouId));
}

//
// Event
//
function sendEvent(ctx:IGameComponent, evt:Event):Void {
	for (info in getRuntimeText(ctx)) {
		final runtime = info.runtime;
		final text = info.text;
		text.onEvent(ctx, evt, runtime);
	}

	for (mark in getMarks(ctx)) {
		mark.onEvent(ctx, evt);
	}
}

//
// Query
//

function getCardsByBaSyou(ctx:IGameComponent, baSyou:BaSyou):Array<String> {
	return getCardStack(ctx.table, (baSyou : BaSyouId)).cardIds;
}

function getCardType(ctx:IGameComponent, cardId:String):CardCategory {
	final proto = getCurrentCardProto(ctx, getCard(ctx.table, cardId).protoId);
	return proto.category;
}

function getCardEntityCategory(ctx:IGameComponent, cardId:String):Option<CardEntityCategory> {
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

function getThisCardSetGroupCardIds(ctx:IGameComponent, cardId:String):Array<String> {
	return [cardId];
}

// p.63
// 手札、ハンガー中的卡沒有控制者，但有Play的權利
// 本国、捨て山、ジャンクヤード中的卡沒有控制者
// 沒有控制者的情況也就代表不能使用內文也不能出擊
function getCardController(ctx:IGameComponent, cardId:String):Option<String> {
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

function getCardControllerAndAssertExist(ctx:IGameComponent, cardId:String):String {
	return switch getCardController(ctx, cardId) {
		case Some(playerId): playerId;
		case _: throw new haxe.Exception("卡片被除外，沒有控制者");
	}
}

// (p.63)場所管理者
function getBaSyouController(ctx:IGameComponent, baSyou:BaSyou):Option<String> {
	return switch baSyou {
		case Default(playerId, baSyouKeyword):
			return Some(playerId);
	}
}

function getBaSyouControllerAndAssertExist(ctx:IGameComponent, baSyou:BaSyou):String {
	return switch getBaSyouController(ctx, baSyou) {
		case Some(playerId):
			playerId;
		case _:
			throw new haxe.Exception("沒有控制者");
	}
}

function getCardBaSyouAndAssertExist(ctx:IGameComponent, cardId:String):BaSyou {
	return switch tool.Table.getCardCardStack(ctx.table, cardId) {
		case Some(cardStack):
			(cardStack.id : BaSyouId);
		case _:
			trace(ctx);
			throw new haxe.Exception('card baSyou not found: ${cardId}');
	}
}

function getCardGSign(ctx:IGameComponent, cardId:String):GSign {
	return Default(Red, Uc);
}

function getPlayerGCountForPlay(ctx:IGameComponent, playerId:String):Int {
	// 查詢有沒有增加國力的卡
	return 0;
}

function getPlayerGCardIds(ctx:IGameComponent, playerId:String):Array<String> {
	return [];
}

function getCardSetGroupCardIds(ctx:IGameComponent, cardId:String):Array<String> {
	return [cardId];
}

// (p.63) 自軍カードが
function isMyCard(ctx:IGameComponent, masterCardId:String, slaveCardId:String):Bool {
	return switch [getCardController(ctx, masterCardId), getCardController(ctx, slaveCardId)] {
		case [Some(c1), Some(c2)] if (c1 == c2):
			true;
		case _:
			false;
	}
}

function isOpponentsCard(ctx:IGameComponent, masterCardId:String, slaveCardId:String):Bool {
	return switch [getCardController(ctx, masterCardId), getCardController(ctx, slaveCardId)] {
		case [Some(c1), Some(c2)] if (c1 != c2):
			true;
		case _:
			false;
	}
}

function getEnterFieldThisTurnCardIds(ctx:IGameComponent):Array<String> {
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
function getAddBattlePoint(ctx:IGameComponent) {
	// TODO
	final infos = [
		for (info in getRuntimeText(ctx)) {
			final runtime = info.runtime;
			final text = info.text;
			final effects = text.getEffect(ctx, runtime);
			for (effect in effects) {
				switch cast(effect : MarkEffect) {
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
function getAttackSpeed(ctx:IGameComponent) {
	// TODO
	final infos = [
		for (info in getRuntimeText(ctx)) {
			final runtime = info.runtime;
			final text = info.text;
			final effects = text.getEffect(ctx, runtime);
			for (effect in effects) {
				switch cast(effect : MarkEffect) {
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

function isDestroyNow(ctx:IGameComponent, cardId:String, condition:{isByBattleDamage:Bool}):Bool {
	// cardId是否有破壞並廢棄的效果在堆疊中
	if (condition.isByBattleDamage) {}
	return false;
}

function removeDestroyEffect(ctx:IGameComponent, cardId:String):Void {
	trace("移除堆疊中的破壞效果");
}

function getEffectRuntime(ctx:IGameComponent, blockId:String):Runtime {
	final block = getEffect(ctx, blockId);
	return switch block.cause {
		case System(respnosePlayerId):
			new SystemRuntime(respnosePlayerId);
		case PlayCard(playCardPlayerId, cardId):
			new DefaultRuntime(cardId, playCardPlayerId);
		case PlayText(cardId, textId):
			final responsePlayerId = getCardControllerAndAssertExist(ctx, cardId);
			new DefaultRuntime(cardId, responsePlayerId);
		case TextEffect(cardId, textId):
			final responsePlayerId = getCardControllerAndAssertExist(ctx, cardId);
			new DefaultRuntime(cardId, responsePlayerId);
		case _:
			new AbstractRuntime();
	}
}

function hasSomeoneLiveIsZero(ctx:IGameComponent):Option<PlayerId> {
	return None;
}
