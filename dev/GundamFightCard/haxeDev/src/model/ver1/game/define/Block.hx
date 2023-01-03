package model.ver1.game.define;

import model.ver1.game.define.Define;

enum BlockCause {
	Pending;
	System(respnosePlayerId:String);
	PlayCard(playerId:String, cardId:String);
	PlayText(cardId:String, textId:String);
	TextEffect(cardId:String, textId:String);
}

class Block implements hxbit.Serializable {
	public function new(id:String, cause:BlockCause, text:CardText) {
		this.id = id;
		this.cause = cause;
		this.text = text;
	}

	@:s public var id:String;
	@:s public var cause:BlockCause;
	@:s public var text:CardText;
	@:s public var isImmediate = false;
}