package tool;

import haxe.ds.Option;

class Card {
	public function new(id:String) {
		this.id = id;
	}

	public var id:String;
	public var isFaceUp = false;
	public var isTap = false;
	public var isReverse = false;
	public var protoId:Null<String>;
	public var owner:Null<String>;
}

class CardStack {
	public function new(id:String) {
		this.id = id;
	}

	public var id:String;
	public var cardIds:Array<String> = [];
}

class Table {
	public function new() {}

	public var cards:Map<String, Card> = [];
	public var cardStacks:Map<String, CardStack> = [];
}

function addCard(table:Table, cardStackId:String, card:Card):Void {
	if (table.cards[card.id] != null) {
		throw new haxe.Exception('card key already exist. ${card.id}');
	}
	if (table.cardStacks[cardStackId] == null) {
		table.cardStacks[cardStackId] = new CardStack(cardStackId);
	}
	table.cards[card.id] = card;
	table.cardStacks[cardStackId].cardIds.push(card.id);
}

function getCard(table:Table, cardId:String):Card {
	final card = table.cards[cardId];
	if (card == null) {
		throw new haxe.Exception('card not found: ${cardId}');
	}
	return card;
}

function getCardStack(table:Table, cardStackId:String):CardStack {
	final ret = table.cardStacks[cardStackId];
	if (ret == null) {
		throw new haxe.Exception('cardStack not found: ${cardStackId}');
	}
	return ret;
}

function getCardCardStack(table:Table, cardId:String):Option<CardStack> {
	final findCs = [for (cs in table.cardStacks) cs].filter(cs -> cs.cardIds.contains(cardId));
	if (findCs.length == 0) {
		return None;
	}
	return Some(findCs[0]);
}

function moveCard(table:Table, cardId:String, fromId:String, toId:String):Void {
	if (getCardStack(table, fromId).cardIds.contains(cardId) == false) {
		throw new haxe.Exception('card not found: ${fromId} > ${cardId}');
	}
	getCardStack(table, fromId).cardIds.remove(cardId);
	getCardStack(table, toId).cardIds.push(cardId);
}
