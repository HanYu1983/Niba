package model.ver1.test.common;

import model.ver1.game.define.Define;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.CardText;
import model.ver1.game.define.CardProto;
import model.ver1.game.entity.Context;
import model.ver1.game.gameComponent.MarkEffect;

class OnlyEmptyTextCardProto extends CardProto {
	public override function getTexts(_ctx:Any, runtime:Runtime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		return [new CardText('${thisCardId}_CardText', "", System)];
	}
}

class AddOneTextText extends CardText {
	public function new(id:String) {
		super(id, "AddOneTextText", System);
	}

	public override function getEffect(_ctx:Any, runtime:Runtime):Array<Any> {
		final thisCardId = runtime.getCardId();
		return [AddText(thisCardId, new CardText('${thisCardId}_EmptyText', "", System))];
	}
}

class AddTextCardProto extends CardProto {
	public override function getTexts(_ctx:Any, runtime:Runtime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		return [new AddOneTextText('${thisCardId}_TestText2')];
	}
}

class OnlyConstentTextCardProto extends CardProto {
	public override function getTexts(_ctx:Any, runtime:Runtime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		final text = new CardText('${thisCardId}_TestText', "", Automatic(Constant));
		return [text];
	}
}
