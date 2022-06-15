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

private interface _IBattleController extends IBattleController {}

@:nullSafety
class BattleController implements _IBattleController {
	final _view:IView;
	final _ctxStacks:Array<Context> = [];

	public function new(ctx:Context, view:IView) {
		_view = view;
		_ctxStacks.push(deepCopy(ctx));
	}

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

	public function getRobotMenuItems(robotId:String):Array<RobotMenuItem> {
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

	public function getRobotMoveRange(robotId:String):Array<Position> {
		final ctx = getTopContext();
		final tree = han.alg.Path.getRobotMoveRange(ctx, robotId);
		_tree = tree;
		return [
			for (pos => solution in tree) {
				pos;
			}
		];
	}

	public function getRobotMovePath(to:Position):Array<Position> {
		if (_tree == null) {
			throw new Exception("你必須先呼叫getRobotMoveRange");
		}
		return getPath(_tree, to);
	}

	public function getRobotIdByPosition(pos:Position):Null<String> {
		final ctx = getTopContext();
		return ctx.positionToRobot.get(pos);
	}

	public function doRobotMove(robotId:String, from:Position, to:Position):Void {
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

	public function doRobotDone(robotId:String):Void {
		final ctx = getTopContext();
		final robot = getRobot(ctx, robotId);
		robot.flags.push(HAS_DONE);
	}

	public function pushState():Void {
		final ctx = getTopContext();
		_ctxStacks.push(deepCopy(ctx));
	}

	public function popState():Void {
		if (_ctxStacks.length <= 1) {
			throw new Exception("不能把原始上下文移除");
		}
		_ctxStacks.pop();
	}

	public function applyState():Void {
		final ctx = getTopContext();
		while (_ctxStacks.length > 0) {
			_ctxStacks.pop();
		}
		_ctxStacks.push(ctx);
	}

	public function onEvent(action:ViewEvent):Void {
		final occupyCtr = getOccupyController();
		if (occupyCtr != null) {
			occupyCtr(action);
			return;
		}
		switch action {
			case ON_SYSTEM_ENEMY_TURN(step):
			//			 case ON_CLICK_BATTLE_POS(pos):
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
									getAnimationController().animateRobotMove(robot.id, [POS(0, 1), POS(0, 2)], cb);
								},
								cb -> {
									doRobotDone(robot.id);
									getAnimationController().invalidate();
									setOccupyController(null);
									processEnemyTurn();
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

	public function setOccupyController(ctr:Null<ViewEvent->Void>):Void {
		_occupyCtr = ctr;
	}

	public function getOccupyController():Null<ViewEvent->Void> {
		return _occupyCtr;
	}

	// final _tasks:Array<(() -> Void)->Void> = [];

	// public function addTask(task:(() -> Void)->Void):Void {
	// 	_tasks.push(task);
	// }

	// public function startTask():Void {
	// 	final task = _tasks.shift();
	// 	if (task != null) {
	// 		task(startTask);
	// 	}
	// }

	var _animationCtr:Null<IAnimationController>;

	public function setAnimationController(v:IAnimationController):Void {
		_animationCtr = v;
	}

	function getAnimationController():IAnimationController {
		if (_animationCtr == null) {
			throw new Exception("you must call setAnimationController first");
		}
		return _animationCtr;
	}
}
