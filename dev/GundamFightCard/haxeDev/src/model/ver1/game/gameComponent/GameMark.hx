package model.ver1.game.gameComponent;

import model.ver1.game.define.Define;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Mark;
import model.ver1.game.component.MarkComponent;
import model.ver1.game.component.TimingComponent;
import model.ver1.game.gameComponent.GameComponent;
import model.ver1.game.gameComponent.Event;
import model.ver1.game.gameComponent.MarkEffect;

class GameMark extends Mark {
	public function new(id:String) {
		super(id);
	}

	public var age:Null<Int>;

	public final override function getEffect(_ctx:Any):Array<Any> {
		final ctx:IGameComponent = cast _ctx;
		return _getEffect(ctx);
	}

	function _getEffect(ctx:IGameComponent):Array<Any> {
		return [];
	}

	public final override function onEvent(_ctx:Any, event:Any):Void {
		final ctx:IGameComponent = cast _ctx;
		_onEvent(ctx, event);
	}

	function _onEvent(ctx:IGameComponent, event:Any):Void {
		if (age != null) {
			switch cast(event : Event) {
				case ChangePhase:
					switch getTiming(ctx) {
						case Default(Battle, Some(End), End):
							age -= 1;
							if (age <= 0) {
								removeMark(ctx, id);
							}
						case _:
					}
				case _:
			}
		}
	}
}

class EnterFieldThisTurnMark extends GameMark {
	public function new(id:String, cardId:String) {
		super(id);
		this.cardId = cardId;
		this.age = 1;
	}

	public var cardId:String;

	public override function _getEffect(ctx:IGameComponent):Array<MarkEffect> {
		return [EnterFieldThisTurn(this.cardId)];
	}
}

class CanNotRerollMark extends GameMark {
	public function new(id:String, cardId:String) {
		super(id);
		this.cardId = cardId;
	}

	public var cardId:String;

	public override function _getEffect(_ctx:IGameComponent):Array<MarkEffect> {
		return [CanNotReroll(this.cardId)];
	}
}
