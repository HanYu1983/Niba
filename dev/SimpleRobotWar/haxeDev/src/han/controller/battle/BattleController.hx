package han.controller.battle;

import haxe.Exception;
import haxe.Constraints;
import haxe.ds.StringMap;
import haxe.ds.EnumValueMap;
import common.IDefine;
import common.WeaponData;
import common.TerrianData;
import han.alg.IDefine;
import han.alg.Path;
import han.model.IDefine;
import han.controller.common.IDefine;
import tool.Debug;

using Lambda;

private interface _IBattleController extends IBattleController {}

class BattleController implements _IBattleController {
	final _view:IView;
	final _ctx:Context;

	public function new(ctx:Context, view:IView) {
		_ctx = ctx;
		_view = view;
	}

	public function getRobots():IMap<String, RobotView> {
		// 使用String當key的話, 它應會自動判斷成StringMap
		return [
			for (pos => robotId in _ctx.positionToRobot) {
				robotId => getRobotView(_ctx, robotId, pos);
			}
		];
	}

	public function getPilots():IMap<String, PilotView> {
		// 使用String當key的話, 它應會自動判斷成StringMap
		return [
			for (info in _ctx.pilots) {
				info.id => getPilotView(_ctx, info.id);
			}
		];
	}

	public function getWeapons():IMap<String, WeaponView> {
		// 使用String當key的話, 它應會自動判斷成StringMap
		return [
			for (info in _ctx.weapons) {
				info.id => getWeaponView(_ctx, info.id);
			}
		];
	}

	public function getGrids():IMap<Position, GridView> {
		// 使用enum當key的話, 它確定會自動判斷成EnumValueMap
		return [
			for (pos => grid in _ctx.grids) {
				final terrian = getTerrianData(grid.terrianId);
				pos => {
					terrianId: grid.terrianId,
					title: terrian.title,
					defRate: terrian.def,
					evadeRate: terrian.evade,
					robotId: _ctx.positionToRobot.get(pos),
				}
			}
		];
	}

	public function getAttacks(robotId:String):Array<AttackView> {
		return [
			for (attack in getRobotAttacks(_ctx, robotId)) {
				{
					id: attack.id,
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
					attackFlag: attack.attackFlag.map(flag-> switch flag {
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
		final robot = getRobot(_ctx, robotId);
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
		ret.push(STATUS);
		ret.push(DONE);
		return ret;
	}

	public function getRobotMoveRange(robotId:String):Array<Position> {
		return han.alg.Path.getRobotMoveRange(_ctx, robotId);
	}

	public function getRobotIdByPosition(pos:Position):Null<String> {
		return _ctx.positionToRobot.get(pos);
	}

	public function doRobotMove(robotId:String, from:Position, to:Position):Void {
		info("BattleController", 'doRobotMove ${robotId} from ${from} to ${to}');
		if (_ctx.positionToRobot.get(from) != robotId) {
			throw new Exception('機體不在格子上: robotId(${robotId}) pos:${from}');
		}
		final robot = getRobot(_ctx, robotId);
		robot.flags.push(HAS_MOVE);
		_ctx.positionToRobot.remove(from);
		_ctx.positionToRobot.set(to, robotId);
		info("BattleController", 'robot ${robot}');
	}

	public function doRobotDone(robotId:String):Void {
		final robot = getRobot(_ctx, robotId);
		robot.flags.push(HAS_DONE);
	}

	public function onEvent(action:ViewEvent):Void {
		switch action {
			case _:
				_view.onEvent(action);
		}
	}
}
