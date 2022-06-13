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
	SYSTEM_MENU;
}

typedef RobotMenuView = {
	menuItems:Array<RobotMenuItem>
}

typedef SystemMenuView = {}

private typedef BattleControlMemory = {
	activePosition:Null<Position>,
	robotMenuState:RobotMenuState,
	robotMenuView:Null<RobotMenuView>,
	systemMenuView:Null<SystemMenuView>
}

@:nullSafety
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

	final _battleControlMemory:BattleControlMemory = {
		robotMenuState: NORMAL,
		activePosition: null,
		robotMenuView: null,
		systemMenuView: null,
	};

	function changeUnitMenuState(state:RobotMenuState) {
		info("DefaultView", 'changeUnitMenuState ${_battleControlMemory.robotMenuState} to ${state}');
		final originState = _battleControlMemory.robotMenuState;
		if (originState == state) {
			return;
		}
		_battleControlMemory.robotMenuState = state;
		renderRobotMenu();
		renderSystemMenu();
	}

	public function getRobotMenuState():RobotMenuState {
		return _battleControlMemory.robotMenuState;
	}

	public function getRobotMenuView():Null<RobotMenuView> {
		return switch _battleControlMemory.robotMenuState {
			case ROBOT_MENU:
				_battleControlMemory.robotMenuView;
			case _:
				null;
		}
	}

	public function getSystemMenuView():Null<SystemMenuView> {
		return switch _battleControlMemory.robotMenuState {
			case SYSTEM_MENU:
				_battleControlMemory.systemMenuView;
			case _:
				null;
		}
	}

	public function getActivePosition():Position {
		if (_battleControlMemory.activePosition == null) {
			throw new Exception("activePosition == null");
		}
		return _battleControlMemory.activePosition;
	}

	public function onEvent(action:ViewEvent):Void {
		info("DefaultView", 'onEvent ${action}');
		switch action {
			// lobby
			case ON_CLICK_GOTO_ROBOT_VIEW:
				openRobotViewPage();
			case ON_CLICK_GOTO_PILOT_VIEW:
				openPilotViewPage();
			case ON_CLICK_GOTO_ROBOT_BUY(_):
			case ON_CLICK_ROBOT_BUY_WEAPON({robotId: robotId, weaponId: weaponId}):
			case ON_CLICK_ROBOT_VIEW_CANCEL:
				openLobbyPage();
			// battle
			case ON_CLICK_BATTLE_POS(pos):
				switch _battleControlMemory.robotMenuState {
					case NORMAL:
						final robotId = getBattleController().getRobotIdByPosition(pos);
						if (robotId == null) {
							_battleControlMemory.systemMenuView = {};
							// 系統菜單
							changeUnitMenuState(SYSTEM_MENU);
						} else {
							// 單位菜單
							_battleControlMemory.activePosition = pos;
							_battleControlMemory.robotMenuView = {
								menuItems: getBattleController().getRobotMenuItemsByPosition(pos)
							};
							changeUnitMenuState(ROBOT_MENU);
						}
					case ROBOT_MENU:
					case ROBOT_SELECT_MOVE_POSITION:
						verbose("DefaultView", '處理移動');
					case SYSTEM_MENU:
				}
			case ON_CLICK_CANCEL:
				switch _battleControlMemory.robotMenuState {
					case NORMAL:
					case ROBOT_MENU:
						changeUnitMenuState(NORMAL);
					case ROBOT_SELECT_MOVE_POSITION:
						changeUnitMenuState(ROBOT_MENU);
					case SYSTEM_MENU:
						changeUnitMenuState(NORMAL);
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

	abstract function openLobbyPage():Void;

	abstract function openBattlePage():Void;

	abstract function openRobotViewPage():Void;

	abstract function openPilotViewPage():Void;

	abstract function renderRobotMenu():Void;

	abstract function renderMoveRange():Void;

	abstract function renderSystemMenu():Void;
}
