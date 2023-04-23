package model.ver1.data;

import haxe.Exception;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Block;
import model.ver1.game.define.Require;
import model.ver1.game.define.Player;
import model.ver1.game.define.CardText;
import model.ver1.game.define.CardProto;
import model.ver1.game.component.CutComponent;
import model.ver1.game.component.TimingComponent;
import model.ver1.game.entity.Alg;
import model.ver1.game.entity.Runtime;
import model.ver1.game.entity.Context;
import model.ver1.data.RequireImpl;

// 179003_01A_U_BK008U_black
// U
// V
// シャッコー
// シャッコー系　MS
// （ダメージ判定ステップ）〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。
class CardProto_179003_01A_U_BK008U_black extends CardProto {
	public function new() {
		super();
	}

	public override function getTexts(_ctx:Any, runtime:Runtime):Array<CardText> {
		final ctx = cast(_ctx, Context);
		return [
			new PlayerPlayCard('${runtime.getCardId()}_PlayerPlayCard'),
			new Text1('${runtime.getCardId()}_Text1')
		];
	}
}

private class RequireThisCardDestroyByBattleDamage extends Require {
	public function new(id:String) {
		super(id, "このカードが戦闘ダメージで破壊されている場合");
	}

	public override function action(_ctx:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx, Context);
		if (isDestroyNow(ctx, runtime.getCardId(), {isByBattleDamage: true}) == false) {
			throw new haxe.Exception("這張卡必須是破壞中的狀態");
		}
	}
}

private class Text1 extends CardText {
	public function new(id:String) {
		super(id, "（ダメージ判定ステップ）〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。");
		type = Use;
	}

	public override function getRequires(_ctx:Any, runtime:Runtime):Array<Require> {
		final ctx = cast(_ctx, Context);
		return [
			// TODO: timing list
			new RequirePhase('${id}_Text1_Req1', Default(Battle, Some(DamageChecking), Free1)),
			new RequireGTap('${id}_Text1_Req2', [Black, Black], ctx, runtime),
			new RequireThisCardDestroyByBattleDamage('${id}_Text1_Req3'),
		];
	}

	public override function action(_ctx:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx, Context);
		final cardId = runtime.getCardId();
		final block = new Block('${id}_${Date.now()}', PlayText(cardId, id), new Text2('${id}_Text2'));
		cutIn(ctx, block);
	}
}

private class Text2 extends CardText {
	public function new(id:String) {
		super(id, "このカードを、破壊を無効にした上で自軍Gにする。");
	}

	public override function action(_ctx:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx, Context);
		final cardId = runtime.getCardId();
		removeDestroyEffect(ctx, cardId);
		becomeG(ctx, cardId);
	}
}

function test() {
	final ctx = new Context();
	final card1 = new Card("0");
	card1.protoId = "179003_01A_U_BK008U_black";
	ctx.table.cards[card1.id] = card1;
	setTimging(ctx,  Timing.Default(Battle, Some(DamageChecking), Start));
	final infos = getRuntimeText(ctx).map(info -> {
		return {
			cardId: info.runtime.getCardId(),
			text: info.text,
			reqs: info.text.getRequires(ctx, info.runtime),
		}
	});
	trace(infos);
	if (infos.length == 0) {
		throw new haxe.Exception("infos.length == 0");
	}
	final selectTextId = infos[0].text.id;
	final findText = getRuntimeText(ctx).filter(info -> {
		return info.text.id == selectTextId;
	});
	if (findText.length == 0) {
		throw new haxe.Exception("findText not found");
	}
	{
		final text = findText[0].text;
		final runtime = findText[0].runtime;
		for (req in text.getRequires(ctx, runtime)) {
			req.action(ctx, runtime);
		}
		text.action(ctx, runtime);
	}
}
