package model.ver1.data;

import haxe.Exception;
import tool.Helper;
import model.ver1.game.Define;
import model.ver1.game.Require;
import model.ver1.alg.Alg;

// 179004_01A_CH_WT009R_white
// ラクス・クライン
// 女性　子供　CO
// 【ステイ】　〔１〕：ゲイン　〔１〕：供給
// 『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。

class CardProto_179004_01A_CH_WT009R_white extends CardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [];
	}
}

private class Text1 extends CardText {
	public function new(id:String) {
		super(id, "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。");
	}

	public override function onEvent(ctx:Context, event:Event, runtime:ExecuteRuntime):Void {
		final thisCardId = runtime.getCardId();
		switch event {
			case Gain(gainCardId, gainValue):
				if (isMyCard(ctx, thisCardId, gainCardId)) {
					ctx.immediateStack.push(new Block('${id}_${Date.now()}', TextEffect(thisCardId, id), new Text2('${id}_Text2', gainCardId, gainValue)));
				}
			case _:
		}
	}
}

private class Text2 extends CardText {
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
		final req = new RequireUserSelect<String>('${id}_Text2_Req1', "そのカードのセットグループ以外の自軍ユニット１枚は");
		req.tips = tips;
		req.lengthInclude = [1];
		return [req];
	}
}
