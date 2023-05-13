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

class DamageRule extends GameCardText {
	public function new() {
		super("DamageRule", "DamageRule", System);
	}

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		// battle
	}
}

function addDamageRule(ctx:IGameComponent, playerId:PlayerId):Void {
	final block = new Effect("DamageRule", System(playerId), new DamageRule());
	cutIn(ctx, block);
}
