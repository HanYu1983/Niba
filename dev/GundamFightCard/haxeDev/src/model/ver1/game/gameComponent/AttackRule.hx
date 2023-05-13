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
import model.ver1.game.component.ActiveEffectComponent;
import model.ver1.game.gameComponent.GameComponent;
import model.ver1.game.gameComponent.GameCardText;
import model.ver1.game.gameComponent.Alg;

class AttackRule extends GameCardText {
	public function new() {
		super("AttackRule", "AttackRule", System);
	}

	override function _getRequires2(ctx:IGameComponent, runtime:Runtime):Array<Require2> {
		return [
			{
				id: "area1",
				description: "String",
				type: SelectCard([], []),
				player: You,
				action: () -> {
					final selectUnits = getPlayerSelectionCardId(ctx, "earth");
				},
			},
			{
				id: "area2",
				description: "String",
				type: SelectCard([], []),
				player: You,
				action: () -> {
					final selectUnits = getPlayerSelectionCardId(ctx, "space");
				},
			}
		];
	}

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		final cardIdsGoEarth = getPlayerSelectionCardId(ctx, "area1");
		for (cardId in cardIdsGoEarth) {
			// TODO check area1 is earth or space
			final from = getCardBaSyouAndAssertExist(ctx, cardId);
			final to = BaSyou.Default(runtime.getResponsePlayerId(), EarthArea);
			moveCard(ctx, runtime.getCardId(), from, to);
		}
		final cardIdsGoSpace = getPlayerSelectionCardId(ctx, "area2");
		for (cardId in cardIdsGoSpace) {
			// TODO check area2 is earth or space
			final from = getCardBaSyouAndAssertExist(ctx, cardId);
			final to = BaSyou.Default(runtime.getResponsePlayerId(), SpaceArea);
			moveCard(ctx, runtime.getCardId(), from, to);
		}
	}
}

function addAttackRule(ctx:IGameComponent, playerId:PlayerId):Void {
	final block = new Effect("AttackRule", System(Some(playerId)), new AttackRule());
	setActiveEffect(ctx, Some(block));
}
