package common.view.ver1;

import haxe.Timer;
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
	// 選擇攻擊武器時
	ROBOT_SELECT_WEAPON_ATTACK;
	SYSTEM_MENU;
}

typedef RobotMenuView = {
	menuItems:Array<RobotMenuItem>
}

typedef SystemMenuView = {
	menuItems:Array<SystemMenuItem>
}

typedef MoveRangeView = {
	pos:Array<Position>
}

typedef WeaponAttackListView = {
	weaponAttacks:Array<WeaponAttackView>
}

typedef RobotStatusView = {
	robotId:String,
	weaponAttacks:Array<WeaponAttackView>
}

private typedef BattleControlMemory = {
	originActiveRobotState:Null<{
		robotId:String,
		position:Position
	}>,
	robotMenuState:Array<RobotMenuState>,
	robotMenuView:Null<RobotMenuView>,
	systemMenuView:Null<SystemMenuView>,
	moveRangeView:Null<MoveRangeView>,
	weaponAttackListView:Null<WeaponAttackListView>,
	robotStatusView:Null<RobotStatusView>
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
		robotMenuState: [NORMAL],
		originActiveRobotState: null,
		robotMenuView: null,
		systemMenuView: null,
		moveRangeView: null,
		weaponAttackListView: null,
		robotStatusView: null,
	};

	function pushRobotMenuState(state:RobotMenuState) {
		info("DefaultView", 'pushRobotMenuState ${_battleControlMemory.robotMenuState} to ${state}');
		final originState = getRobotMenuState();
		if (originState == state) {
			return;
		}
		_battleControlMemory.robotMenuState.push(state);
	}

	function popRobotMenuState() {
		if (_battleControlMemory.robotMenuState.length <= 1) {
			throw new Exception("robotMenuState必須最少有一個NORMAL狀態");
		}
		_battleControlMemory.robotMenuState.pop();
	}

	public function getRobotMenuState():RobotMenuState {
		if (_battleControlMemory.robotMenuState.length == 0) {
			throw new Exception("robotMenuState必須最少有一個NORMAL狀態");
		}
		return _battleControlMemory.robotMenuState[_battleControlMemory.robotMenuState.length - 1];
	}

	public function getRobotMenuView():Null<RobotMenuView> {
		return switch getRobotMenuState() {
			case ROBOT_MENU:
				_battleControlMemory.robotMenuView;
			case _:
				null;
		}
	}

	public function getSystemMenuView():Null<SystemMenuView> {
		return switch getRobotMenuState() {
			case SYSTEM_MENU:
				_battleControlMemory.systemMenuView;
			case _:
				null;
		}
	}

	public function getMoveRangeView():Null<MoveRangeView> {
		return switch getRobotMenuState() {
			case ROBOT_MENU | ROBOT_SELECT_MOVE_POSITION:
				_battleControlMemory.moveRangeView;
			case _:
				null;
		}
	}

	public function getWeaponAttackListView():Null<WeaponAttackListView> {
		return switch getRobotMenuState() {
			case ROBOT_SELECT_WEAPON_ATTACK:
				_battleControlMemory.weaponAttackListView;
			case _:
				null;
		}
	}

	public function getRobotStatusView():Null<RobotStatusView> {
		return _battleControlMemory.robotStatusView;
	}

	public function onEvent(action:ViewEvent):Void {
		info("DefaultView", 'onEvent ${action}');
		final occupyCtr = getOccupyController();
		if (occupyCtr != null) {
			occupyCtr(action);
			return;
		}
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
				switch getRobotMenuState() {
					case NORMAL:
						final robotId = getBattleController().getRobotIdByPosition(pos);
						if (robotId == null) {
							_battleControlMemory.systemMenuView = {
								menuItems: [TURN_END]
							};
							// 系統菜單
							pushRobotMenuState(SYSTEM_MENU);
							renderBattlePage();
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
							pushRobotMenuState(ROBOT_MENU);
							renderBattlePage();
						}
					case ROBOT_MENU:
					case ROBOT_SELECT_MOVE_POSITION:
						if (_battleControlMemory.originActiveRobotState == null) {
							throw new Exception("即將要移動，但卻沒有找到originActiveRobotState");
						}
						final fromPos = _battleControlMemory.originActiveRobotState.position;
						final robotId = _battleControlMemory.originActiveRobotState.robotId;
						final path = getBattleController().getRobotMovePath(pos);
						addTask((cb) -> {
							setOccupyController((evt) -> {});
							animateRobotMove(robotId, fromPos, pos, path, cb);
						});
						addTask((cb) -> {
							// 暫存狀態後移動
							getBattleController().pushState();
							getBattleController().doRobotMove(robotId, fromPos, pos);
							// 重抓菜單
							_battleControlMemory.robotMenuView = {
								menuItems: getBattleController().getRobotMenuItems(robotId)
							};
							pushRobotMenuState(ROBOT_MENU);
							renderBattlePage();
							setOccupyController(null);
							cb();
						});
						startTask();
					case _:
				}
			case ON_CLICK_CANCEL:
				if (_battleControlMemory.robotStatusView != null) {
					_battleControlMemory.robotStatusView = null;
					renderBattlePage();
				} else {
					switch getRobotMenuState() {
						case NORMAL:
						case ROBOT_MENU:
							popRobotMenuState();
							// 如果上一個狀態是選擇移動，將資料回復到移動前
							switch getRobotMenuState() {
								case ROBOT_SELECT_MOVE_POSITION:
									getBattleController().popState();
									// 重抓菜單
									if (_battleControlMemory.originActiveRobotState == null) {
										throw new Exception("沒有找到originActiveRobotState");
									}
									final robotId = _battleControlMemory.originActiveRobotState.robotId;
									_battleControlMemory.robotMenuView = {
										menuItems: getBattleController().getRobotMenuItems(robotId)
									};
								case _:
							}
							renderBattlePage();
						case ROBOT_SELECT_MOVE_POSITION:
							popRobotMenuState();
							renderBattlePage();
						case ROBOT_SELECT_WEAPON_ATTACK:
							popRobotMenuState();
							renderBattlePage();
						case SYSTEM_MENU:
							popRobotMenuState();
							renderBattlePage();
					}
				}
			case ON_CLICK_ROBOT_MENU_ITEM(item):
				switch item {
					case MOVE:
						pushRobotMenuState(ROBOT_SELECT_MOVE_POSITION);
						renderBattlePage();
					case ATTACK:
						if (_battleControlMemory.originActiveRobotState == null) {
							throw new Exception("即將要選武器攻擊，但卻沒有找到originActiveRobotState");
						}
						final robotId = _battleControlMemory.originActiveRobotState.robotId;
						_battleControlMemory.weaponAttackListView = {
							weaponAttacks: getBattleController().getAttacks(robotId)
						};
						pushRobotMenuState(ROBOT_SELECT_WEAPON_ATTACK);
						renderBattlePage();
					case STATUS:
						if (_battleControlMemory.originActiveRobotState == null) {
							throw new Exception("即將進入機體狀態頁，但卻沒有找到originActiveRobotState");
						}
						final robotId = _battleControlMemory.originActiveRobotState.robotId;
						_battleControlMemory.robotStatusView = {
							robotId: robotId,
							weaponAttacks: getBattleController().getAttacks(robotId)
						};
						renderBattlePage();
					case DONE:
						if (_battleControlMemory.originActiveRobotState == null) {
							throw new Exception("即將要結束菜單，但卻沒有找到originActiveRobotState");
						}
						final robotId = _battleControlMemory.originActiveRobotState.robotId;
						if (robotId == null) {
							throw new Exception("即將要結束菜單，但卻沒有找到作用中的機體robotId");
						}
						getBattleController().doRobotDone(robotId);
						getBattleController().applyState();
						pushRobotMenuState(NORMAL);
						renderBattlePage();
					case _:
				}
			case ON_SYSTEM_ENEMY_TURN(_):
				renderBattlePage();
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

	var _occupyCtr:Null<ViewEvent->Void>;

	function setOccupyController(ctr:Null<ViewEvent->Void>) {
		_occupyCtr = ctr;
	}

	function getOccupyController():Null<ViewEvent->Void> {
		return _occupyCtr;
	}

	final _tasks:Array<(() -> Void)->Void> = [];

	function addTask(task:(() -> Void)->Void):Void {
		_tasks.push(task);
	}

	function startTask() {
		final task = _tasks.shift();
		if (task != null) {
			task(startTask);
		}
	}

	abstract function openLobbyPage():Void;

	abstract function openBattlePage():Void;

	abstract function openRobotViewPage():Void;

	abstract function openPilotViewPage():Void;

	abstract function renderBattlePage():Void;

	abstract function animateRobotMove(robotId:String, from:Position, to:Position, path:Array<Position>, cb:() -> Void):Void;
}
