package vic;

import js.Syntax;
import haxe.Timer;
import haxe.ui.core.Component;
import vic.pages.PilotPage;
import vic.pages.RobotPage;
import common.IDefine;
import common.IViewModel;
import common.view.ver1.DefaultView;
import vic.pages.GamePage;
import vic.pages.LobbyPage;
import tool.Debug;

// 所有頁面都可以綁定esc到ON_CLICK_CANCEL
class DefaultViewImpl extends DefaultView {
	final _view:HaxeUIView;

	public function new() {
		super();
		_view = new HaxeUIView();
	}

	public function getComponent():Component {
		return _view;
	}
	
	public function changePage(page:Page):Void{
		switch page {
			case LOBBY:
				openLobbyPage();
			case BATTLE:
				openBattlePage();
			case ROBOT_VIEW:
				openRobotViewPage();
			case PILOT_VIEW:
				openPilotViewPage();
		}
	}

	// 機體移動動畫
	public function animateRobotMove(robotId:String, path:Array<Position>, cb:()->Void):Void{
		_view.gamePage.animateRobotMove(robotId, path, cb);
	}
	// 顯示系統訊息
	// 不佔用任何操作，3秒後消失
	public function animateMessage(msg:String):Void{
		trace("顯示訊息", msg);
	}

	public function renderBattlePage():Void {
		_view.gamePage.updateGamePage();
	}

	function openLobbyPage():Void {
		_view.closeAllPages();
		_view.lobbyPage.fadeIn();
	}

	function openBattlePage():Void {
		_view.closeAllPages();
		_view.gamePage.fadeIn();
	}

	function openRobotViewPage():Void {
		_view.closeAllPages();
		_view.robotPage.fadeIn();
	}

	function openPilotViewPage():Void {
		_view.closeAllPages();
		_view.pilotPage.fadeIn();
	}
}
