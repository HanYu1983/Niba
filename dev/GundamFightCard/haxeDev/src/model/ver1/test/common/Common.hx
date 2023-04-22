package model.ver1.test.common;

import model.ver1.game.define.Define;
import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.CardText;
import model.ver1.game.define.CardProto;
import model.ver1.game.entity.Context;

class OnlyEmptyTextCardProto extends CardProto {
	public function new() {
		super();
	}

	public override function getTexts(_ctx:IContext, runtime:ExecuteRuntime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		return [new CardText('${thisCardId}_CardText', "")];
	}
}

class AddOneTextText extends CardText {
	public function new(id:String) {
		super(id, "AddOneTextText");
	}

	public override function getEffect(_ctx:IContext, runtime:ExecuteRuntime):Array<MarkEffect> {
		final thisCardId = runtime.getCardId();
		return [AddText(thisCardId, new CardText('${thisCardId}_EmptyText', ""))];
	}
}

class AddTextCardProto extends CardProto {
	public function new() {
		super();
	}

	public override function getTexts(_ctx:IContext, runtime:ExecuteRuntime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		return [new AddOneTextText('${thisCardId}_TestText2')];
	}
}

class OnlyConstentTextCardProto extends CardProto {
	public function new() {
		super();
	}

	public override function getTexts(_ctx:IContext, runtime:ExecuteRuntime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		final text = new CardText('${thisCardId}_TestText', "");
		text.type = Automatic(Constant);
		return [text];
	}
}
