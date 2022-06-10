package han;

import haxe.Exception;
import haxe.ds.StringMap;
import common.Define;
import common.Data;
import han.Define;
import han.alg.Define;

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
		{
			final robot = createRobot('${_ctx.idSeq++}');
			_ctx.robots.set(robot.id, robot);

			final pilot = createPilot('${_ctx.idSeq++}');
			_ctx.pilots.set(pilot.id, pilot);
			_ctx.pilotToRobot.set(pilot.id, robot.id);

			final weapon = createWeapon('${_ctx.idSeq++}');
			_ctx.weapons.set(weapon.id, weapon);
			_ctx.weaponToRobot.set(weapon.id, robot.id);
		}
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

	public function getMap(x:Int, y:Int, w:Int, h:Int):Array<GridView> {
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
