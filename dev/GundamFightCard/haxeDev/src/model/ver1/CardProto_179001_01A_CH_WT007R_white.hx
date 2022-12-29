package model.ver1;

import haxe.Exception;
import model.ver1.Define;
import tool.Helper;

// 179001_01A_CH_WT007R_white
// キラ・ヤマト
// 男性　子供　CO
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。

class CardProto_179001_01A_CH_WT007R_white_Text1_Mark1_Text extends CardText {
	public function new(removeMarkId: String) {
		super(getNextId(), "回合結束時刪除速攻");
		this.removeMarkId = removeMarkId;
	}

	public final removeMarkId:String;

	public override function getEffect(ctx:Context, runtime:ExecuteRuntime):Array<MarkEffect> {
		return [AttackSpeed(runtime.getCardId(), 1)];
	}

	public override function onEvent(ctx:Context, runtime:ExecuteRuntime):Void {
		switch ctx.phase {
			case Test("回合結束時"):
				ctx.marks.remove(removeMarkId);
			default:
		}
	}
}

class CardProto_179001_01A_CH_WT007R_white_Text1_Mark1 extends Mark {
	public function new(id:String, type:MarkType, cause:MarkCause) {
		super(id, type, cause);
	}

	public override function getEffect(ctx:Context, runtime:ExecuteRuntime):Array<MarkEffect> {
		return [Text(new CardProto_179001_01A_CH_WT007R_white_Text1_Mark1_Text(id))];
	}
}

class CardProto_179001_01A_CH_WT007R_white_Text1 extends CardText {
	public function new() {
		super(getNextId(), "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。");
	}

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		return [
			new RequirePhase(getNextId(), "（戦闘フェイズ）", Test("戦闘フェイズ")),
			new RequireG(getNextId(), "2", [Red, Red], ctx, runtime),
			new MarkTargetCard(getNextId(), "このセットグループのユニット", "cardId"),
		];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final unit = switch getUnitOfSetGroup(ctx, runtime.getCardId()) {
			case Some(cardId):
				cardId;
			case _:
				throw new haxe.Exception("機體找不到");
		}
		final mark = new CardProto_179001_01A_CH_WT007R_white_Text1_Mark1(getNextId(), AttachCard(unit), CardEffect(runtime.getCardId()));
		ctx.marks[mark.id] = mark;
	}
}

class CardProto_179001_01A_CH_WT007R_white extends AbstractCardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [new CardProto_179001_01A_CH_WT007R_white_Text1()];
	}
}
