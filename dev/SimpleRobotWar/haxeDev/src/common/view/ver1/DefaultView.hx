package common.view.ver1;

import haxe.Exception;
import common.IDefine;
import tool.Debug;

using Lambda;

enum RobotMenuState {
	// 沒開狀態
	NORMAL;
	// 打開菜單
	ROBOT_MENU;
	// 選擇移動位置時
	ROBOT_SELECT_MOVE_POSITION;
}

enum SyncViewOperation {
	OPEN;
	CLOSE;
	UPDATE;
}

private typedef BattleControlMemory = {
	activePosition:Null<Position>,
	robotMenuState:RobotMenuState
}

@:nullSafety
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
		robotMenuState: NORMAL,
		activePosition: null,
	};

	function changeUnitMenuState(state:RobotMenuState) {
		info("DefaultView", 'changeUnitMenuState ${_battleControlMemory.robotMenuState} to ${state}');
		final originState = _battleControlMemory.robotMenuState;
		if (originState == state) {
			return;
		}
		_battleControlMemory.robotMenuState = state;
		switch [originState, state] {
			case [ROBOT_MENU, ROBOT_SELECT_MOVE_POSITION]:
				renderRobotMenu(CLOSE);
			case [ROBOT_MENU, _]:
				renderRobotMenu(CLOSE);
				renderMoveRange(CLOSE);
			case [_, ROBOT_MENU]:
				renderRobotMenu(OPEN);
				renderMoveRange(OPEN);
			case _:
		}
	}

	public function getRobotMenuState():RobotMenuState {
		return _battleControlMemory.robotMenuState;
	}

	public function getActivePosition():Position {
		if (_battleControlMemory.activePosition == null) {
			throw new Exception("activePosition == null");
		}
		return _battleControlMemory.activePosition;
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
				switch _battleControlMemory.robotMenuState {
					case NORMAL:
						final robotId = getBattleController().getRobotIdByPosition(pos);
						if (robotId == null) {
							// 系統菜單
							renderSystemMenu(OPEN);
						} else {
							// 單位菜單
							_battleControlMemory.activePosition = pos;
							changeUnitMenuState(ROBOT_MENU);
						}
					case ROBOT_MENU:
					case ROBOT_SELECT_MOVE_POSITION:
				}
			case ON_CLICK_CANCEL:
				switch _battleControlMemory.robotMenuState {
					case NORMAL:
					case ROBOT_MENU:
						changeUnitMenuState(NORMAL);
					case ROBOT_SELECT_MOVE_POSITION:
						changeUnitMenuState(ROBOT_MENU);
				}
			case ON_CLICK_ROBOT_MENU_ITEM(item):
				changeUnitMenuState(ROBOT_SELECT_MOVE_POSITION);
			case _:
		}
	}

	public function getLobbyController():ILobbyController {
		if (_lobbyCtr == null) {
			throw new Exception("your must call startLobby first");
		}
		return _lobbyCtr;
	}

	public function getBattleController():IBattleController {
		if (_battleCtr == null) {
			throw new Exception("your must call startBattle first");
		}
		return _battleCtr;
	}

	abstract function openLobbyPage(op:SyncViewOperation):Void;

	abstract function openBattlePage(op:SyncViewOperation):Void;

	abstract function openRobotViewPage(op:SyncViewOperation):Void;

	abstract function openPilotViewPage(op:SyncViewOperation):Void;

	abstract function renderRobotMenu(op:SyncViewOperation):Void;

	abstract function renderMoveRange(op:SyncViewOperation):Void;

	abstract function renderSystemMenu(op:SyncViewOperation):Void;
}
