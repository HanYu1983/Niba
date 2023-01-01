package model.ver1.data;

import haxe.Exception;
import tool.Helper;
import model.ver1.game.define.Define;
import model.ver1.game.define.Timing;
import model.ver1.game.alg.Context;
import model.ver1.game.alg.Cut;
import model.ver1.data.RequireImpl;

// 179030_11E_U_VT186R_purple
// R
// BF
// すーぱーふみな［†］
// ガンプラ　心形流　専用「サカイ・ミナト」
// クイック
// 『起動』：このカードが場に出た場合、このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。

class CardProto_179030_11E_U_VT186R_purple extends CardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [new PlayerPlayCard('${runtime.getCardId()}_PlayerPlayCard')];
	}
}

private class Text1 extends CardText {
	public function new(id:String) {
		super(id, "『起動』：このカードが場に出た場合、このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。");
	}

	public override function onEvent(ctx:Context, event:Event, runtime:ExecuteRuntime):Void {
		final thisCardId = runtime.getCardId();
		switch event {
			case EnterField(enterFieldCardId):
				if(enterFieldCardId == thisCardId){
					
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

	private function getKey1() {
		return '${id}_Text2_Req1';
	}

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		final gainCardSetGroupsIds = getCardSetGroupCardIds(ctx, gainCardId);
		final tips = [for (card in ctx.table.cards) card].filter(card -> {
			return gainCardSetGroupsIds.contains(card.id) == false && isMyCard(ctx, gainCardId, card.id);
		}).map(card -> card.id);
		final req = new RequireUserSelectCard(getKey1(), "そのカードのセットグループ以外の自軍ユニット１枚は");
		req.tips = tips;
		return [req];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final selectUnits = getPlayerSelectionCardId(ctx, getKey1());
		for (unit in selectUnits) {
			final mark = new Mark1('${id}_Mark1', gainCardId, {v1: gainValue, v2: gainValue, v3: gainValue});
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
