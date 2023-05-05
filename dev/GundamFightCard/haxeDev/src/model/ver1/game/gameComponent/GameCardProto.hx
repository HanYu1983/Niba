package model.ver1.game.gameComponent;

import model.ver1.game.define.Define;
import model.ver1.game.define.CardText;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Require;
import model.ver1.game.define.CardProto;
import model.ver1.game.gameComponent.GameComponent;

class GameCardProto extends CardProto {
	public override function getTexts(_ctx:Any, runtime:Runtime):Array<CardText> {
		final ctx = cast(_ctx : IGameComponent);
		return getGameTexts(ctx, runtime);
	}

	function getGameTexts(ctx:IGameComponent, runtime:Runtime):Array<CardText> {
		return [];
	}
}
