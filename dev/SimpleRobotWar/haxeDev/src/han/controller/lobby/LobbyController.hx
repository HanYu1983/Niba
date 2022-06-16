package han.controller.lobby;

import haxe.Exception;
import haxe.Constraints;
import haxe.ds.StringMap;
import haxe.ds.EnumValueMap;
import common.IDefine;
import common.WeaponData;
import common.TerrianData;
import han.alg.IDefine;
import han.model.IDefine;
import han.controller.common.IDefine;

private interface _ILobbyController extends ILobbyController extends ILobbyInfo {}

class LobbyController implements _ILobbyController {
	final _view:IView;
	var _ctx:Context = getDefaultContext();

	public function new(view:IView) {
		_view = view;
	}

	public function getContext():Context {
		return _ctx;
	}

	public function getLobbyInfo():ILobbyInfo {
		return this;
	}

	public function getRobots():IMap<String, RobotView> {
		// 使用String當key的話, 它應會自動判斷成StringMap
		return [
			for (info in _ctx.robots) {
				info.id => getRobotView(_ctx, info.id, null);
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

	public function getAttacks(robotId:String):Array<WeaponAttackView> {
		return [];
	}

	public function onEvent(action:ViewEvent):Void {
		switch action {
			// lobby
			case ON_CLICK_GOTO_ROBOT_VIEW:
				_view.changePage(ROBOT_VIEW);
			case ON_CLICK_GOTO_PILOT_VIEW:
				_view.changePage(PILOT_VIEW);
			case ON_CLICK_GOTO_ROBOT_BUY(_):
			case ON_CLICK_ROBOT_BUY_WEAPON({robotId: robotId, weaponId: weaponId}):
			case ON_CLICK_ROBOT_VIEW_CANCEL:
				_view.changePage(LOBBY);
			case _:
		}
	}
}
