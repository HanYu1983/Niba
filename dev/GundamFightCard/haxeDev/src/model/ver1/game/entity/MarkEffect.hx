package model.ver1.game.entity;

import model.ver1.game.define.Define;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Event;
import model.ver1.game.entity.Context;

enum MarkEffect {
	AddBattlePoint(cardId:String, battlePoint:BattlePoint);
	AttackSpeed(cardId:String, speed:Int);
	AddText(cardId:String, text:DefaultCardText);
	EnterFieldThisTurn(cardId:String);
	CanNotReroll(cardId:String);
}

class DefaultMark extends Mark<Context, MarkEffect> {
	// hxbit.Serializable not support Option
	@:s public var age:Null<Int>;

	public function new(id:String) {
		super(id);
	}

	public override function onEvent(ctx:Context, event:Event):Void {
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

class EnterFieldThisTurnMark extends DefaultMark {
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

class CanNotRerollMark extends DefaultMark {
	public function new(id:String, cardId:String) {
		super(id);
		this.cardId = cardId;
	}

	@:s public var cardId:String;

	public override function getEffect(ctx:Context):Array<MarkEffect> {
		return [CanNotReroll(this.cardId)];
	}
}
