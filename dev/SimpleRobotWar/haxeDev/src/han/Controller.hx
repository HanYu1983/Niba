package han;

import haxe.ds.StringMap;
import common.Define;
import han.Define;

private interface IController extends ILobbyController extends IBattleController extends ILobbyInfo {}

class Controller implements IController {
	final _view:IView;

	public function new(view:IView) {
		_view = view;
		_view.startLobby(this);
	}

	var _ctx:Context = getDefaultContext();

	public function getLobbyInfo():ILobbyInfo {
		return this;
	}

	public function getRobots():StringMap<IRobot> {
		return new StringMap<IRobot>();
	}

	public function getPilots():StringMap<IPilot> {
		return new StringMap<IPilot>();
	}

	public function getWeapons():StringMap<IWeapon> {
		return new StringMap<IWeapon>();
	}

	public function getMap(x:Int, y:Int, w:Int, h:Int):Array<IGrid> {
		return [];
	}

	public function save() {}

	public function load() {}

	public function onAction(action:ViewAction):Void {
		switch action {
			case GOTO_LOBBY_ACTION:
				_view.startLobby(this);
			case GOTO_BATTLE_ACTION:
				_view.startBattle(this);
		}
	}
}
