package model.ver1;

import model.ver1.game.Define;

private final CardProto1Text1Require1MarkFirstAttackId = "CardProto1Text1Require1MarkFirstAttackId";

// class CardTextFirstAttack extends CardText {
// 	public function new() {
// 		super("CardTextFirstAttack");
// 	}
// }

class RemoveFirstAttackWhenTurnEnd extends CardText {
	public function new() {
		super("RemoveFirstAttackWhenTurnEnd", "回合結束時刪除速攻");
	}

	public override function getEffect(ctx:Context, runtime:ExecuteRuntime):Array<MarkEffect> {
		return [AttackSpeed(runtime.getCardId(), 1)];
	}

	public override function onEvent(ctx:Context, runtime:ExecuteRuntime):Void {
		switch ctx.phase {
			case Test("回合結束時"):
				ctx.marks.remove(CardProto1Text1Require1MarkFirstAttackId);
			default:
		}
	}
}

private class CardProto1Text1Require1MarkFirstAttack extends Mark {
	public function new(ctx:Context, runtime:ExecuteRuntime) {
		super(CardProto1Text1Require1MarkFirstAttackId);
	}

	public override function getEffect(ctx:Context):Array<MarkEffect> {
		return [AddText("", new RemoveFirstAttackWhenTurnEnd())];
	}
}

class CardProto1Text1Require1 extends RequireUserSelect<String> {
	public function new(ctx:Context, runtime:ExecuteRuntime) {
		super("CardProto1Text1Require1", "CardProto1Text1Require1");
		this.tips = ["0", "1"];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		trace("支付");
	}
}

class CardProto1Text1 extends CardText {
	public function new() {
		super("CardProto1Text1", "獲得回合結束前速攻");
	}

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		return [new CardProto1Text1Require1(ctx, runtime)];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final mark = new CardProto1Text1Require1MarkFirstAttack(ctx, runtime);
		ctx.marks[mark.id] = mark;
	}
}

class CardProto1Text2 extends CardText {
	public function new() {
		super("CardProto1Text2", "+x/+x/+x. x為機體數量");
	}

	public override function getEffect(ctx:Context, runtime:ExecuteRuntime):Array<MarkEffect> {
		final x = 3;
		return [AddBattlePoint(runtime.getCardId(), {v1: x, v2: x, v3: x})];
	}
}

// class Mark1 extends Mark {
// 	public function new(ctx:Context, runtime:ExecuteRuntime) {
// 		super("獲得回合結束前速攻", AttachCard(runtime.getCardId()), CardText(runtime.getCardId()));
// 	}
// 	public override function getEffect(ctx:Context, runtime:ExecuteRuntime):Array<MarkEffect> {
// 		return [Text(new CardProto1Text1())];
// 	}
// }
// class Mark2 extends Mark {
// 	public function new(ctx:Context, runtime:ExecuteRuntime) {
// 		super("+x/+x/+x. x為機體數量", AttachCard(runtime.getCardId()), CardText(runtime.getCardId()));
// 	}
// 	public override function getEffect(ctx:Context, runtime:ExecuteRuntime):Array<MarkEffect> {
// 		final x = 3;
// 		return [AddBattlePoint(runtime.getCardId(), {v1: x, v2: x, v3: x})];
// 	}
// }

class CardProto1 extends AbstractCardProto {
	public function new() {}

	// public override function getMarkEffect(mark:Mark):Array<MarkEffect> {
	// 	return switch mark.id {
	// 		case CardProto1Text1Require1MarkFirstAttackId:
	// 			[MarkEffect.Text(new RemoveFirstAttackWhenTurnEnd())];
	// 		default:
	// 			[];
	// 	}
	// }
	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [new CardProto1Text1(), new CardProto1Text2()];
	}

	// public override function getMarks(ctx:Context, runtime:ExecuteRuntime):Array<Mark> {
	// 	return [new Mark1(ctx, runtime), new Mark2(ctx, runtime)];
	// }
}
