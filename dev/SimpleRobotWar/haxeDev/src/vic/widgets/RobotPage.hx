package vic.widgets;

import common.Define.IRobot;
import haxe.ui.events.MouseEvent;
import haxe.ui.containers.Box;
import tool.Debug;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/RobotPage.xml'))
class RobotPage extends Box {
	public function new() {
		super();
	}

	override function show() {
		super.show();

		function updateDetail(info:IRobot){
			pro_robotTitle.value = info.getTitle();
		}

		final robots = Main.view.getLobbyController().getRobots();
		tab_robots.dataSource.clear();

		for (key => value in robots) {
			final info = Reflect.field(value, '_info');
			tab_robots.dataSource.add(info);
		}

		tab_robots.onClick = function(e){
			if(tab_robots.selectedItem){
				final robotInfo = robots.get(tab_robots.selectedItem.id);
				updateDetail(robotInfo);
			}
		}
		verbose("RobotPage", 'vic get robots:${robots}');
	}

	@:bind(btn_equipOrMarket, MouseEvent.CLICK)
	function onBtnEquipOrMarketClick(e) {
		final send = {
			robotId: tab_robots.selectedItem.id
		};
		info("RobotPage", 'vic send ON_CLICK_GOTO_ROBOT_BUY,${send}');
		Main.view.getLobbyController().onEvent(ON_CLICK_GOTO_ROBOT_BUY(send));
	}
}
