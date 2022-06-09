package vic.widgets;

import haxe.ui.events.MouseEvent;
import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/RobotPage.xml'))
class RobotPage extends Box {
	public function new() {
		super();
	}

	override function show() {
		super.show();

		final robots = HaxeUIView.getInst().getImpl().getLobbyController().getRobots();
		trace('vic get robots:${robots}');
	}

	@:bind(btn_equipOrMarket, MouseEvent.CLICK)
	function onBtnEquipOrMarketClick(e){
		final send = {robotId:'0'};
		trace('vic send ON_CLICK_GOTO_ROBOT_BUY,${send}');
		HaxeUIView.getInst().getImpl().getLobbyController().onEvent(ON_CLICK_GOTO_ROBOT_BUY(send));
	}
}
