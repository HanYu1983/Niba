package model.ver1.game.component;

typedef CardState = {
	var ints:Map<String, Int>;
	var strings:Map<String, String>;
	var bools:Map<String, Bool>;
}

interface ICardStateComponent {
	var cardStates:Map<String, CardState>;
}

function getCardState(ctx:ICardStateComponent, cardId:String):CardState {
	final cardState = ctx.cardStates[cardId];
	if (cardState == null) {
		return {
			ints: [],
			strings: [],
			bools: [],
		}
	}
	return cardState;
}

function setCardState(ctx:ICardStateComponent, cardId:String, cardState:CardState) {
	ctx.cardStates[cardId] = cardState;
}
