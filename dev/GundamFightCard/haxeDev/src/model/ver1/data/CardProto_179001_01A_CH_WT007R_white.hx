package model.ver1.data;

import haxe.Exception;
import tool.Table;
import tool.Helper;
import model.ver1.game.Define;
import model.ver1.game.Timing;
import model.ver1.game.Context;
import model.ver1.data.RequireImpl;
import model.ver1.alg.Alg;

// 179001_01A_CH_WT007R_white
// キラ・ヤマト
// 男性　子供　CO
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。
class CardProto_179001_01A_CH_WT007R_white extends CardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [new Text1('${runtime.getCardId()}_Text1')];
	}
}

private class Text1 extends CardText {
	public function new(id:String) {
		super(id, "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。");
	}

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		final unit = switch getUnitOfSetGroup(ctx, runtime.getCardId()) {
			case Some(cardId):
				cardId;
			case _:
				"unknown";
		}
		return [
			new RequirePhase('${id}_req1', Default(Battle, None, Free1)),
			new RequireGTap('${id}_req2', [Red, Red], ctx, runtime),
			new ForceTargetCard('${id}_req3', "このセットグループのユニット", "このセットグループのユニット", unit),
		];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final selectUnits = getPlayerSelectionCardId(ctx, "このセットグループのユニット");
		for (unit in selectUnits) {
			final mark = new Mark1('${id}_Mark1', unit);
			ctx.marks[mark.id] = mark;
		}
	}
}

private class Mark1 extends Mark {
	public function new(id:String, attachCardId:String) {
		super(id);
		this.attachCardId = attachCardId;
	}

	@:s public var attachCardId:String;

	public override function getEffect(ctx:Context):Array<MarkEffect> {
		return [AttackSpeed(attachCardId, 1)];
	}

	public override function onEvent(ctx:Context, event:Event):Void {
		switch event {
			case ChangePhase:
				switch ctx.timing {
					case Default(Battle, Some(End), End):
						ctx.marks.remove(id);
					default:
				}
			case _:
		}
	}
}

function test() {
	final ctx = new Context();
	final card1 = new Card("0");
	card1.protoId = "179001_01A_CH_WT007R_white";
	ctx.table.cards[card1.id] = card1;
	ctx.timing = Timing.Default(Battle, Some(Attack), Start);
	final infos = getRuntimeText(ctx).map(info -> {
		return {
			cardId: info.runtime.getCardId(),
			text: info.text,
			reqs: info.text.getRequires(ctx, info.runtime),
		}
	});
	trace(infos);
	if (infos.length == 0) {
		throw new haxe.Exception("infos.length == 0");
	}
	final selectTextId = infos[0].text.id;
	final findText = getRuntimeText(ctx).filter(info -> {
		return info.text.id == selectTextId;
	});
	if (findText.length == 0) {
		throw new haxe.Exception("findText not found");
	}
	{
		final text = findText[0].text;
		final runtime = findText[0].runtime;
		for (req in text.getRequires(ctx, runtime)) {
			req.action(ctx, runtime);
		}
		text.action(ctx, runtime);
	}
}
