package model.ver1.data;

import haxe.Exception;
import tool.Helper;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.Timing;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Effect;
import model.ver1.game.define.Require;
import model.ver1.game.gameComponent.Event;
import model.ver1.game.define.Player;
import model.ver1.game.define.CardText;
import model.ver1.game.define.CardProto;
import model.ver1.game.component.CutComponent;
import model.ver1.game.component.SelectionComponent;
import model.ver1.game.component.MarkComponent;
import model.ver1.game.component.TimingComponent;
import model.ver1.game.entity.Context;
import model.ver1.game.gameComponent.DefaultMark;
import model.ver1.game.gameComponent.Alg;
import model.ver1.data.RequireImpl;

// 179030_11E_CH_BN091N_brown
// N
// ∀
// ポゥ・エイジ
// 女性　大人
// 『起動』：このカードがロールした場合、敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。

class CardProto_179030_11E_CH_BN091N_brown extends CardProto {
	public function new() {
		super();
		this.category = Character;
	}

	public override function getTexts(_ctx:Any, runtime:Runtime):Array<CardText> {
		return [
			new PlayerPlayCard('${runtime.getCardId()}_PlayerPlayCard'),
			new Text1('${runtime.getCardId()}_Text1')
		];
	}
}

function getOpponentG(_ctx:Any, runtime:Runtime):Array<String> {
	final ctx = cast(_ctx, Context);
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

private class Text1 extends CardText {
	public function new(id:String) {
		super(id, "『起動』：このカードがロールした場合、敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。");
		type = Automatic(Trigger);
	}

	public override function onEvent(_ctx:Any, event:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx, Context);
		final thisCardId = runtime.getCardId();
		final responsePlayerId = runtime.getResponsePlayerId();
		final opponentPlayerId = ~(responsePlayerId);
		switch cast(event : Event) {
			case CardRoll(rollCardId):
				if (rollCardId == thisCardId) {
					if (getOpponentG(ctx, runtime).length >= 1) {
						final block = new Effect(getSubKey(0), TextEffect(thisCardId, id), new Process1('${id}_Process1'));
						block.isImmediate = true;
						cutIn(ctx, block);
					}
				}
			case _:
		}
	}
}

private class Process1 extends CardText {
	public function new(id:String) {
		super(id, "敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。");
	}

	public override function getRequires2(_ctx:Any, runtime:Runtime):Array<Require2> {
		final ctx = cast(_ctx, Context);
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
				player: You,
				action: () -> {
					final selectUnits = getPlayerSelectionCardId(ctx, getSubKey(0));
					for (unit in selectUnits) {
						tapCard(ctx, unit);
					}
				},
			}
		];
	}

	public override function action(_ctx:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx, Context);
		final thisCardId = runtime.getCardId();
		for (cardId in getThisCardSetGroupCardIds(ctx, thisCardId)) {
			final markId = '${id}_${cardId}';
			final mark = new CanNotRerollMark(markId, cardId);
			mark.age = 2;
			addMark(ctx, mark);
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
	if (getMarks(ctx).length != 1) {
		throw "必須有不能重置效果";
	}
	trace("結束一個turn");
	setTimging(ctx, Default(Battle, Some(End), End));
	sendEvent(ctx, ChangePhase);
	if (getMarks(ctx).length != 1) {
		throw "必須有不能重置效果";
	}
	trace("再結束一個turn");
	sendEvent(ctx, ChangePhase);
	if (getMarks(ctx).length != 0) {
		throw "不能重置效果必須被移除";
	}
}
