package model.ver1.data;

import haxe.Exception;
import tool.Helper;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.Timing;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Block;
import model.ver1.game.define.Require;
import model.ver1.game.define.Event;
import model.ver1.game.define.Player;
import model.ver1.game.alg.Context;
import model.ver1.game.alg.Cut;
import model.ver1.data.RequireImpl;
import model.ver1.game.entity.Context;
import model.ver1.game.entity.DefaultCardProto;
import model.ver1.game.entity.DefaultCardText;
import model.ver1.game.entity.DefaultRequire;

// 179030_11E_CH_BN091N_brown
// N
// ∀
// ポゥ・エイジ
// 女性　大人
// 『起動』：このカードがロールした場合、敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。

class CardProto_179030_11E_CH_BN091N_brown extends DefaultCardProto {
	public function new() {
		super();
		this.category = Character;
	}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<DefaultCardText> {
		return [
			new PlayerPlayCard('${runtime.getCardId()}_PlayerPlayCard'),
			new Text1('${runtime.getCardId()}_Text1')
		];
	}
}

function getOpponentG(ctx:Context, runtime:ExecuteRuntime):Array<String> {
	final responsePlayerId = runtime.getResponsePlayerId();
	final opponentPlayerId = ~(responsePlayerId);
	return [for (card in ctx.table.cards) card].map(card -> card.id).filter(cardId -> {
		return getCardOwner(ctx, cardId) == opponentPlayerId;
	}).filter(cardId -> {
		return switch getCardEntityCategory(ctx, cardId) {
			case Some(G):
				true;
			case _:
				false;
		}
	});
}

private class Text1 extends DefaultCardText {
	public function new(id:String) {
		super(id, "『起動』：このカードがロールした場合、敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。");
		type = Automatic(Trigger);
	}

	public override function onEvent(ctx:Context, event:Event, runtime:ExecuteRuntime):Void {
		final thisCardId = runtime.getCardId();
		final responsePlayerId = runtime.getResponsePlayerId();
		final opponentPlayerId = ~(responsePlayerId);
		switch event {
			case CardRoll(rollCardId):
				if (rollCardId == thisCardId) {
					if (getOpponentG(ctx, runtime).length >= 1) {
						final block = new Block(getSubKey(0), TextEffect(thisCardId, id), new Process1('${id}_Process1'));
						block.isImmediate = true;
						cutIn(ctx, block);
					}
				}
			case _:
		}
	}
}

private class Process1 extends DefaultCardText {
	public function new(id:String) {
		super(id, "敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。");
	}

	public override function getRequires2(ctx:Context, runtime:ExecuteRuntime):Array<Require2> {
		final tips:Array<Tip<String>> = getOpponentG(ctx, runtime).map(i -> {
			return {
				value: i,
				weight: 0.0,
			}
		});
		return [
			{
				id: getSubKey(0),
				description: "敵軍G１枚をロールする。",
				type: SelectCard(tips, [1]),
				action: () -> {
					final selectUnits = getPlayerSelectionCardId(ctx, getSubKey(0));
					for (unit in selectUnits) {
						tapCard(ctx, unit);
					}
				},
			}
		];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final thisCardId = runtime.getCardId();
		for (cardId in getThisCardSetGroupCardIds(ctx, thisCardId)) {
			final markId = '${id}_${cardId}';
			final mark = new CanNotRerollMark(markId, cardId);
			mark.age = 2;
			ctx.marks[mark.id] = mark;
		}
	}
}

function test() {
	final player1 = PlayerId.A;
	final player2 = PlayerId.B;
	final ctx = new Context();
	final player2Hand = new CardStack((Default(player2, TeHuTa) : BaSyouId));
	ctx.table.cardStacks[player2Hand.id] = player2Hand;
	trace("卡牌1在場");
	final card = new Card("1");
	card.owner = player1;
	card.protoId = "179030_11E_CH_BN091N_brown";
	addCard(ctx.table, (Default(player1, MaintenanceArea) : BaSyouId), card);
	trace("敵軍G在場");
	final card2 = new Card("2");
	card2.owner = player2;
	card2.protoId = "179030_11E_CH_BN091N_brown";
	card2.isTap = false;
	addCard(ctx.table, (Default(player2, GZone) : BaSyouId), card2);
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
	final runtime = new DefaultExecuteRuntime(card.id, player1);
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
		throw "必須有一個可選G";
	}
	trace("選擇");
	setPlayerSelectionCardId(ctx, require.id, [tips[0].value]);
	trace("驗証支付");
	require.action();
	if (card2.isTap != true) {
		throw "牌必須被横置";
	}
	trace("解決效果");
	block.text.action(ctx, runtime);
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
