package vic;

import vic.pages.PilotPage;
import vic.pages.RobotPage;
import vic.pages.GamePage;
import vic.pages.LobbyPage;
import haxe.ui.containers.Box;
import common.IDefine;

@:build(haxe.ui.ComponentBuilder.build('vic/HaxeUIView.xml'))
class HaxeUIView extends Box {
	public final lobbyPage:LobbyPage;
	public final gamePage:GamePage;
	public final robotPage:RobotPage;
	public final pilotPage:PilotPage;

	public function new() {
		super();
		
		lobbyPage = new LobbyPage();
		addComponent(lobbyPage);

		gamePage = new GamePage();
		addComponent(gamePage);

		robotPage = new RobotPage();
		addComponent(robotPage);

		pilotPage = new PilotPage();
		addComponent(pilotPage);
	}

	public function closeAllPages() {
		lobbyPage.hide();
		gamePage.hide();
		robotPage.hide();
		pilotPage.hide();
	}

	
}
