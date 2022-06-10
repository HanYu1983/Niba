package han.view.ver1;

import haxe.Exception;
import common.IDefine;

abstract class DefaultView implements IView {
	public function new() {}

	var _lobbyCtr:Null<ILobbyController>;
	var _battleCtr:Null<IBattleController>;

	public function startLobby(ctr:ILobbyController):Void {
		_lobbyCtr = ctr;
		openLobbyPage();
	}

	public function startBattle(ctr:IBattleController):Void {
		_battleCtr = ctr;
		openBattlePage();
	}

	public function onEvent(action:ViewEvent):Void {
		switch action {
			case ON_CLICK_GOTO_ROBOT_VIEW:
				openRobotViewPage();
			case ON_CLICK_GOTO_PILOT_VIEW:
				openPilotViewPage();
			case ON_CLICK_GOTO_ROBOT_BUY(_):
			case ON_CLICK_ROBOT_VIEW_CANCEL:
				openLobbyPage();
			case _:
		}
	}

	private function getLobbyController():ILobbyController {
		if (_lobbyCtr == null) {
			throw new Exception("your must call startLobby first");
		}
		return _lobbyCtr;
	}

	private function getBattleController():IBattleController {
		if (_battleCtr == null) {
			throw new Exception("your must call startBattle first");
		}
		return _battleCtr;
	}

	abstract function openLobbyPage():Void;

	abstract function openBattlePage():Void;

	abstract function openRobotViewPage():Void;

	abstract function openPilotViewPage():Void;
}
