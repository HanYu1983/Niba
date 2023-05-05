package model.ver1.game.gameComponent;

import model.ver1.game.define.Define;
import model.ver1.game.define.CardText;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Require;
import model.ver1.game.gameComponent.GameComponent;

class GameCardText extends CardText {
	public function new(id:String, description:String) {
		super(id, description);
	}

	public final override function getEffect(_ctx:Any, runtime:Runtime):Array<Any> {
		final ctx = cast(_ctx : IGameComponent);
		return _getEffect(ctx, runtime);
	}

	public final override function getRequires(_ctx:Any, runtime:Runtime):Array<Require> {
		final ctx = cast(_ctx : IGameComponent);
		return _getRequires(ctx, runtime);
	}

	public final override function getRequires2(_ctx:Any, runtime:Runtime):Array<Require2> {
		final ctx = cast(_ctx : IGameComponent);
		return _getRequires2(ctx, runtime);
	}

	public final override function action(_ctx:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx : IGameComponent);
		_action(ctx, runtime);
	}

	public final override function onEvent(_ctx:Any, _event:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx : IGameComponent);
		final event = cast(_event : Event);
		this._onEvent(ctx, event, runtime);
	}

	function _getEffect(ctx:IGameComponent, runtime:Runtime):Array<Any> {
		return [];
	}

	function _getRequires(ctx:IGameComponent, runtime:Runtime):Array<Require> {
		return [];
	}

	function _getRequires2(ctx:IGameComponent, runtime:Runtime):Array<Require2> {
		return [];
	}

	function _action(ctx:IGameComponent, runtime:Runtime):Void {}

	function _onEvent(ctx:IGameComponent, event:Event, runtime:Runtime):Void {}
}
