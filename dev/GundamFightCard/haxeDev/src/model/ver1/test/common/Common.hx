package model.ver1.test.common;

import model.ver1.game.define.Define;
import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.define.Mark;
import model.ver1.game.entity.Context;
import model.ver1.game.entity.MarkEffect;
import model.ver1.game.entity.DefaultCardProto;
import model.ver1.game.entity.DefaultCardText;

class OnlyEmptyTextCardProto extends DefaultCardProto {
	public function new() {
		super();
	}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<DefaultCardText> {
		final thisCardId = runtime.getCardId();
		return [new CardText('${thisCardId}_CardText', "")];
	}
}

class AddOneTextText extends DefaultCardText {
	public function new(id:String) {
		super(id, "AddOneTextText");
	}

	public override function getEffect(ctx:Context, runtime:ExecuteRuntime):Array<MarkEffect> {
		final thisCardId = runtime.getCardId();
		return [AddText(thisCardId, new CardText('${thisCardId}_EmptyText', ""))];
	}
}

class AddTextCardProto extends DefaultCardProto {
	public function new() {
		super();
	}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<DefaultCardText> {
		final thisCardId = runtime.getCardId();
		return [new AddOneTextText('${thisCardId}_TestText2')];
	}
}

class OnlyConstentTextCardProto extends DefaultCardProto {
	public function new() {
		super();
	}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<DefaultCardText> {
		final thisCardId = runtime.getCardId();
		final text = new CardText('${thisCardId}_TestText', "");
		text.type = Automatic(Constant);
		return [text];
	}
}
