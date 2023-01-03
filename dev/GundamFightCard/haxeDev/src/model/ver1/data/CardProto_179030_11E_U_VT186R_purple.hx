package model.ver1.data;

import haxe.Exception;
import tool.Helper;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.Timing;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.ExecuteRuntimeImpl;
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
		type = Automatic(Trigger);
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
					final block = new Block(getSubKey(0), TextEffect(thisCardId, id), new Process1('${id}_Process1', unitsEnterFieldThisTurn));
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

function test() {
	final player1 = "player1";
	final player2 = "player2";
	final ctx = new Context();
	final player2Hand = new CardStack(getCardStackId(Default(player2, TeHuTa)));
	ctx.table.cardStacks[player2Hand.id] = player2Hand;
	trace("機體1在場");
	final card = new Card("1");
	card.owner = player1;
	card.protoId = "179030_11E_U_VT186R_purple";
	addCard(ctx.table, getCardStackId(Default(player1, MaintenanceArea)), card);
	trace("機體2這回合剛出場");
	final card2 = new Card("2");
	card2.owner = player2;
	card2.protoId = "179030_11E_U_VT186R_purple";
	addCard(ctx.table, getCardStackId(Default(player2, MaintenanceArea)), card2);
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
	final runtime = new DefaultExecuteRuntime(player1, card.id);
	final requires = block.text.getRequires(ctx, runtime);
	if (requires.length != 1) {
		throw "requires.length != 1";
	}
	final require:RequireUserSelectCard = cast requires[0];
	if (require.tips.length != 1) {
		throw "必須有一個可選機體";
	}
	trace("選擇要回手的一個敵機");
	setPlayerSelectionCardId(ctx, require.id, [require.tips[0]]);
	trace("驗証支付");
	require.action(ctx);
	trace("解決效果");
	block.text.action(ctx, runtime);
	if (player2Hand.cardIds.length != 1) {
		throw "牌被移到手上";
	}
}
