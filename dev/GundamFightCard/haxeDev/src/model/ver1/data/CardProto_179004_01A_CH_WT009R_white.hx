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
import model.ver1.game.define.Player;
import model.ver1.game.define.CardText;
import model.ver1.game.define.CardProto;
import model.ver1.game.component.CutComponent;
import model.ver1.game.component.CardProtoPoolComponent;
import model.ver1.game.component.SelectionComponent;
import model.ver1.game.component.MarkComponent;
import model.ver1.game.component.TimingComponent;
import model.ver1.game.component.TableComponent;
import model.ver1.game.gameComponent.Event;
import model.ver1.game.gameComponent.Alg;
import model.ver1.game.gameComponent.GameMark;
import model.ver1.game.gameComponent.MarkEffect;
import model.ver1.game.gameComponent.GameComponent;
import model.ver1.game.entity.Context;
import model.ver1.data.RequireImpl;

// 179004_01A_CH_WT009R_white
// ラクス・クライン
// 女性　子供　CO
// 【ステイ】　〔１〕：ゲイン　〔１〕：供給
// 『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。

class CardProto_179004_01A_CH_WT009R_white extends CardProto {
	public function new() {
		super();
		this.category = Character;
	}

	public override function getTexts(_ctx:Any, runtime:Runtime):Array<CardText> {
		final ctx = cast(_ctx, Context);
		final thisCardId = runtime.getCardId();
		return [
			//new PlayerPlayCard('${thisCardId}_PlayerPlayCard'),
			new Text1('${thisCardId}_Text1')
		];
	}
}

private class Text1 extends CardText {
	public function new(id:String) {
		super(id, "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。", Automatic(Trigger));
	}

	public override function onEvent(_ctx:Any, event:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx, Context);
		final thisCardId = runtime.getCardId();
		switch cast(event : Event) {
			case Gain(gainCardId, gainValue):
				if (isMyCard(ctx, thisCardId, gainCardId)) {
					final block = new Effect('${id}_${Date.now()}', TextEffect(thisCardId, id), new Text1_1('${id}_Text1_1', gainCardId, gainValue));
					block.isImmediate = true;
					cutIn(ctx, block);
				}
			case _:
		}
	}
}

private class Text1_1 extends CardText {
	public function new(id:String, gainCardId:String, gainValue:BattlePoint) {
		super(id, "そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。", System);
		this.gainCardId = gainCardId;
		this.gainValue = gainValue;
	}

	public var gainCardId:String;
	public var gainValue:BattlePoint;

	public override function getRequires(_ctx:Any, runtime:Runtime):Array<Require> {
		final ctx = cast(_ctx, Context);
		final thisCardId = runtime.getCardId();
		final gainCardSetGroupsIds = getCardSetGroupCardIds(ctx, gainCardId);
		final tips = [for (card in ctx.table.cards) card].filter(card -> {
			return gainCardSetGroupsIds.contains(card.id) == false && isMyCard(ctx, thisCardId, card.id);
		}).map(card -> card.id);
		final req = new RequireUserSelectCard(getSubKey(0), "そのカードのセットグループ以外の自軍ユニット１枚は");
		req.tips = tips;
		return [req];
	}

	public override function getRequires2(_ctx:Any, runtime:Runtime):Array<Require2> {
		final ctx = cast(_ctx, Context);
		final thisCardId = runtime.getCardId();
		final gainCardSetGroupsIds = getCardSetGroupCardIds(ctx, gainCardId);
		final tips = [for (card in ctx.table.cards) card].filter(card -> {
			return isMyCard(ctx, thisCardId, card.id);
		}).filter(card -> {
			return gainCardSetGroupsIds.contains(card.id) == false;
		}).filter(card -> {
			return switch getCardEntityCategory(ctx, card.id) {
				case Some(Unit):
					true;
				case _:
					false;
			}
		}).map(card -> card.id).map(i -> {
			return {
				value: i,
				weight: 0.0,
			}
		});
		final tipsLengths = [1];
		return [
			{
				id: getSubKey(0),
				description: "そのカードのセットグループ以外の自軍ユニット１枚は",
				type: SelectCard(tips, tipsLengths),
				player: You,
				action: () -> {
					// assert selection
					final selection = getPlayerSelectionCardId(ctx, getSubKey(0));
					if (tipsLengths.contains(selection.length) == false) {
						throw "length not right";
					}
				},
			}
		];
	}

	public override function action(_ctx:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx, Context);
		final selectUnits = getPlayerSelectionCardId(ctx, getSubKey(0));
		for (unit in selectUnits) {
			final mark = new Mark1('${id}_Mark1', gainCardId, gainValue);
			mark.age = 1;
			addMark(ctx, mark);
		}
	}
}

private class Mark1 extends GameMark {
	public function new(id:String, attachCardId:String, battlePoint:BattlePoint) {
		super(id);
		this.attachCardId = attachCardId;
		this.battlePoint = battlePoint;
	}

	public var attachCardId:String;
	public var battlePoint:BattlePoint;

	override function _getEffect(ctx:IGameComponent):Array<Any> {
		return [AddBattlePoint(attachCardId, battlePoint)];
	}
}

function test() {
	final player1 = PlayerId.A;
	final player2 = PlayerId.B;
	final ctx = new Context();
	registerCardProto(ctx, "testUnit", new CardProto());
	trace("角色在場");
	final card = new Card("1");
	card.owner = player1;
	card.protoId = "179004_01A_CH_WT009R_white";
	addCard(ctx.table, (Default(player1, MaintenanceArea) : BaSyouId), card);
	trace("機體1出場");
	final card2 = new Card("2");
	card2.owner = player1;
	card2.protoId = "testUnit";
	addCard(ctx.table, (Default(player1, MaintenanceArea) : BaSyouId), card2);
	trace("機體2出場");
	final card3 = new Card("3");
	card3.owner = player1;
	card3.protoId = "testUnit";
	addCard(ctx.table, (Default(player1, MaintenanceArea) : BaSyouId), card3);
	trace("敵機體出場");
	final card4 = new Card("4");
	card4.owner = player2;
	card4.protoId = "testUnit";
	addCard(ctx.table, (Default(player2, MaintenanceArea) : BaSyouId), card4);
	//
	if (getTopCut(ctx).length != 0) {
		throw "一開始堆疊中沒有效果";
	}
	trace("獲得gain");
	sendEvent(ctx, Gain(card2.id, Default(1, 0, 0)));
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
		throw "必須有一個可選機";
	}
	if (tips[0].value != card3.id) {
		throw "必須可以選card3";
	}
	trace("選擇");
	setPlayerSelectionCardId(ctx, require.id, [tips[0].value]);
	trace("驗証支付");
	require.action();
	trace("解決效果");
	block.text.action(ctx, runtime);
	if (getMarks(ctx).length != 1) {
		throw "必須有效果";
	}
	trace("結束一個turn");
	setTimging(ctx, Default(Battle, Some(End), End));
	sendEvent(ctx, ChangePhase);
	if (getMarks(ctx).length != 0) {
		throw "效果必須被移除";
	}
}
