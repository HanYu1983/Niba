package model.ver1.data;

import haxe.Exception;
import tool.Helper;
import model.ver1.game.define.Define;
import model.ver1.game.define.Timing;
import model.ver1.game.alg.Context;
import model.ver1.game.alg.Cut;
import model.ver1.data.RequireImpl;

// 179004_01A_CH_WT009R_white
// ラクス・クライン
// 女性　子供　CO
// 【ステイ】　〔１〕：ゲイン　〔１〕：供給
// 『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。

class CardProto_179004_01A_CH_WT009R_white extends CardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [
			new PlayerPlayCard('${runtime.getCardId()}_PlayerPlayCard'),
			new Text1('${runtime.getCardId()}_Text1')
		];
	}
}

private class Text1 extends CardText {
	public function new(id:String) {
		super(id, "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。");
		type = Automatic(Trigger);
	}

	public override function onEvent(ctx:Context, event:Event, runtime:ExecuteRuntime):Void {
		final thisCardId = runtime.getCardId();
		switch event {
			case Gain(gainCardId, gainValue):
				if (isMyCard(ctx, thisCardId, gainCardId)) {
					final block = new Block('${id}_${Date.now()}', TextEffect(thisCardId, id), new Text1_1('${id}_Text1_1', gainCardId, gainValue));
					block.isImmediate = true;
					cutIn(ctx, block);
				}
			case _:
		}
	}
}

private class Text1_1 extends CardText {
	public function new(id:String, gainCardId:String, gainValue:Int) {
		super(id, "そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。");
		this.gainCardId = gainCardId;
		this.gainValue = gainValue;
	}

	@:s public var gainCardId:String;
	@:s public var gainValue:Int;

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		final gainCardSetGroupsIds = getCardSetGroupCardIds(ctx, gainCardId);
		final tips = [for (card in ctx.table.cards) card].filter(card -> {
			return gainCardSetGroupsIds.contains(card.id) == false && isMyCard(ctx, gainCardId, card.id);
		}).map(card -> card.id);
		final req = new RequireUserSelectCard(getSubKey(0), "そのカードのセットグループ以外の自軍ユニット１枚は");
		req.tips = tips;
		return [req];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final selectUnits = getPlayerSelectionCardId(ctx, getSubKey(0));
		for (unit in selectUnits) {
			final mark = new Mark1('${id}_Mark1', gainCardId, Default(gainValue, gainValue, gainValue));
			ctx.marks[mark.id] = mark;
		}
	}
}

private class Mark1 extends Mark {
	public function new(id:String, attachCardId:String, battlePoint:BattlePoint) {
		super(id);
		this.attachCardId = attachCardId;
		this.battlePoint = battlePoint;
	}

	@:s public var attachCardId:String;
	@:s public var battlePoint:BattlePoint;

	public override function getEffect(ctx:Context):Array<MarkEffect> {
		return [AddBattlePoint(attachCardId, battlePoint)];
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
