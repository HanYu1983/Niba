package model.ver1.game.define;

import model.ver1.game.define.Define;

enum EffectCause {
	Pending;
	System(respnosePlayerId:String);
	PlayCard(playerId:String, cardId:String);
	PlayText(cardId:String, textId:String);
	TextEffect(cardId:String, textId:String);
}

class Effect {
	public function new(id:String, cause:EffectCause, text:CardText) {
		this.id = id;
		this.cause = cause;
		this.text = text;
	}

	public var id:String;
	public var cause:EffectCause;
	public var text:CardText;
	public var isImmediate = false;
	public var isOption = false;
}