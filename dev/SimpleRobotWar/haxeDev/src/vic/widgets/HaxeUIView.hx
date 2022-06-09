package vic.widgets;

import haxe.ui.containers.Box;
import common.Define;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/HaxeUIView.xml'))
class HaxeUIView extends Box implements IView {
	final _impl:DefaultViewImpl;

	public function new() {
		super();
		_impl = new DefaultViewImpl(this);
	}

	public function getImpl() {
		return _impl;
	}

	public function getLobbyController():ILobbyController {
		return _impl.getLobbyController();
	}

	public function getBattleController():IBattleController {
		return _impl.getBattleController();
	}

	public function startLobby(ctr:ILobbyController):Void {
		_impl.startLobby(ctr);
	}

	public function startBattle(ctr:IBattleController):Void {
		_impl.startBattle(ctr);
	}

	public function onEvent(action:ViewEvent):Void {
		_impl.onEvent(action);
	}
}
