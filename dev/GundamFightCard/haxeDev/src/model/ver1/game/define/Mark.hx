package model.ver1.game.define;

import model.ver1.game.define.Define;
import model.ver1.game.entity.Context;

enum MarkEffect {
	AddBattlePoint(cardId:String, battlePoint:BattlePoint);
	AttackSpeed(cardId:String, speed:Int);
	AddText(cardId:String, text:CardText);
	EnterFieldThisTurn(cardId:String);
	CanNotReroll(cardId:String);
}

class Mark implements hxbit.Serializable {
	public function new(id:String) {
		this.id = id;
	}

	@:s public var id:String;
	// hxbit.Serializable not support Option
	@:s public var age:Null<Int>;

	public function getEffect(ctx:Context):Array<MarkEffect> {
		return [];
	}

	public function onEvent(ctx:Context, event:Event):Void {
		if (age != null) {
			switch event {
				case ChangePhase:
					switch ctx.timing {
						case Default(Battle, Some(End), End):
							age -= 1;
							if (age <= 0) {
								ctx.marks.remove(id);
							}
						case _:
					}
				case _:
			}
		}
	}
}

class EnterFieldThisTurnMark extends Mark {
	public function new(id:String, cardId:String) {
		super(id);
		this.cardId = cardId;
		this.age = 1;
	}

	@:s public var cardId:String;

	public override function getEffect(ctx:Context):Array<MarkEffect> {
		return [EnterFieldThisTurn(this.cardId)];
	}
}

class CanNotRerollMark extends Mark {
	public function new(id:String, cardId:String) {
		super(id);
		this.cardId = cardId;
	}

	@:s public var cardId:String;

	public override function getEffect(ctx:Context):Array<MarkEffect> {
		return [CanNotReroll(this.cardId)];
	}
}
