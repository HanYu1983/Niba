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
				robotId => getRobotView(_ctx, robotId);
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

	public function getRobotMenuItemsByPosition(pos:Position):Array<RobotMenuItem> {
		final robotId = _ctx.positionToRobot.get(pos);
		if (robotId == null) {
			throw new Exception("要打開機體菜單卻沒有選到有機體的格子");
		}
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

	public function getRobotMoveRangeByPosition(pos:Position):Array<Position> {
		return han.alg.Path.getRobotMoveRangeByPosition(_ctx, pos);
	}

	public function getRobotIdByPosition(pos:Position):Null<String> {
		return _ctx.positionToRobot.get(pos);
	}

	public function doRobotMove(robotId:String, from:Position, to:Position):Void {
		if(_ctx.positionToRobot.get(from) != robotId){
			throw new Exception('機體不在格子上: robotId(${robotId}) pos:${from}');
		}
		final robot = getRobot(_ctx, robotId);
		robot.flags.push(HAS_MOVE);
		_ctx.positionToRobot.remove(from);
		_ctx.positionToRobot.set(to, robotId);
	}

	public function doRobotDone(robotId:String):Void{
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
