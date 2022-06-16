package han.controller.battle;

import haxe.Exception;
import haxe.Constraints;
import haxe.Timer;
import haxe.ds.StringMap;
import haxe.ds.EnumValueMap;
import tool.Debug;
import tool.Helper;
import tool.optalg.Define;
import common.IDefine;
import common.WeaponData;
import common.TerrianData;
import han.alg.IDefine;
import han.alg.Path;
import han.model.IDefine;
import han.controller.common.IDefine;

using Lambda;

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

private interface _IBattleController extends IBattleController {}

@:nullSafety
class BattleController implements _IBattleController {
	final _view:IView;

	public function new(ctx:Context, view:IView) {
		_view = view;
		_ctxStacks.push(deepCopy(ctx));
	}

	public function getRobots():IMap<String, RobotView> {
		final ctx = getTopContext();
		return [
			for (pos => robotId in ctx.positionToRobot) {
				robotId => getRobotView(ctx, robotId, pos);
			}
		];
	}

	public function getPilots():IMap<String, PilotView> {
		final ctx = getTopContext();
		return [
			for (info in ctx.pilots) {
				info.id => getPilotView(ctx, info.id);
			}
		];
	}

	public function getWeapons():IMap<String, WeaponView> {
		final ctx = getTopContext();
		return [
			for (info in ctx.weapons) {
				info.id => getWeaponView(ctx, info.id);
			}
		];
	}

	public function getGrids():IMap<Position, GridView> {
		final ctx = getTopContext();
		return [
			for (pos => grid in ctx.grids) {
				final terrian = getTerrianData(grid.terrianId);
				pos => {
					terrianId: grid.terrianId,
					title: terrian.title,
					defRate: terrian.def,
					evadeRate: terrian.evade,
					robotId: ctx.positionToRobot.get(pos),
				}
			}
		];
	}

	public function getAttacks(robotId:String):Array<WeaponAttackView> {
		final ctx = getTopContext();
		return [
			for (attack in getRobotAttacks(ctx, robotId)) {
				{
					id: attack.id,
					weaponId: attack.weaponId,
					robotId: attack.robotId,
					title: attack.title,
					cost: attack.cost.map(cost -> {
						return switch cost {
							case ACTION(v):
								'行動力${v}';
							case BULLET(v):
								'彈藥${v}';
							case ENERGY(v):
								'能量${v}';
						};
					}).join(","),
					attackShape: switch attack.attackShape {
						case DOT(min, max):
							'單體(距${min}~${max})';
						case _:
							'待補上';
					},
					times: attack.times,
					hitRate: attack.hitRate,
					damage: attack.damage.map(damage -> switch damage {
						case PHYSICS(v):
							'物理(${v})';
						case BEAM(v):
							'光束(${v})';
						case EXPLODE(v):
							'爆炸(${v})';
						case FIRE(v):
							'火燒(${v})';
					}).join(","),
					attackFlag: attack.attackFlag.map(flag -> switch flag {
						case BEAM:
							'光束';
						case MELEE:
							'近戰';
						case MISSILE:
							'飛彈';
					}).join(","),
					isMelee: attack.isMelee,
				}
			}
		];
	}

