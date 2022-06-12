package han.view.ver1;

import haxe.Exception;
import common.IDefine;

enum SyncViewOperation {
	OPEN;
	CLOSE;
	UPDATE;
}

private enum UnitMenuState {
	NORMAL;
	UNIT_MENU;
	UNIT_SELECT_MOVE_POSITION;
}

private typedef BattleControlMemory = {
	unitMenuState:UnitMenuState
}

abstract class DefaultView implements IView {
	public function new() {}

	var _lobbyCtr:Null<ILobbyController>;
	var _battleCtr:Null<IBattleController>;

	public function startLobby(ctr:ILobbyController):Void {
		_lobbyCtr = ctr;
		openLobbyPage(OPEN);
	}

	public function startBattle(ctr:IBattleController):Void {
		_battleCtr = ctr;
		openBattlePage(OPEN);
	}

	final _battleControlMemory:BattleControlMemory = {
		unitMenuState: NORMAL
	};

	function changeUnitMenuState(state:UnitMenuState) {
		_battleControlMemory.unitMenuState = state;
	}

	public function onEvent(action:ViewEvent):Void {
		switch action {
			// lobby
			case ON_CLICK_GOTO_ROBOT_VIEW:
				openRobotViewPage(OPEN);
			case ON_CLICK_GOTO_PILOT_VIEW:
				openPilotViewPage(OPEN);
			case ON_CLICK_GOTO_ROBOT_BUY(_):
			case ON_CLICK_ROBOT_BUY_WEAPON({robotId: robotId, weaponId: weaponId}):
			case ON_CLICK_ROBOT_VIEW_CANCEL:
				openLobbyPage(OPEN);
			// battle
			case ON_CLICK_BATTLE_POS(pos):
				switch _battleControlMemory.unitMenuState {
					case NORMAL:
						openUnitMenu(OPEN);
						changeUnitMenuState(UNIT_MENU);
					case UNIT_MENU:
					case UNIT_SELECT_MOVE_POSITION:
				}
			case ON_CLICK_CANCEL:
				switch _battleControlMemory.unitMenuState {
					case NORMAL:
					case UNIT_MENU:
						openUnitMenu(CLOSE);
						changeUnitMenuState(NORMAL);
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

	abstract function openLobbyPage(op:SyncViewOperation):Void;

	abstract function openBattlePage(op:SyncViewOperation):Void;

	abstract function openRobotViewPage(op:SyncViewOperation):Void;

	abstract function openPilotViewPage(op:SyncViewOperation):Void;

	abstract function openUnitMenu(op:SyncViewOperation):Void;
}
