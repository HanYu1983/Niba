package vic.widgets;

import haxe.ui.events.MouseEvent;
import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/LobbyPage.xml'))
class LobbyPage extends Box {
	public function new() {
		super();
	}

	@:bind(btn_game, MouseEvent.CLICK)
	function onBtnGameClick(e) {
		Main.view.getLobbyController().onEvent(ON_CLICK_GOTO_BATTLE("參數之後再想"));
	}
}
