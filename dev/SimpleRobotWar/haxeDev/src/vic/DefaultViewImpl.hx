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

	public function openLobbyPage():Void {
		closeAllPages();
		lobbyPage.fadeIn();
	}

	public function openBattlePage():Void {
		closeAllPages();
		gamePage.fadeIn();
	}
}
