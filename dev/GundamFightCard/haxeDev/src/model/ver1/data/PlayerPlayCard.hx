package model.ver1.data;

using Lambda;

import haxe.Exception;
import model.ver1.data.Require;
import model.ver1.game.Define;
import model.ver1.alg.Alg;

class PlayerPlayCard extends CardText {
	public function new(id:String) {
		super(id, "PlayerPlayCard");
	}

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		return [
			new RequirePhase('${id}_RequirePhase', Test("settings")),
			new RequireGCount('${id}_RequireGCount', 3),
			new RequireGTap('${id}_RequireGTap', [Black, Black], ctx, runtime),
		];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final cardId = runtime.getCardId();
		final responsePlayerId = runtime.getResponsePlayerId();
		ctx.effectStack.push(new Block('${id}_${Date.now()}', PlayCard(responsePlayerId, cardId), new PlayerPlayCardEffect('${id}_PlayerPlayCardEffect')));
	}
}

private class PlayerPlayCardEffect extends CardText {
	public function new(id:String) {
		super(id, "PlayerPlayCardEffect");
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final cardId = runtime.getCardId();
		playCardToField(ctx, cardId);
	}
}