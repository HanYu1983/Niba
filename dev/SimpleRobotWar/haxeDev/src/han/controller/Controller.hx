package han.controller;

import haxe.Exception;
import haxe.Constraints;
import haxe.ds.StringMap;
import haxe.ds.EnumValueMap;
import common.IDefine;
import common.WeaponData;
import common.TerrianData;
import han.alg.IDefine;
import han.model.IDefine;
import han.controller.lobby.LobbyController;
import han.controller.battle.BattleController;

private interface _IController extends ILobbyController extends IBattleController extends ILobbyInfo {}

class Controller implements _IController {
	final _view:IView;
	final _lobbyController:LobbyController;
	var _battleController:BattleController;
	var _baseController:IBaseController;

	public function new(view:IView) {
		_view = view;
		_lobbyController = new LobbyController(view);
		_battleController = new BattleController(_lobbyController.getContext(), _view);
		_baseController = _lobbyController;
		initContext(_lobbyController.getContext());
		onEvent(ON_CLICK_GOTO_LOBBY);
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

	public function getUnitMenuItems():Array<UnitMenuItem> {
		return _battleController.getUnitMenuItems();
	}

	public function onEvent(action:ViewEvent):Void {
		switch action {
			case ON_CLICK_GOTO_LOBBY:
				_baseController = _lobbyController;
				_view.startLobby(this);
			case ON_CLICK_GOTO_BATTLE(options):
				_battleController = new BattleController(_lobbyController.getContext(), _view);
				_baseController = _lobbyController;
				_view.startBattle(this);
			case _:
				_baseController.onEvent(action);
		}
	}
}