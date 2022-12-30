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

class CardProto_179004_01A_CH_WT009R_white extends AbstractCardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [];
	}
}

private class Text1 extends CardText {
	public function new(id:String) {
		super(id, "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。");
	}

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		return [];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {

	}

	public override function onEvent(ctx:Context, runtime:ExecuteRuntime):Void {
		
	}
}