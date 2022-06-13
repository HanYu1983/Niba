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

typedef MoveRangeView = {
	pos:Array<Position>
}

private typedef BattleControlMemory = {
	originActiveRobotState: Null<{
		robotId:String,
		position:Position
	}>,
	robotMenuState:RobotMenuState,
	robotMenuView:Null<RobotMenuView>,
	systemMenuView:Null<SystemMenuView>,
	moveRangeView:Null<MoveRangeView>
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
		originActiveRobotState: null,
		robotMenuView: null,
		systemMenuView: null,
		moveRangeView: null,
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
		renderMoveRange();
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

	public function getMoveRangeView():Null<MoveRangeView> {
		return switch _battleControlMemory.robotMenuState {
			case ROBOT_MENU | ROBOT_SELECT_MOVE_POSITION:
				_battleControlMemory.moveRangeView;
			case _:
				null;
		}
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
							_battleControlMemory.originActiveRobotState = {
								robotId: robotId,
								position: pos
							};
							_battleControlMemory.robotMenuView = {
								menuItems: getBattleController().getRobotMenuItems(robotId)
							};
							_battleControlMemory.moveRangeView = {
								pos: getBattleController().getRobotMoveRange(robotId)
							};
							changeUnitMenuState(ROBOT_MENU);
						}
					case ROBOT_MENU:
					case ROBOT_SELECT_MOVE_POSITION:
						if(_battleControlMemory.originActiveRobotState == null){
							throw new Exception("即將要移動，但卻沒有找到originActiveRobotState");
						}
						final fromPos = _battleControlMemory.originActiveRobotState.position;
						final robotId = _battleControlMemory.originActiveRobotState.robotId;
						verbose("DefaultView", '假裝播放移動動畫:${robotId} from ${fromPos} to ${pos}');
						getBattleController().doRobotMove(robotId, fromPos, pos);
						_battleControlMemory.robotMenuView = {
							menuItems: getBattleController().getRobotMenuItems(robotId)
						};
						changeUnitMenuState(ROBOT_MENU);
						//renderBattlePage();
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
				switch item {
					case MOVE:
						changeUnitMenuState(ROBOT_SELECT_MOVE_POSITION);
					case ATTACK:
					case STATUS:
					case DONE:
						if(_battleControlMemory.originActiveRobotState == null){
							throw new Exception("即將要結束菜單，但卻沒有找到originActiveRobotState");
						}
						final robotId = _battleControlMemory.originActiveRobotState.robotId;
						if (robotId == null) {
							throw new Exception("即將要結束菜單，但卻沒有找到作用中的機體robotId");
						}
						getBattleController().doRobotDone(robotId);
						changeUnitMenuState(NORMAL);
				}
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

	abstract function renderBattlePage():Void;

	abstract function renderRobotMenu():Void;

	abstract function renderMoveRange():Void;

	abstract function renderSystemMenu():Void;
}
