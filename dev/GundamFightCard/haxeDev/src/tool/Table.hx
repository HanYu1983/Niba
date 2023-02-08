package tool;

import haxe.ds.Option;

// Option<String> or 泛型不能被Serializable
class Card implements hxbit.Serializable {
	public function new(id:String) {
		this.id = id;
	}

	@:s public var id:String;
	@:s public var isFaceUp = false;
	@:s public var isTap = false;
	@:s public var isReverse = false;
	@:s public var protoId:Null<String>;
	@:s public var owner:Null<String>;
}

class CardStack implements hxbit.Serializable {
	public function new(id:String) {
		this.id = id;
	}

	@:s public var id:String;
	@:s public var cardIds:Array<String> = [];
}

class Table implements hxbit.Serializable {
	public function new() {}

	@:s public var cards:Map<String, Card> = [];
	@:s public var cardStacks:Map<String, CardStack> = [];
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
