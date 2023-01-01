package model.ver1.test.common;

import model.ver1.game.define.Define;

class OnlyEmptyTextCardProto extends CardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		return [new CardText('${thisCardId}_CardText', "")];
	}
}

class AddOneTextText extends CardText {
	public function new(id:String) {
		super(id, "AddOneTextText");
	}

	public override function getEffect(ctx:Context, runtime:ExecuteRuntime):Array<MarkEffect> {
		final thisCardId = runtime.getCardId();
		return [AddText(thisCardId, new CardText('${thisCardId}_EmptyText', ""))];
	}
}

class AddTextCardProto extends CardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		return [new AddOneTextText('${thisCardId}_TestText2')];
	}
}

class OnlyConstentTextCardProto extends CardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		final text = new CardText('${thisCardId}_TestText', "");
		text.type = Automatic(Constant);
		return [text];
	}
}