	public function onEvent(action:ViewEvent):Void {
		final occupyCtr = getOccupyController();
		if (occupyCtr != null) {
			occupyCtr(action);
			return;
		}
		switch action {
			case ON_CLICK_BATTLE_POS(pos):
				switch getRobotMenuState() {
					case NORMAL:
						final robotId = getRobotIdByPosition(pos);
						if (robotId == null) {
							_battleControlMemory.systemMenuView = {
								menuItems: [TURN_END]
							};
							// 系統菜單
							pushRobotMenuState(SYSTEM_MENU);
							_view.invalidate();
						} else {
							// 單位菜單
							_battleControlMemory.originActiveRobotState = {
								robotId: robotId,
								position: pos
							};
							_battleControlMemory.robotMenuView = {
								menuItems: getRobotMenuItems(robotId)
							};
							_battleControlMemory.moveRangeView = {
								pos: getRobotMoveRange(robotId)
							};
							pushRobotMenuState(ROBOT_MENU);
							_view.invalidate();
						}
					case ROBOT_MENU:
					case ROBOT_SELECT_MOVE_POSITION:
						if (_battleControlMemory.originActiveRobotState == null) {
							throw new Exception("即將要移動，但卻沒有找到originActiveRobotState");
						}
						final fromPos = _battleControlMemory.originActiveRobotState.position;
						final robotId = _battleControlMemory.originActiveRobotState.robotId;
						final path = getRobotMovePath(pos);
						asyncSerial([
							cb -> {
								setOccupyController((evt) -> {});
								_view.animateRobotMove(robotId, path, cb);
							},
							cb -> {
								// 暫存狀態後移動
								pushState();
								doRobotMove(robotId, fromPos, pos);
								// 重抓菜單
								_battleControlMemory.robotMenuView = {
									menuItems: getRobotMenuItems(robotId)
								};
								pushRobotMenuState(ROBOT_MENU);
								_view.invalidate();
								setOccupyController(null);
								cb();
							}
						]);
					case _:
				}
			case ON_CLICK_CANCEL:
				if (_battleControlMemory.robotStatusView != null) {
					_battleControlMemory.robotStatusView = null;
					_view.invalidate();
				} else {
					switch getRobotMenuState() {
						case NORMAL:
						case ROBOT_MENU:
							popRobotMenuState();
							// 如果上一個狀態是選擇移動，將資料回復到移動前
							switch getRobotMenuState() {
								case ROBOT_SELECT_MOVE_POSITION:
									popState();
									// 重抓菜單
									if (_battleControlMemory.originActiveRobotState == null) {
										throw new Exception("沒有找到originActiveRobotState");
									}
									final robotId = _battleControlMemory.originActiveRobotState.robotId;
									_battleControlMemory.robotMenuView = {
										menuItems: getRobotMenuItems(robotId)
									};
								case _:
							}
							_view.invalidate();
						case ROBOT_SELECT_MOVE_POSITION | ROBOT_SELECT_WEAPON_ATTACK | ROBOT_SELECT_WEAPON_ATTACK_TARGET(_):
							popRobotMenuState();
							_view.invalidate();
						case SYSTEM_MENU:
							popRobotMenuState();
							_view.invalidate();
					}
				}
			case ON_CLICK_ROBOT_MENU_ITEM(item):
				switch item {
					case MOVE:
						pushRobotMenuState(ROBOT_SELECT_MOVE_POSITION);
						_view.invalidate();
					case ATTACK:
						if (_battleControlMemory.originActiveRobotState == null) {
							throw new Exception("即將要選武器攻擊，但卻沒有找到originActiveRobotState");
						}
						final robotId = _battleControlMemory.originActiveRobotState.robotId;
						_battleControlMemory.weaponAttackListView = {
							weaponAttacks: getAttacks(robotId)
						};
						pushRobotMenuState(ROBOT_SELECT_WEAPON_ATTACK);
						_view.invalidate();
					case STATUS:
						if (_battleControlMemory.originActiveRobotState == null) {
							throw new Exception("即將進入機體狀態頁，但卻沒有找到originActiveRobotState");
						}
						final robotId = _battleControlMemory.originActiveRobotState.robotId;
						_battleControlMemory.robotStatusView = {
							robotId: robotId,
							weaponAttacks: getAttacks(robotId)
						};
						_view.invalidate();
					case DONE:
						if (_battleControlMemory.originActiveRobotState == null) {
							throw new Exception("即將要結束菜單，但卻沒有找到originActiveRobotState");
						}
						final robotId = _battleControlMemory.originActiveRobotState.robotId;
						if (robotId == null) {
							throw new Exception("即將要結束菜單，但卻沒有找到作用中的機體robotId");
						}
						doRobotDone(robotId);
						applyState();
						pushRobotMenuState(NORMAL);
						_view.invalidate();
					case _:
				}
			case ON_CLICK_ROBOT_WEAPON_ATTACK({attackId: attackId, robotId: robotId}):
				final findAttack = _battleControlMemory.weaponAttackListView.weaponAttacks.filter(atk -> atk.id == attackId);
				if (findAttack.length == 0) {
					throw new Exception('attack not found: ${attackId}');
				}
				trace(findAttack);
			case ON_SYSTEM_ENEMY_TURN(step):
				switch (0) {
					case 0:
						final ctx = getTopContext();
						final robotNotDone = [
							for (pos => robotId in ctx.positionToRobot) {
								final robot = getRobot(ctx, robotId);
								final isDone = getRobot(ctx, robotId).flags.has(HAS_DONE);
								if (isDone == false) {
									robot;
								}
							}
						];
						if (robotNotDone.length > 0) {
							final robot = robotNotDone[0];
							asyncSerial([
								cb -> {
									setOccupyController(evt -> {});
									_view.animateRobotMove(robot.id, [POS(0, 1), POS(0, 2)], cb);
								},
								cb -> {
									doRobotDone(robot.id);
									_view.invalidate();
									setOccupyController(null);
									processEnemyTurn();
									cb();
								}
							]);
						} else {
							// 敵人按結束回合
							onEvent(ON_CLICK_SYSTEM_MENU_ITEM(TURN_END));
						}
				}
			case ON_CLICK_SYSTEM_MENU_ITEM(TURN_END):
				final ctx = getTopContext();
				onPlayerEnd(ctx.currentPlayerId);
				processEnemyTurn();
			case _:
				_view.onEvent(action);
		}
	}

