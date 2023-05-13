package model.ver1.game.gameComponent;

using Lambda;

import haxe.ds.Option;
import haxe.Exception;
import model.ver1.game.define.Define;
import model.ver1.game.define.CardText;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Require;
import model.ver1.game.define.CardProto;
import model.ver1.game.define.Effect;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.Player;
import model.ver1.game.component.CutComponent;
import model.ver1.game.component.TableComponent;
import model.ver1.game.component.PlayerStateComponent;
import model.ver1.game.gameComponent.GameComponent;
import model.ver1.game.gameComponent.GameCardText;
import model.ver1.game.gameComponent.Alg;

class RerollRule extends GameCardText {
	public function new() {
		super("RerollRule", "RerollRule", System);
	}

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		final cardIds = [GZone, MaintenanceArea].map(kw -> BaSyou.Default(runtime.getResponsePlayerId(), kw)).flatMap(baSyou -> {
			return getCardIdsByBaSyou(ctx, baSyou);
		});
		for (cardId in cardIds) {
			rerollCard(ctx, cardId, {sendEvent: true});
		}
	}
}

function addRerollRule(ctx:IGameComponent, playerId:PlayerId):Void {
	final block = new Effect("RerollRule", System(playerId), new RerollRule());
	cutIn(ctx, block);
}
