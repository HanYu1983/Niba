package vic;

import vic.widgets.PilotPage;
import vic.widgets.RobotPage;
import common.Define;
import han.view.ver1.DefaultView;
import vic.widgets.GamePage;
import vic.widgets.LobbyPage;
import vic.widgets.HaxeUIView;

class DefaultViewImpl extends DefaultView {
	var lobbyPage:LobbyPage;
	var gamePage:GamePage;
	var robotPage:RobotPage;
	var pilotPage:PilotPage;

	public function new(haxeUIView:HaxeUIView) {
		super();

		lobbyPage = new LobbyPage();
		haxeUIView.addComponent(lobbyPage);

		gamePage = new GamePage();
		haxeUIView.addComponent(gamePage);

		robotPage = new RobotPage();
		haxeUIView.addComponent(robotPage);

		pilotPage = new PilotPage();
		haxeUIView.addComponent(pilotPage);
	}

	public override function getLobbyController():ILobbyController {
		return super.getLobbyController();
	}

	public override function getBattleController():IBattleController {
		return super.getBattleController();
	}

	function closeAllPages() {
		lobbyPage.hide();
		gamePage.hide();
		robotPage.hide();
		pilotPage.hide();
	}

	// 關閉所有其它頁, 打開大廳頁
	// 左側顯示按鈕列表
	//  機體檢視 ON_CLICK_GOTO_ROBOT_VIEW
	//  駕駛員檢視 ON_CLICK_GOTO_PILOT_VIEW
	//
	// 假設按了到去戰鬥
	// getLobbyController().onEvent(ON_CLICK_GOTO_BATTLE("參數之後再想"));
	public function openLobbyPage():Void {
		closeAllPages();
		lobbyPage.fadeIn();
		// 機體列表假資料, robot的getter方法只開了id, title
		trace("機體列表:", getLobbyController().getRobots());
	}

	public function openBattlePage():Void {
		closeAllPages();
		gamePage.fadeIn();
	}

	// 打開機體檢視頁
	// 左邊顯示機體列表 getLobbyController().getRobots() 暫無資料
	// 右邊顯示選到的機體詳細資料
	// 詳細資料有
	//   機體基本資料
	//   駕駛
	//   武器列表
	// 右邊資料下方有動作按鈕
	// 動作按鈕為
	//   裝備與買賣 ON_CLICK_GOTO_ROBOT_BUY
	//   設定駕駛
	public function openRobotViewPage():Void {
		trace("openRobotViewPage");

		closeAllPages();
		robotPage.fadeIn();
	}

	// 打開機體檢視頁
	// 左邊顯示駕駛列表 getLobbyController().getPilots() 暫無資料
	// 右邊顯示選到的駕駛詳細資料
	// 詳細資料有
	//   駕駛基本資料
	//   還不知
	// 右邊資料下方有動作按鈕
	// 動作按鈕為
	//   設定機體
	public function openPilotViewPage():Void {
		trace("openPilotViewPage");

		closeAllPages();
		pilotPage.fadeIn();
	}
}
