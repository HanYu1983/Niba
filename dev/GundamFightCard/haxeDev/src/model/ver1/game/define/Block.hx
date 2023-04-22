package model.ver1.game.define;

import model.ver1.game.define.Define;

enum BlockCause {
	Pending;
	System(respnosePlayerId:String);
	PlayCard(playerId:String, cardId:String);
	PlayText(cardId:String, textId:String);
	TextEffect(cardId:String, textId:String);
}

class Block {
	public function new(id:String, cause:BlockCause, text:CardText) {
		this.id = id;
		this.cause = cause;
		this.text = text;
	}

	public var id:String;
	public var cause:BlockCause;
	public var text:CardText;
	public var isImmediate = false;
	public var isOption = false;
}