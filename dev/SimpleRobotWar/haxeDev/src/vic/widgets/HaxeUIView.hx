package vic.widgets;

import haxe.ui.containers.Box;
import common.Define;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/HaxeUIView.xml'))
class HaxeUIView extends Box implements IView {
	public static var _inst:HaxeUIView = null;
	final _impl:DefaultViewImpl;

	public static function getInst(){
		return _inst;
	}

	public function new() {
		super();
		_inst = this;
		_impl = new DefaultViewImpl(this);
	}

	public function getImpl(){
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
