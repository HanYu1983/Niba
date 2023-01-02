package han.controller;

import haxe.Exception;
import haxe.Constraints;
import haxe.ds.StringMap;
import haxe.ds.EnumValueMap;
import common.IConfig;
import common.IDefine;
import common.WeaponData;
import common.TerrianData;
import common.IViewModel;
import tool.Debug;
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

	public function new(ctx:Context, view:IView) {
		_view = view;
		_lobbyController = new LobbyController(ctx, view);
		_battleController = new BattleController(_lobbyController.getContext(), _view);
		_baseController = _lobbyController;
		onEvent(ON_CLICK_GOTO_LOBBY);
	}

	public function getLobbyController():ILobbyController {
		// 回傳this, 自身作為所有controller的仲介
		return this;
	}

	public function getBattleController():IBattleController {
		// 回傳this, 自身作為所有controller的仲介
		return this;
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

	public function getAttackRangeView():Null<MoveRangeView> {
		return _battleController.getAttackRangeView();
	}

	public function getAttackHitRangeView():Null<MoveRangeView> {
		return _battleController.getAttackHitRangeView();
	}

	public function getWeaponAttackListView():Null<WeaponAttackListView> {
		return _battleController.getWeaponAttackListView();
	}

	public function getRobotStatusView():Null<RobotStatusView> {
		return _battleController.getRobotStatusView();
	}

	public function getRobotBattlePreviewView():Null<RobotBattlePreviewView> {
		return _battleController.getRobotBattlePreviewView();
	}

	public function onEvent(action:ViewEvent):Void {
		try {
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
		} catch (e:MessageException) {
			err("Controller", e.message);
			_view.animateMessage(e.message);
		} catch (e:Exception) {
			err("Controller", e.message);
			throw e;
		}
	}
}

function test() {
	test1();
}

function test1() {
	final ctx = getDefaultContext();
	ctx.grids = getRandomMap(MAP_W, MAP_H);

	final player0 = createPlayer(0);
	ctx.players.push(player0);

	final player1 = createPlayer(1);
	ctx.players.push(player1);
	ctx.currentPlayerId = player0.id;

	final robot = createRobot('${ctx.idSeq++}');
	ctx.robots.set(robot.id, robot);
	ctx.positionToRobot.set(POS(0, 0), robot.id);
	ctx.robotToPlayer.set(robot.id, player0.id);

	final pilot = createPilot('${ctx.idSeq++}');
	ctx.pilots.set(pilot.id, pilot);
	ctx.pilotToRobot.set(pilot.id, robot.id);

	final weapon = createWeapon('${ctx.idSeq++}');
	ctx.weapons.set(weapon.id, weapon);
	ctx.weaponToRobot.set(weapon.id, robot.id);

	final ctr = new Controller(ctx, new DefaultView());
	ctr.onEvent(ON_CLICK_GOTO_BATTLE(""));
	if(ctr.getBattleController().getRobotMenuState() != NORMAL){
		throw new Exception("must be NORMAL");
	}
	ctr.onEvent(ON_CLICK_BATTLE_POS(POS(0,0)));
	if(ctr.getBattleController().getRobotMenuState() != ROBOT_MENU){
		throw new Exception("must be ROBOT_MENU");
	}
	trace(ctr.getBattleController().getRobotMenuView());
	if(ctr.getBattleController().getRobotMenuView() == null){
		throw new Exception("must has robotMenuView");
	}
	trace(ctx);
}