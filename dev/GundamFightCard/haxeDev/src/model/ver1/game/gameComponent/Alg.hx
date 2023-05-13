package model.ver1.game.gameComponent;

using Lambda;

import haxe.ds.Option;
import model.ver1.game.define.Define;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Player;
import model.ver1.game.define.Require;
import model.ver1.game.component.CardProtoPoolComponent;
import model.ver1.game.component.EffectComponent;
import model.ver1.game.component.MarkComponent;
import model.ver1.game.component.TableComponent;
import model.ver1.game.gameComponent.Event;
import model.ver1.game.gameComponent.Runtime;
import model.ver1.game.gameComponent.MarkEffect;
import model.ver1.game.gameComponent.GameComponent;

function createRequireRollCost(rollcost:RollCost, options:{}):Require2 {
	return {
		id: "createRequireRollCost",
		description: "roll cost",
		type: SelectCard([], [1]),
		player: You,
		action: () -> {
			// move card to playcardzone
		},
	}
}

//
// General
//
// 持ち主の手札に移す

function becomeG(ctx:IGameComponent, cardId:String):Void {
	trace("將自己變成G");
}

function getUnitOfSetGroup(ctx:IGameComponent, cardId:String):Option<String> {
	return None;
}

function rollCard(ctx:IGameComponent, cardId:String, options:{sendEvent:Bool}):Void {
	model.ver1.game.component.TableComponent.rollCard(ctx, cardId);
	if (options.sendEvent) {
		sendEvent(ctx, CardRoll(cardId));
	}
}

function rerollCard(ctx:IGameComponent, cardId:String, options:{sendEvent:Bool}):Void {
	model.ver1.game.component.TableComponent.rerollCard(ctx, cardId);
	if (options.sendEvent) {
		sendEvent(ctx, CardReroll(cardId));
	}
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

function getCardType(ctx:IGameComponent, cardId:String):CardCategory {
	final proto = getCurrentCardProto(ctx, getCard(ctx, cardId).protoId);
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
