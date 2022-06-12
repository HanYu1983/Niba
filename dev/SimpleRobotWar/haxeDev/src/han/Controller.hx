package han;

import haxe.Exception;
import haxe.Constraints;
import haxe.ds.StringMap;
import haxe.ds.EnumValueMap;
import common.IDefine;
import common.WeaponData;
import common.TerrianData;
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

private interface _ILobbyController extends ILobbyController extends ILobbyInfo {}

class LobbyController implements _ILobbyController {
	final _view:IView;
	var _ctx:Context = getDefaultContext();

	public function new(view:IView) {
		_view = view;
	}

	public function getContext():Context{
		return _ctx;
	}

	public function getLobbyInfo():ILobbyInfo {
		return this;
	}

	public function getRobots():IMap<String, RobotView> {
		// 使用String當key的話, 它應會自動判斷成StringMap
		return [
			for (info in _ctx.robots) {
				info.id => getRobotView(_ctx, info.id);
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

	public function onEvent(action:ViewEvent):Void {
		switch action {
			case ON_CLICK_ROBOT_BUY_WEAPON({robotId: robotId, weaponId: weaponId}):
			case _:
				_view.onEvent(action);
		}
	}
}

private interface _IBattleController extends IBattleController {}

class BattleController implements _IBattleController{
	final _view:IView;
	final _ctx:Context;

	public function new(ctx:Context, view:IView) {
		_ctx =ctx;
		_view = view;
	}

	public function getRobots():IMap<String, RobotView> {
		// 使用String當key的話, 它應會自動判斷成StringMap
		return [
			for (info in _ctx.robots) {
				info.id => getRobotView(_ctx, info.id);
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
			case _:
				_view.onEvent(action);
		}
	}
}

private interface IController extends ILobbyController extends IBattleController extends ILobbyInfo {}

class Controller implements IController {
	final _view:IView;
	final _lobbyController:LobbyController;
	var _battleController:BattleController;
	var _baseController:IBaseController;

	public function new(view:IView) {
		_view = view;
		_lobbyController = new LobbyController(view);
		_battleController = new BattleController(_lobbyController.getContext(), _view);

		initContext(_lobbyController.getContext());

		_baseController = _lobbyController;
		_view.startLobby(this);
	}

	public function getLobbyInfo():ILobbyInfo {
		return _lobbyController;
	}

	public function getRobots():IMap<String, RobotView> {
		return _baseController.getRobots();
	}

	public function getPilots():IMap<String, PilotView> {
		return _baseController.getPilots();
	}

	public function getWeapons():IMap<String, WeaponView> {
		return _baseController.getWeapons();
	}

	public function getGrids():IMap<Position, GridView> {
		return _battleController.getGrids();
	}

	public function getUnitMenuState():UnitMenuState {
		return _battleController.getUnitMenuState();
	}

	public function getUnitMenuItems():Array<UnitMenuItem> {
		return _battleController.getUnitMenuItems();
	}

	public function onEvent(action:ViewEvent):Void {
		switch action {
			case ON_CLICK_GOTO_LOBBY:
				_baseController = _lobbyController;
				_view.startLobby(this);
			case ON_CLICK_GOTO_BATTLE(options):
				_baseController = _battleController;
				_view.startBattle(this);
			case _:
				_baseController.onEvent(action);
		}
	}
}
