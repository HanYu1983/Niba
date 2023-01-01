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
	public function new() {
		this.category = Unit;
	}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [
			new PlayerPlayCard('${runtime.getCardId()}_PlayerPlayCard'),
			new Text1('${runtime.getCardId()}_Text1')
		];
	}
}

private class Text1 extends CardText {
	public function new(id:String) {
		super(id, "『起動』：このカードが場に出た場合、このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。");
	}

	public override function onEvent(ctx:Context, event:Event, runtime:ExecuteRuntime):Void {
		final thisCardId = runtime.getCardId();
		switch event {
			case CardEnterField(enterFieldCardId):
				if (enterFieldCardId == thisCardId) {
					final unitsEnterFieldThisTurn = getEnterFieldThisTurnCardIds(ctx).filter(cardId -> {
						return switch getCardEntityCategory(ctx, cardId) {
							case Some(Unit):
								true;
							case _:
								false;
						}
					}).filter(cardId -> {
						return isOpponentsCard(ctx, thisCardId, cardId);
					});
					final block = new Block('${id}_${Date.now()}', TextEffect(thisCardId, id), new Process1('${id}_Process1', unitsEnterFieldThisTurn));
					block.isImmediate = true;
					cutIn(ctx, block);
				}
			case _:
		}
	}
}

private class Process1 extends CardText {
	public function new(id:String, cardIds:Array<String>) {
		super(id, "このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。");
		this.cardIds = cardIds;
	}

	@:s public var cardIds:Array<String>;

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		final req = new RequireUserSelectCard(getSubKey(0), "このターン中に場に出た敵軍ユニット１枚");
		req.tips = cardIds;
		return [req];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final cardId = runtime.getCardId();
		final selectCardIds = getPlayerSelectionCardId(ctx, getSubKey(0));
		for (cardId in selectCardIds) {
			returnToOwnerHand(ctx, cardId);
		}
	}
}
