package model.ver1.game.define;

import model.ver1.game.define.Define;
import model.ver1.game.define.Timing;

enum MarkEffect {
	AddBattlePoint(cardId:String, battlePoint:BattlePoint);
	AttackSpeed(cardId:String, speed:Int);
	AddText(cardId:String, text:CardText);
	EnterFieldThisTurn(cardId:String);
	CanNotReroll(cardId:String);
}

class Mark {
	public function new(id:String) {
		this.id = id;
	}

	public var id:String;

	public function getEffect(_ctx:IContext):Array<MarkEffect> {
		return [];
	}

	public function onEvent(_ctx:IContext, event:Event):Void {
		
	}
}