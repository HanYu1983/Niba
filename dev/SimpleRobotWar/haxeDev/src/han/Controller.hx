package han;

import haxe.ds.StringMap;
import common.Define;
import han.Define;

private class RobotView implements IRobot {
	final _info:Robot;

	public function new(info:Robot) {
		_info = info;
	}

	public function getId():String {
		return _info.id;
	}

	public function getTitle():String {
		return _info.title;
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

	public function getRobots():Map<String, IRobot> {
		return [
			for (info in _ctx.robots) {
				info.id => (new RobotView(info) : IRobot);
			}
		];
	}

	public function getPilots():Map<String, IPilot> {
		return new Map<String, IPilot>();
	}

	public function getWeapons():Map<String, IWeapon> {
		return new Map<String, IWeapon>();
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
