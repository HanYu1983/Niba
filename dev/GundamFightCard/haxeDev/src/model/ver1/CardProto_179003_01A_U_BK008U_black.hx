package model.ver1;

import haxe.Exception;
import model.ver1.Define;

// 179003_01A_U_BK008U_black
// U
// V
// シャッコー
// シャッコー系　MS
// （ダメージ判定ステップ）〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。
class CardProto_179003_01A_U_BK008U_black extends AbstractCardProto {
	public function new() {}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [new Text1('${runtime.getCardId()}_Text1')];
	}
}

class RequireThisCardDestroyByBattleDamage extends Require {
	public function new(id:String) {
		super(id, "このカードが戦闘ダメージで破壊されている場合");
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		if (isDestroyNow(ctx, runtime.getCardId(), {isByBattleDamage: true}) == false) {
			throw new haxe.Exception("這張卡必須是破壞中的狀態");
		}
	}
}

class Text1 extends CardText {
	public function new(id:String) {
		super(id, "（ダメージ判定ステップ）〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。");
	}

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		return [
			new RequirePhase('${id}_Text1_Req1', "（ダメージ判定ステップ）", Test("ダメージ判定ステップ")),
			new RequireG('${id}_Text1_Req2', "〔２〕", [Black, Black], ctx, runtime),
			new RequireThisCardDestroyByBattleDamage('${id}_Text1_Req3'),
		];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final cardId = runtime.getCardId();
		ctx.effectStack.push(new Block('${id}_${Date.now()}', PlayText(cardId, id), new Text2('${id}_Text2')));
	}
}

class Text2 extends CardText {
	public function new(id:String) {
		super(id, "このカードを、破壊を無効にした上で自軍Gにする。");
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
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
	ctx.phase = Test("ダメージ判定ステップ");
	final playerId = "0";
	final infos = getRuntimeText(ctx, playerId).map(info -> {
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
	final playerId = "0";
	final findText = getRuntimeText(ctx, playerId).filter(info -> {
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
