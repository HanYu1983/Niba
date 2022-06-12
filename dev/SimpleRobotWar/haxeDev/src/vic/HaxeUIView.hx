package vic;

import js.Syntax;
import vic.pages.PilotPage;
import vic.pages.RobotPage;
import vic.pages.GamePage;
import vic.pages.LobbyPage;
import haxe.ui.containers.Box;
import common.IDefine;

@:build(haxe.ui.ComponentBuilder.build('vic/HaxeUIView.xml'))
class HaxeUIView extends Box implements IView {
	final _impl:DefaultViewImpl;

	public final lobbyPage:LobbyPage;
	public final gamePage:GamePage;
	public final robotPage:RobotPage;
	public final pilotPage:PilotPage;

	public function new() {
		super();
		_impl = new DefaultViewImpl();

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

	public function getFixNumber(number:Float, count:Int = 0):Float {
		if (number == null)
			return 0.0;
		var round = Syntax.code('Number.prototype.toFixed');
		return round.call(number, count);
	}

	public function getRateString(rate:Float, count:Int = 0):String {
		return getFixNumber(rate * 100, count) + '%';
	}

	public function getLobbyController():ILobbyController {
		return _impl.getLobbyController();
	}

	public function getBattleController():IBattleController {
		return _impl.getBattleController();
	}

	public function startLobby(ctr:ILobbyController):Void {
		_impl.startLobby(ctr);
	}

	public function startBattle(ctr:IBattleController):Void {
		_impl.startBattle(ctr);
	}

	public function onEvent(action:ViewEvent):Void {
		_impl.onEvent(action);
	}
}
