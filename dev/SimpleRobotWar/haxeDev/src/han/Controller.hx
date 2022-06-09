package han;

import haxe.Exception;
import haxe.ds.StringMap;
import common.Define;
import han.Define;

private function getRobotView(ctx:Context, robotId:String):RobotView {
	final robot = ctx.robots.get(robotId);
	if (robot == null) {
		throw new Exception('robot not found:${robotId}');
	}
	return {
		id: robot.id,
		title: robot.title
	}
}

private interface IController extends ILobbyController extends IBattleController extends ILobbyInfo {}

class Controller implements IController {
	final _view:IView;

	var _ctx:Context = getDefaultContext();

	public function new(view:IView) {
		_view = view;
		final tmp = createRobot("0");
		_ctx.robots.set(tmp.id, tmp);
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
		return new Map<String, PilotView>();
	}

	public function getWeapons():Map<String, WeaponView> {
		return new Map<String, WeaponView>();
	}

	public function getMap(x:Int, y:Int, w:Int, h:Int):Array<IGrid> {
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
