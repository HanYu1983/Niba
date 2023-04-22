package model.ver1.data;

import haxe.Exception;
import tool.Helper;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.Timing;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Block;
import model.ver1.game.define.Require;
import model.ver1.game.entity.Event;
import model.ver1.game.define.Player;
import model.ver1.game.define.CardText;
import model.ver1.game.define.CardProto;
import model.ver1.game.entity.Alg;
import model.ver1.game.component.Cut;
import model.ver1.data.RequireImpl;
import model.ver1.game.entity.Context;
import model.ver1.game.entity.DefaultMark;

// 179030_11E_U_VT186R_purple
// R
// BF
// すーぱーふみな［†］
// ガンプラ　心形流　専用「サカイ・ミナト」
// クイック
// 『起動』：このカードが場に出た場合、このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。

class CardProto_179030_11E_U_VT186R_purple extends CardProto {
	public function new() {
		super();
		this.category = Unit;
	}

	public override function getTexts(_ctx:Any, runtime:Runtime):Array<CardText> {
		return [
			new PlayerPlayCard('CardProto_179030_11E_U_VT186R_purple_1'),
			new Text1('CardProto_179030_11E_U_VT186R_purple_2')
		];
	}
}

private class Text1 extends CardText {
	public function new(id:String) {
		super(id, "『起動』：このカードが場に出た場合、このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。");
		type = Automatic(Trigger);
	}

	public override function onEvent(_ctx:Any, event:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx, Context);
		final thisCardId = runtime.getCardId();
		switch cast(event: Event) {
			case CardEnterField(enterFieldCardId):
				if (enterFieldCardId == thisCardId) {
					final block = new Block(getSubKey(0), TextEffect(thisCardId, id), new Process1('${id}_Process1'));
					block.isImmediate = true;
					cutIn(ctx, block);
				}
			case _:
		}
	}
}

private class RequireOpponentUnitsEnterFieldThisTurn extends RequireUserSelectCard {
	public function new(id:String, ctx:Context, runtime:Runtime) {
		super(id, "このターン中に場に出た敵軍ユニット１枚を");
		final thisCardId = runtime.getCardId();
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
		this.tips = unitsEnterFieldThisTurn;
	}
}

private class Process1 extends CardText {
	public function new(id:String) {
		super(id, "このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。");
	}

	public override function getRequires(_ctx:Any, runtime:Runtime):Array<Require> {
		final ctx = cast(_ctx, Context);
		return [new RequireOpponentUnitsEnterFieldThisTurn(getSubKey(0), ctx, runtime)];
	}

	public override function getRequires2(_ctx:Any, runtime:Runtime):Array<Require2> {
		final ctx = cast(_ctx, Context);
		return [getRequireOpponentUnitsEnterFieldThisTurn(ctx, runtime, getSubKey(0))];
	}

	public override function action(_ctx:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx, Context);
		final cardId = runtime.getCardId();
		final selectCardIds = getPlayerSelectionCardId(ctx, getSubKey(0));
		for (cardId in selectCardIds) {
			returnToOwnerHand(ctx, cardId);
		}
	}
}

function test() {
	final player1 = PlayerId.A;
	final player2 = PlayerId.B;
	final ctx = new Context();
	final player2Hand = new CardStack((Default(player2, TeHuTa) : BaSyouId));
	ctx.table.cardStacks[player2Hand.id] = player2Hand;
	trace("機體1在場");
	final card = new Card("1");
	card.owner = player1;
	card.protoId = "179030_11E_U_VT186R_purple";
	addCard(ctx.table, (Default(player1, MaintenanceArea) : BaSyouId), card);
	trace("機體2這回合剛出場");
	final card2 = new Card("2");
	card2.owner = player2;
	card2.protoId = "179030_11E_U_VT186R_purple";
	addCard(ctx.table, (Default(player2, MaintenanceArea) : BaSyouId), card2);
	trace("設置剛出場標記");
	final enterFieldMark = new EnterFieldThisTurnMark('EnterFieldThisTurnMark', card2.id);
	ctx.marks[enterFieldMark.id] = enterFieldMark;
	//
	if (getTopCut(ctx).length != 0) {
		throw "一開始堆疊中沒有效果";
	}
	trace("機體1出場事件");
	sendEvent(ctx, CardEnterField(card.id));
	if (getTopCut(ctx).length != 1) {
		throw "堆疊中必須有一個效果";
	}
	final block = getTopCut(ctx)[0];
	final runtime = new DefaultRuntime(card.id, player1);
	final requires = block.text.getRequires2(ctx, runtime);
	if (requires.length != 1) {
		throw "requires.length != 1";
	}
	final require = requires[0];
	final tips = switch require.type {
		case SelectCard(tips, lengthInclude):
			tips;
		case _:
			throw "must be SelectCard";
	}
	if (tips.length != 1) {
		throw "必須有一個可選機體";
	}
	trace("選擇要回手的一個敵機");
	setPlayerSelectionCardId(ctx, require.id, [tips[0].value]);
	trace("驗証支付");
	require.action();
	trace("解決效果");
	block.text.action(ctx, runtime);
	if (player2Hand.cardIds.length != 1) {
		throw "牌被移到手上";
	}
}
