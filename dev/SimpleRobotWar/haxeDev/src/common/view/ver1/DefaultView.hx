package common.view.ver1;

import haxe.Timer;
import haxe.Exception;
import common.IDefine;
import tool.Debug;
import tool.Helper;

using Lambda;

private interface _IDefaultView extends IView {}

@:nullSafety
abstract class DefaultView implements _IDefaultView {
	public function new() {}

	var _lobbyCtr:Null<ILobbyController>;
	var _battleCtr:Null<IBattleController>;

	public function startLobby(ctr:ILobbyController):Void {
		_lobbyCtr = ctr;
	}

	public function startBattle(ctr:IBattleController):Void {
		_battleCtr = ctr;
	}

	public function getLobbyController():ILobbyController {
		if (_lobbyCtr == null) {
			throw new Exception("your must call startLobby first");
		}
		return _lobbyCtr;
	}

	public function getBattleController():IBattleController {
		if (_battleCtr == null) {
			throw new Exception("your must call startBattle first");
		}
		return _battleCtr;
	}

	public function getRobotMenuState():RobotMenuState {
		return getBattleController().getRobotMenuState();
	}

	public function getRobotMenuView():Null<RobotMenuView> {
		return getBattleController().getRobotMenuView();
	}

	public function getSystemMenuView():Null<SystemMenuView> {
		return getBattleController().getSystemMenuView();
	}

	public function getMoveRangeView():Null<MoveRangeView> {
		return getBattleController().getMoveRangeView();
	}

	public function getWeaponAttackListView():Null<WeaponAttackListView> {
		return getBattleController().getWeaponAttackListView();
	}

	public function getRobotStatusView():Null<RobotStatusView> {
		return getBattleController().getRobotStatusView();
	}

	public function onEvent(action:ViewEvent):Void {}	
}
