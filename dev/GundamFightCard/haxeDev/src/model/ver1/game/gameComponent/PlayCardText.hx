package model.ver1.game.gameComponent;

import model.ver1.game.define.Define;
import model.ver1.game.define.CardText;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Require;
import model.ver1.game.define.CardProto;
import model.ver1.game.define.Effect;
import model.ver1.game.define.BaSyou;
import model.ver1.game.component.CutComponent;
import model.ver1.game.gameComponent.GameComponent;
import model.ver1.game.gameComponent.GameCardText;
import model.ver1.game.gameComponent.Alg;

class PlayUnitEffectText extends GameCardText {
	var baSyou:BaSyou;

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		// 機體, op的話移到配置區
		
	}
}

class PlayPilotEffectText extends GameCardText {
	var baSyou:BaSyou;
	var unitCardId:String;

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		// 駕駛移到配置區(stay)或機體上
	}
}

class PlayCommandEffectText extends GameCardText {
	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		// 解決指令效果並移到廢棄庫
		_commandEffectImpl(ctx, runtime);
	}
	function _commandEffectImpl(ctx:IGameComponent, runtime:Runtime):Void{

	}
}

class PlayUnitText extends GameCardText {
	var rollCost:RollCost;

	override function _getRequires2(ctx:IGameComponent, runtime:Runtime):Array<Require2> {
		return [createRequireRollCost(rollCost, {})];
	}

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		final block = new Effect(getSubKey(0), PlayCard(runtime.getResponsePlayerId(), runtime.getCardId()), new PlayUnitEffectText("", ""));
		cutIn(ctx, block);
	}
}

class PlayGText extends GameCardText {
	var rollCost:RollCost;

	override function _getRequires2(ctx:IGameComponent, runtime:Runtime):Array<Require2> {
		// check has play G
		return [];
	}

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		// move card to GZone
	}
}

function createPlayCardText(cardProto:CardProto, options:{}):CardText {
	return new PlayUnitText("", "");
}
