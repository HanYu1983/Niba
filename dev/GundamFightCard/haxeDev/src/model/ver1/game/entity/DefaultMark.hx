package model.ver1.game.entity;

import model.ver1.game.define.Define.IContext;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Event;
import model.ver1.game.define.Mark;
import model.ver1.game.entity.Context;

class DefaultMark extends Mark {
	public function new(id:String) {
		super(id);
	}

	public var age:Null<Int>;

	public override function onEvent(_ctx:IContext, event:Event):Void {
		final ctx:Context = cast _ctx;
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

	public var cardId:String;

	public override function getEffect(_ctx:IContext):Array<MarkEffect> {
		return [EnterFieldThisTurn(this.cardId)];
	}
}

class CanNotRerollMark extends DefaultMark {
	public function new(id:String, cardId:String) {
		super(id);
		this.cardId = cardId;
	}

	public var cardId:String;

	public override function getEffect(_ctx:IContext):Array<MarkEffect> {
		return [CanNotReroll(this.cardId)];
	}
}
