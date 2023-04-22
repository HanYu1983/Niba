package model.ver1.data;

import haxe.Exception;
import tool.Table;
import tool.Helper;
import model.ver1.game.define.Define;
import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Block;
import model.ver1.game.define.Require;
import model.ver1.game.define.Event;
import model.ver1.game.define.Player;
import model.ver1.game.define.CardText;
import model.ver1.game.define.CardProto;
import model.ver1.game.alg.Context;
import model.ver1.game.alg.Runtime;
import model.ver1.game.define.Event;
import model.ver1.data.RequireImpl;
import model.ver1.data.PlayerPlayCard;
import model.ver1.game.entity.Context;
import model.ver1.game.entity.DefaultMark;

// 179001_01A_CH_WT007R_white
// キラ・ヤマト
// 男性　子供　CO
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。
class CardProto_179001_01A_CH_WT007R_white extends CardProto {
	public function new() {
		super();
	}

	public override function getTexts(_ctx:IContext, runtime:ExecuteRuntime):Array<CardText> {
		return [
			new PlayerPlayCard('${runtime.getCardId()}_PlayerPlayCard'),
			new Text1('${runtime.getCardId()}_Text1')
		];
	}
}

private class Text1 extends CardText {
	public function new(id:String) {
		super(id, "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。");
		type = Use;
	}

	public override function getRequires(_ctx:IContext, runtime:ExecuteRuntime):Array<Require> {
		final ctx = cast(_ctx, Context);
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

	public override function action(_ctx:IContext, runtime:ExecuteRuntime):Void {
		final ctx = cast(_ctx, Context);
		final selectUnits = getPlayerSelectionCardId(ctx, "このセットグループのユニット");
		for (unit in selectUnits) {
			final mark = new Mark1('${id}_Mark1', unit);
			ctx.marks[mark.id] = mark;
		}
	}
}

private class Mark1 extends DefaultMark {
	public function new(id:String, attachCardId:String) {
		super(id);
		this.attachCardId = attachCardId;
	}

	@:s public var attachCardId:String;

	public override function getEffect(_ctx:IContext):Array<MarkEffect> {
		return [AttackSpeed(attachCardId, 1)];
	}

	public override function onEvent(_ctx:IContext, event:Event):Void {
		final ctx = cast(_ctx, Context);
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
