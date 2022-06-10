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
			// lobby
			case ON_CLICK_GOTO_ROBOT_VIEW:
				openRobotViewPage();
			case ON_CLICK_GOTO_PILOT_VIEW:
				openPilotViewPage();
			case ON_CLICK_GOTO_ROBOT_BUY(_):
			case ON_CLICK_ROBOT_VIEW_CANCEL:
				openLobbyPage();
			// battle
			case ON_CLICK_BATTLE_POS(pos):
				switch getBattleController().getUnitMenuState() {
					case NORMAL:
						openUnitMenu();
					// TODO: set to UNIT_MENU
					case UNIT_MENU:
					case UNIT_SELECT_MOVE_POSITION:
				}
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

	abstract function openUnitMenu():Void;
}
