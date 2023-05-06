package model.ver1.test.common;

import model.ver1.game.define.Define;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.CardText;
import model.ver1.game.define.CardProto;
import model.ver1.game.entity.Context;
import model.ver1.game.gameComponent.MarkEffect;
import model.ver1.game.gameComponent.GameCardProto;
import model.ver1.game.gameComponent.GameCardText;
import model.ver1.game.gameComponent.GameComponent;
import model.ver1.game.gameComponent.PlayRule;

class OnlyEmptyTextCardProto extends GameCardProto {
	public override function _getTexts(ctx:IGameComponent, runtime:Runtime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		return [new CardText('${thisCardId}_CardText', "", System)];
	}
}

class AddOneTextText extends GameCardText {
	public function new(id:String) {
		super(id, "AddOneTextText", System);
	}

	public override function _getEffect(ctx:IGameComponent, runtime:Runtime):Array<Any> {
		final thisCardId = runtime.getCardId();
		return [AddText(thisCardId, new CardText('${thisCardId}_EmptyText', "", System))];
	}
}

class AddTextCardProto extends GameCardProto {
	public override function _getTexts(ctx:IGameComponent, runtime:Runtime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		return [new AddOneTextText('${thisCardId}_TestText2')];
	}
}

class OnlyConstentTextCardProto extends GameCardProto {
	public override function _getTexts(ctx:IGameComponent, runtime:Runtime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		final text = new CardText('${thisCardId}_TestText', "", Automatic(Constant));
		return [text];
	}
}

class OnlyPlayGRuleCardProto extends GameCardProto {
	public override function _getTexts(ctx:IGameComponent, runtime:Runtime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		return [new PlayGRule("playG")];
	}
}