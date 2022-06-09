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
		Main.mainView.addComponent(lobbyPage);

		gamePage = new GamePage();
		Main.mainView.addComponent(gamePage);
	}

	function closeAllPages(){
		lobbyPage.hide();
		gamePage.hide();
	}

	public function openLobbyPage():Void {
		trace("openLobbyPage");

		// 關閉所有其它頁, 打開大廳頁
		// 假設按了到去戰鬥
		// getLobbyController().onEvent(ON_CLICK_GOTO_BATTLE("參數之後再想"));

		closeAllPages();
		lobbyPage.fadeIn();
	}

	public function openBattlePage():Void {
		trace("openBattlePage");
		// 關閉所有其它頁, 打開戰鬥頁
		trace(getBattleController());

		closeAllPages();
		gamePage.fadeIn();
	}
}
