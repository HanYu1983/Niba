package model.ver1.game.gameComponent;

import model.ver1.game.define.Define;
import model.ver1.game.define.CardText;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Require;
import model.ver1.game.define.BaSyou;
import model.ver1.game.gameComponent.Alg;
import model.ver1.game.gameComponent.Event;
import model.ver1.game.gameComponent.GameComponent;

function flatSpecial(text:CardText):Array<CardText> {
	switch (text.type) {
		case Special(HighMobility):
			return [];
		case Special(PSArmor):
			return [new PSArmorText1(text.id), new PSArmorText2(text.id + "2")];
		case Special(Quick):
			// gen play card text
			return [];
		case _:
			return [text];
	}
}

abstract class GameCardText extends CardText {
	public function new(id:String, description:String) {
		super(id, description);
	}

	public override function onEvent(_ctx:Any, _event:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx : IGameComponent);
		final event = cast(_event : Event);
		this.onGameEvent(ctx, event, runtime);
	}

	abstract function onGameEvent(ctx:IGameComponent, event:Event, runtime:Runtime):Void;
}

class PSArmorText1 extends GameCardText {
	public function new(id:String) {
		super(id, "出場時直立");
		type = Automatic(Trigger);
	}

	public function onGameEvent(ctx:IGameComponent, event:Event, runtime:Runtime):Void {
		switch (event) {
			case CardEnter(cardId, baSyouKw, Play) if (isBa(baSyouKw) && cardId == runtime.getCardId()):
				rerollCard(ctx, cardId);
			case _:
		}
	}
}

class PSArmorText2 extends CardText {
	public function new(id:String) {
		super(id, " 進入戰場時, 下回合開始時回到手上, 當中如果和補給或供給能力的組到隊的話, 就不必回到手上");
		type = Automatic(Trigger);
	}

	public function onGameEvent(ctx:IGameComponent, event:Event, runtime:Runtime):Void {
		switch (event) {
			case CardEnter(cardId, baSyouKw, _) if (isBattleArea(baSyouKw) && cardId == runtime.getCardId()):
			// 加入下回合開始時回到手上的Mark
			case CardBecomeBattleGroup(cardId):
			// getBattleGroup
			// 刪除下回合開始時回到手上的Mark
			case PlayerEnterTurn(playerId) if (playerId == runtime.getResponsePlayerId()):
			// check mark and return
			case _:
		}
	}
}
