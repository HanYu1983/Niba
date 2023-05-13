package model.ver1.game.component;

import haxe.ds.Option;
import tool.Flag;
import tool.Helper;
import model.ver1.game.define.Define;

typedef CardState = {
	var cardId:String;
	var damage:Int;
	var destroyReason:Option<DestroyReason>;
	var flag:Flag;
}

interface ICardStateComponent {
	var cardStates:Map<String, CardState>;
}

function getCardState(ctx:ICardStateComponent, cardId:String):CardState {
	final cardState = ctx.cardStates[cardId];
	if (cardState == null) {
		return {
			cardId: cardId,
			damage: 0,
			destroyReason: None,
			flag: createFlag(),
		}
	}
	return cast copy(cardState);
}

function setCardState(ctx:ICardStateComponent, cardId:String, cardState:CardState) {
	ctx.cardStates[cardId] = cardState;
}
