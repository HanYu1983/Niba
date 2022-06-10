package han;

import haxe.Exception;
import haxe.ds.StringMap;
import haxe.ds.EnumValueMap;
import common.IDefine;
import common.IData;
import han.alg.IDefine;
import han.model.IDefine;

private function getRobotView(ctx:Context, robotId:String):RobotView {
	final robot = getRobot(ctx, robotId);
	final pilot = getRobotPilot(ctx, robotId);
	final weapons = getRobotWeapons(ctx, robotId);
	return {
		id: robot.id,
		title: robot.title,
		pilotId: pilot != null ? pilot.id : null,
		weaponIds: weapons.map(w -> w.id),
		hp: robot.hp,
		energy: robot.energy,
		action: robot.action,
		maxHp: robot.maxHp,
		maxEnergy: robot.maxEnergy,
		maxAction: robot.maxAction,
	}
}

private function getPilotView(ctx:Context, id:String):PilotView {
	final pilot = getPilot(ctx, id);
	final robotId = ctx.pilotToRobot.get(id);
	return {
		id: pilot.id,
		title: pilot.title,
		robotId: robotId,
		melee: pilot.melee,
		range: pilot.range,
		attack: pilot.attack,
		guard: pilot.guard,
		lucky: pilot.lucky,
	}
}

private function getWeaponView(ctx:Context, id:String):WeaponView {
	final weapon = getWeapon(ctx, id);
	final weaponData = getWeaponData(weapon.dataId);
	final robotId = ctx.weaponToRobot.get(id);
	return {
		id: weapon.id,
		title: weaponData.title,
		robotId: robotId,
		level: weapon.level,
		bullet: weapon.bullet,
	}
}

private interface IController extends ILobbyController extends IBattleController extends ILobbyInfo {}

class Controller implements IController {
	final _view:IView;

	var _ctx:Context = getDefaultContext();

	public function new(view:IView) {
		_view = view;
		initContext(_ctx);
		_view.startLobby(this);
	}

	public function getLobbyInfo():ILobbyInfo {
		return this;
	}

	public function getRobots():Map<String, RobotView> {
		return [
			for (info in _ctx.robots) {
				info.id => getRobotView(_ctx, info.id);
			}
		];
	}

	public function getPilots():Map<String, PilotView> {
		return [
			for (info in _ctx.pilots) {
				info.id => getPilotView(_ctx, info.id);
			}
		];
	}

	public function getWeapons():Map<String, WeaponView> {
		return [
			for (info in _ctx.weapons) {
				info.id => getWeaponView(_ctx, info.id);
			}
		];
	}

	public function getGrids():EnumValueMap<Position, GridView> {
		return [
			for (pos => grid in _ctx.grids) {
				final terrian = TERRIANS[grid.terrianId];
				pos => {
					title: terrian.title,
					defRate: terrian.def,
					evadeRate: terrian.evade,
					robotId: null,
				}
			}
		];
	}

	public function getUnitMenuState():UnitMenuState {
		return NORMAL;
	}

	public function getUnitMenuItems():Array<UnitMenuItem> {
		return [];
	}

	public function onEvent(action:ViewEvent):Void {
		switch action {
			case ON_CLICK_GOTO_LOBBY:
				_view.startLobby(this);
			case ON_CLICK_GOTO_BATTLE(options):
				_view.startBattle(this);
			case ON_CLICK_ROBOT_BUY_WEAPON({robotId: robotId, weaponId: weaponId}):
			case _:
				_view.onEvent(action);
		}
	}
}
