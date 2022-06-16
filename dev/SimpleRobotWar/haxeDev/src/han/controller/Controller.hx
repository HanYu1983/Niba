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
		_view.startLobby(this);
		_view.startBattle(this);
		initContext(_lobbyController.getContext());
		onEvent(ON_CLICK_GOTO_LOBBY);
	}

	public function getLobbyController():ILobbyController {
		return _lobbyController;
	}

	public function getBattleController():IBattleController {
		return _battleController;
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

	public function getAttacks(robotId:String):Array<WeaponAttackView> {
		return _baseController.getAttacks(robotId);
	}

	public function getGrids():IMap<Position, GridView> {
		return _battleController.getGrids();
	}

	public function getRobotMenuItems(robotId:String):Array<RobotMenuItem> {
		return _battleController.getRobotMenuItems(robotId);
	}

	public function getRobotMoveRange(robotId:String):Array<Position> {
		return _battleController.getRobotMoveRange(robotId);
	}

	public function getRobotMovePath(to:Position):Array<Position>{
		return _battleController.getRobotMovePath(to);
	}

	public function getRobotIdByPosition(pos:Position):Null<String> {
		return _battleController.getRobotIdByPosition(pos);
	}

	public function doRobotMove(robotId:String, from:Position, to:Position):Void {
		return _battleController.doRobotMove(robotId, from, to);
	}

	public function doRobotDone(robotId:String):Void {
		return _battleController.doRobotDone(robotId);
	}

	public function pushState():Void {
		return _battleController.pushState();
	}

	public function popState():Void {
		return _battleController.popState();
	}

	public function applyState():Void {
		return _battleController.applyState();
	}

	public function setOccupyController(ctr:Null<ViewEvent->Void>):Void {
		return _battleController.setOccupyController(ctr);
	}

	public function getOccupyController():Null<ViewEvent->Void> {
		return _battleController.getOccupyController();
	}

	public function getRobotMenuState():RobotMenuState {
		return _battleController.getRobotMenuState();
	}

	public function getRobotMenuView():Null<RobotMenuView> {
		return _battleController.getRobotMenuView();
	}

	public function getSystemMenuView():Null<SystemMenuView> {
		return _battleController.getSystemMenuView();
	}

	public function getMoveRangeView():Null<MoveRangeView> {
		return _battleController.getMoveRangeView();
	}

	public function getWeaponAttackListView():Null<WeaponAttackListView> {
		return _battleController.getWeaponAttackListView();
	}

	public function getRobotStatusView():Null<RobotStatusView> {
		return _battleController.getRobotStatusView();
	}

	public function onEvent(action:ViewEvent):Void {
		switch action {
			case ON_CLICK_GOTO_LOBBY:
				_baseController = _lobbyController;
				_view.changePage(LOBBY);
			case ON_CLICK_GOTO_BATTLE(options):
				_battleController = new BattleController(_lobbyController.getContext(), _view);
				_baseController = _battleController;
				_view.changePage(BATTLE);
			case _:
				_baseController.onEvent(action);
		}
	}
}
