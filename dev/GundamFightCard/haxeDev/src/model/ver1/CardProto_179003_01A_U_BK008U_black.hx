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
		ctx.effectStack.push(new Block("", PlayText(cardId, id), new Text2('${id}_Text2')));
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
