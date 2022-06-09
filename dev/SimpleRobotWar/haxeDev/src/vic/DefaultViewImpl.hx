package vic;

import vic.widgets.GamePage;
import vic.widgets.LobbyPage;
import common.DefaultView;

class DefaultViewImpl extends DefaultView {
	var lobbyPage:LobbyPage;
	var gamePage:GamePage;

	public function new() {
		super();

		lobbyPage = new LobbyPage();
		Main.haxeUIView.addComponent(lobbyPage);

		gamePage = new GamePage();
		Main.haxeUIView.addComponent(gamePage);
	}

	function closeAllPages() {
		lobbyPage.hide();
		gamePage.hide();
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
	}
}
