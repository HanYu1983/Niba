package model.ver1;

import model.ver1.Define;

private final CardProto1Text1Require1MarkFirstAttck = "CardProto1Text1Require1MarkFirstAttck";

class CardProto1Text1Require1 extends RequireUserSelect<String> {
	public function new(ctx:Context, runtime:ExecuteRuntime) {
		super("獲得回合結束前速攻");
		this.tips = ["0", "1"];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final mark = new Mark(CardProto1Text1Require1MarkFirstAttck);
		mark.type = AttachCard(runtime.getCardId());
		mark.cause = CardEffect(runtime.getCardId());
		ctx.marks[mark.id] = mark;
	}
}

class CardProto1Text1 extends CardText {
	public function new() {
        super("CardProto1Text1");
    }

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		return [new CardProto1Text1Require1(ctx, runtime)];
	}
}

class CardProto1Text1_1 extends CardText {
	public function new() {
        super("速攻");
	}

	public override function onEvent(ctx:Context, runtime:ExecuteRuntime):Void {
		switch ctx.phase {
			case Test("回合結束時"):
				ctx.marks.remove(CardProto1Text1Require1MarkFirstAttck);
			default:
		}
	}
}

class CardProto1 extends AbstractCardProto {
	public function new() {}

	public override function getMarkEffect(mark:Mark):Array<MarkEffect> {
		return switch mark.id {
			case CardProto1Text1Require1MarkFirstAttck:
				[MarkEffect.Text(new CardProto1Text1_1())];
			default:
				[];
		}
	}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [new CardProto1Text1()];
	}
}
