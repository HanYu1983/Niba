package model.ver1.test.common;

import model.ver1.game.define.Define;

class EmptyText extends CardText {
	public function new(id:String) {
		super(id, "EmptyText");
	}
}

class OnlyEmptyTextCardProto extends CardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		return [new EmptyText('${thisCardId}_TestText')];
	}
}

class AddOneTextText extends CardText {
	public function new(id:String) {
		super(id, "AddOneTextText");
	}

	public override function getEffect(ctx:Context, runtime:ExecuteRuntime):Array<MarkEffect> {
		final thisCardId = runtime.getCardId();
		return [AddText(thisCardId, new EmptyText('${thisCardId}_EmptyText'))];
	}
}

class AddTextCardProto extends CardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		final thisCardId = runtime.getCardId();
		return [new AddOneTextText('${thisCardId}_TestText2')];
	}
}
