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
import model.ver1.game.component.SelectionComponent;
import model.ver1.game.gameComponent.GameComponent;
import model.ver1.game.gameComponent.GameCardText;
import model.ver1.game.gameComponent.Alg;

class ReturnRule extends GameCardText {
	public function new() {
		super("ReturnRule", "ReturnRule", System);
	}

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		final cardIds = [
			for (playerId in [PlayerId.A, PlayerId.B])
				for (baSyouKw in [EarthArea, SpaceArea])
					BaSyou.Default(playerId, baSyouKw)
		].flatMap(baSyou -> {
			return getCardIdsByBaSyou(ctx, baSyou);
		});
		for (cardId in cardIds) {
			final from = getCardBaSyouAndAssertExist(ctx, runtime.getCardId());
			final to = BaSyou.Default(runtime.getResponsePlayerId(), MaintenanceArea);
			moveCard(ctx, runtime.getCardId(), from, to);
			rollCard(ctx, runtime.getCardId(), {sendEvent: true});
		}
	}
}

function addReturnRule(ctx:IGameComponent, playerId:PlayerId):Void {
	final block = new Effect("ReturnRule", System(playerId), new ReturnRule());
	cutIn(ctx, block);
}
