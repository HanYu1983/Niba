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

// 179030_11E_CH_BN091N_brown
// N
// ∀
// ポゥ・エイジ
// 女性　大人
// 『起動』：このカードがロールした場合、敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。

class CardProto_179030_11E_CH_BN091N_brown extends CardProto {
	public function new() {
		this.category = Character;
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
		super(id, "『起動』：このカードがロールした場合、敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。");
		type = Automatic(Trigger);
	}

	public override function onEvent(ctx:Context, event:Event, runtime:ExecuteRuntime):Void {
		final thisCardId = runtime.getCardId();
		final responsePlayerId = runtime.getResponsePlayerId();
		final opponentPlayerId = getOpponentPlayerId(ctx, responsePlayerId);
		switch event {
			case CardRoll(rollCardId):
				if (rollCardId == thisCardId) {
					final unitIds = [for (card in ctx.table.cards) card].map(card -> card.id).filter(cardId -> {
						return switch getCardEntityCategory(ctx, cardId) {
							case Some(G):
								true;
							case _:
								false;
						}
					}).filter(cardId -> {
						return getCardOwner(ctx, cardId) == opponentPlayerId;
					});
					if (unitIds.length >= 1) {
						final block = new Block(getSubKey(0), TextEffect(thisCardId, id), new Process1('${id}_Process1', unitIds));
						block.isImmediate = true;
						cutIn(ctx, block);
					}
				}
			case _:
		}
	}
}

private class Process1 extends CardText {
	public function new(id:String, tips:Array<String>) {
		super(id, "敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。");
		this.tips = tips;
	}

	@:s public var tips:Array<String>;

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		final req = new RequireUserSelectCard(getSubKey(0), "敵軍G１枚");
		req.tips = tips;
		return [req];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final thisCardId = runtime.getCardId();
		final selectUnits = getPlayerSelectionCardId(ctx, getSubKey(0));
		for (unit in selectUnits) {
			tapCard(ctx, unit);
		}
		for (cardId in getThisCardSetGroupCardIds(ctx, thisCardId)) {
			final mark = new CanNotRerollMark(getSubKey(0), cardId);
			mark.age = 2;
			ctx.marks[mark.id] = mark;
		}
	}
}

function test() {
	final player1 = PLAYER_A;
	final player2 = PLAYER_B;
	final ctx = new Context();
	final player2Hand = new CardStack(getCardStackId(Default(player2, TeHuTa)));
	ctx.table.cardStacks[player2Hand.id] = player2Hand;
	trace("卡牌1在場");
	final card = new Card("1");
	card.owner = player1;
	card.protoId = "179030_11E_CH_BN091N_brown";
	addCard(ctx.table, getCardStackId(Default(player1, MaintenanceArea)), card);
	trace("敵軍G在場");
	final card2 = new Card("2");
	card2.owner = player2;
	card2.protoId = "179030_11E_CH_BN091N_brown";
	card2.isTap = false;
	addCard(ctx.table, getCardStackId(Default(player2, GZone)), card2);
	//
	if (getTopCut(ctx).length != 0) {
		throw "一開始堆疊中沒有效果";
	}
	trace("卡牌横置");
	sendEvent(ctx, CardRoll(card.id));
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
		throw "必須有一個可選G";
	}
	trace("選擇");
	setPlayerSelectionCardId(ctx, require.id, [require.tips[0]]);
	trace("驗証支付");
	require.action(ctx);
	trace("解決效果");
	block.text.action(ctx, runtime);
	if (card2.isTap != true) {
		throw "牌必須被横置";
	}
	if ([for (mark in ctx.marks) mark].length != 1) {
		throw "必須有不能重置效果";
	}
	trace("結束一個turn");
	ctx.timing = Default(Battle, Some(End), End);
	sendEvent(ctx, ChangePhase);
	if ([for (mark in ctx.marks) mark].length != 1) {
		throw "必須有不能重置效果";
	}
	trace("再結束一個turn");
	sendEvent(ctx, ChangePhase);
	if ([for (mark in ctx.marks) mark].length != 0) {
		throw "不能重置效果必須被移除";
	}
}
