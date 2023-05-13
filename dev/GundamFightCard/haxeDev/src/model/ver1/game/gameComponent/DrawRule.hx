package model.ver1.game.gameComponent;

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
import model.ver1.game.component.ActiveEffectComponent;
import model.ver1.game.gameComponent.GameComponent;
import model.ver1.game.gameComponent.GameCardText;
import model.ver1.game.gameComponent.Alg;

class DrawRule extends GameCardText {
	public function new() {
		super("DrawRule", "DrawRule", System);
	}

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		final from = BaSyou.Default(runtime.getResponsePlayerId(), HonGoku);
		final to = BaSyou.Default(runtime.getResponsePlayerId(), TeHuTa);
		moveCard(ctx, runtime.getCardId(), from, to);
	}
}

function addDrawRule(ctx:IGameComponent, playerId:PlayerId):Void {
	final block = new Effect("DrawRule", System(Some(playerId)), new DrawRule());
	setActiveEffect(ctx, Some(block));
}
