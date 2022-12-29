package model.ver1;

import haxe.Exception;
import model.ver1.Define;
import tool.Helper;

// 179001_01A_CH_WT007R_white
// キラ・ヤマト
// 男性　子供　CO
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。
class CardProto_179001_01A_CH_WT007R_white extends AbstractCardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [
			new CardProto_179001_01A_CH_WT007R_white_Text1('${runtime.getCardId()}_CardProto_179001_01A_CH_WT007R_white_Text1')
		];
	}
}

class CardProto_179001_01A_CH_WT007R_white_Text1 extends CardText {
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
			new RequirePhase('${id}_CardProto_179001_01A_CH_WT007R_white_Text1_Req1', "（戦闘フェイズ）", Test("戦闘フェイズ")),
			new RequireG('${id}_CardProto_179001_01A_CH_WT007R_white_Text1_Req2', "2", [Red, Red], ctx, runtime),
			new ForceTargetCard('${id}_CardProto_179001_01A_CH_WT007R_white_Text1_Req3', "このセットグループのユニット", "このセットグループのユニット", unit),
		];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final selectUnits = ctx.memory.playerSelection.cardIds["このセットグループのユニット"];
		if (selectUnits == null) {
			throw new haxe.Exception("selectUnits not found");
		}
		for (unit in selectUnits) {
			final mark = new CardProto_179001_01A_CH_WT007R_white_Text1_Mark1('${id}_CardProto_179001_01A_CH_WT007R_white_Text1_Mark1', unit);
			ctx.marks[mark.id] = mark;
		}
	}
}

class CardProto_179001_01A_CH_WT007R_white_Text1_Mark1 extends Mark {
	public function new(id:String, attachCardId:String) {
		super(id);
		this.attachCardId = attachCardId;
	}

	@:s public var attachCardId:String;

	public override function getEffect(ctx:Context):Array<MarkEffect> {
		return [
			AddText(attachCardId, new CardProto_179001_01A_CH_WT007R_white_Text1_Mark1_Text('${id}CardProto_179001_01A_CH_WT007R_white_Text1_Mark1_Text', id))
		];
	}
}

class CardProto_179001_01A_CH_WT007R_white_Text1_Mark1_Text extends CardText {
	public function new(id:String, removeMarkId:String) {
		super(id, "回合結束時刪除速攻");
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

function test() {
	final ctx = new Context();
	final card1 = new Card("0");
	card1.protoId = "179001_01A_CH_WT007R_white";
	ctx.table.cards[card1.id] = card1;
	ctx.phase = Test("戦闘フェイズ");
	final playerId = "0";
	final infos = getRuntimeText(ctx, playerId).map(info->{
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
	final playerId = "0";
	final findText = getRuntimeText(ctx, playerId).filter(info -> {
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