	function getRobotMenuItems(robotId:String):Array<RobotMenuItem> {
		info("BattleController", 'getRobotMenuItems ${robotId}');
		final ctx = getTopContext();
		final robot = getRobot(ctx, robotId);
		final hasDone = robot.flags.has(HAS_DONE);
		if (hasDone) {
			return [STATUS];
		}
		final ret:Array<RobotMenuItem> = [];
		{
			final hasMove = robot.flags.has(HAS_MOVE);
			if (hasMove == false) {
				ret.push(MOVE);
			}
		}
		{
			final hasAttack = getRobotAttacks(ctx, robotId).length > 0;
			if (hasAttack) {
				ret.push(ATTACK);
			}
		}
		ret.push(STATUS);
		ret.push(DONE);
		return ret;
	}

	var _tree:Null<IMap<Position, ISolution<Position>>> = null;

	function getRobotMoveRange(robotId:String):Array<Position> {
		final ctx = getTopContext();
		final tree = han.alg.Path.getRobotMoveRange(ctx, robotId);
		_tree = tree;
		return [
			for (pos => solution in tree) {
				pos;
			}
		];
	}

	function getRobotMovePath(to:Position):Array<Position> {
		if (_tree == null) {
			throw new Exception("你必須先呼叫getRobotMoveRange");
		}
		return getPath(_tree, to);
	}

	function getRobotIdByPosition(pos:Position):Null<String> {
		final ctx = getTopContext();
		return ctx.positionToRobot.get(pos);
	}

	function doRobotMove(robotId:String, from:Position, to:Position):Void {
		info("BattleController", 'doRobotMove ${robotId} from ${from} to ${to}');
		final ctx = getTopContext();
		if (ctx.positionToRobot.get(from) != robotId) {
			throw new Exception('機體不在格子上: robotId(${robotId}) pos:${from}');
		}
		final robot = getRobot(ctx, robotId);
		robot.flags.push(HAS_MOVE);
		ctx.positionToRobot.remove(from);
		ctx.positionToRobot.set(to, robotId);
		info("BattleController", 'robot ${robot}');
	}

	function doRobotDone(robotId:String):Void {
		final ctx = getTopContext();
		final robot = getRobot(ctx, robotId);
		robot.flags.push(HAS_DONE);
	}

	function onPlayerEnd(playerId:Int) {
		final ctx = getTopContext();
		if (ctx.currentPlayerId != playerId) {
			warn("BattleController", "ctx.currentPlayerId != playerId");
			return;
		}
		ctx.currentPlayerId = (ctx.currentPlayerId + 1) % ctx.players.length;
	}

	function processEnemyTurn() {
		final ctx = getContext();
		final plyr = getPlayer(ctx, ctx.currentPlayerId);
		final isAI = ctx.currentPlayerId != 0;
		if (isAI == false) {
			return;
		}
		onEvent(ON_SYSTEM_ENEMY_TURN(0));
	}

	var _occupyCtr:Null<ViewEvent->Void>;

	function setOccupyController(ctr:Null<ViewEvent->Void>):Void {
		_occupyCtr = ctr;
	}

	function getOccupyController():Null<ViewEvent->Void> {
		return _occupyCtr;
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


	final _ctxStacks:Array<Context> = [];

	public function getContext():Context {
		if (_ctxStacks.length != 1) {
			throw new Exception("沒有正確處理上下文堆疊，結束遊戲時應該只有一個");
		}
		return _ctxStacks[0];
	}

	function getTopContext():Context {
		if (_ctxStacks.length == 0) {
			throw new Exception("請加入原始上下文");
		}
		final topCtx = _ctxStacks[_ctxStacks.length - 1];
		return topCtx;
	}

	function pushState():Void {
		final ctx = getTopContext();
		_ctxStacks.push(deepCopy(ctx));
	}

	function popState():Void {
		if (_ctxStacks.length <= 1) {
			throw new Exception("不能把原始上下文移除");
		}
		_ctxStacks.pop();
	}

	function applyState():Void {
		final ctx = getTopContext();
		while (_ctxStacks.length > 0) {
			_ctxStacks.pop();
		}
		_ctxStacks.push(ctx);
	}
}
