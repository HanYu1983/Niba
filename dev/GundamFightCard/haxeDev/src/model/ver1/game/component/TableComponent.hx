package model.ver1.game.component;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.BaSyou;

interface ITableComponent {
	var table:Table;
}

function getCard(ctx:ITableComponent, cardId:String):Card {
	return tool.Table.getCard(ctx.table, cardId);
}

function getCards(ctx:ITableComponent):Array<Card>{
	return tool.Table.getCards(ctx.table);
}

function moveCard(ctx:ITableComponent, cardId:String, from:BaSyou, to:BaSyou) {
	tool.Table.moveCard(ctx.table, cardId, (from : BaSyouId), (to : BaSyouId));
}

function rollCard(ctx:ITableComponent, cardId:String):Void {
	final card = getCard(ctx, cardId);
	if (card.isTap) {
		throw new haxe.Exception("already tap");
	}
	card.isTap = true;
}

function rerollCard(ctx:ITableComponent, cardId:String):Void {
	final card = getCard(ctx, cardId);
	if (card.isTap == false) {
		throw new haxe.Exception("already reroll");
	}
	card.isTap = false;
}

function getCardOwner(ctx:ITableComponent, cardId:String):String {
	final owner = getCard(ctx, cardId).owner;
	if (owner == null) {
		throw "owner not set yet";
	}
	return owner;
}

function getCardsByOwner(ctx:ITableComponent, owner:String):Array<Card> {
	return tool.Table.getCards(ctx.table).filter(card -> card.owner == owner);
}

function getCardBaSyouAndAssertExist(ctx:ITableComponent, cardId:String):BaSyou {
	return switch tool.Table.getCardCardStack(ctx.table, cardId) {
		case Some(cardStack):
			(cardStack.id : BaSyouId);
		case _:
			trace(ctx);
			throw new haxe.Exception('card baSyou not found: ${cardId}');
	}
}

function returnToOwnerHand(ctx:ITableComponent, cardId:String):Void {
	final from = getCardBaSyouAndAssertExist(ctx, cardId);
	final to = BaSyou.Default(getCardOwner(ctx, cardId), TeHuTa);
	moveCard(ctx, cardId, from, to);
}

function getCardIdsByBaSyou(ctx:ITableComponent, baSyou:BaSyou):Array<String> {
	return getCardStack(ctx.table, (baSyou : BaSyouId)).cardIds;
}

// p.63
// 手札、ハンガー中的卡沒有控制者，但有Play的權利
// 本国、捨て山、ジャンクヤード中的卡沒有控制者
// 沒有控制者的情況也就代表不能使用內文也不能出擊
function getCardController(ctx:ITableComponent, cardId:String):Option<String> {
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

function getCardControllerAndAssertExist(ctx:ITableComponent, cardId:String):String {
	return switch getCardController(ctx, cardId) {
		case Some(playerId): playerId;
		case _: throw new haxe.Exception("卡片被除外，沒有控制者");
	}
}

// (p.63) 自軍カードが
function isMyCard(ctx:ITableComponent, masterCardId:String, slaveCardId:String):Bool {
	return switch [getCardController(ctx, masterCardId), getCardController(ctx, slaveCardId)] {
		case [Some(c1), Some(c2)] if (c1 == c2):
			true;
		case _:
			false;
	}
}

function isOpponentsCard(ctx:ITableComponent, masterCardId:String, slaveCardId:String):Bool {
	return switch [getCardController(ctx, masterCardId), getCardController(ctx, slaveCardId)] {
		case [Some(c1), Some(c2)] if (c1 != c2):
			true;
		case _:
			false;
	}
}

function isCardBySyouIn(ctx:ITableComponent, baSyous:Array<BaSyou>):(card:Card)->Bool {
	return (card:Card) -> {
		return false;
	}
}