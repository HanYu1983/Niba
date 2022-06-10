package vic.pages;

import vic.widgets.RobotPilotListWidget;
import vic.widgets.RobotPilotGridWidget;
import vic.widgets.WeaponListWidget;
import common.Define;
import haxe.ui.events.MouseEvent;
import haxe.ui.containers.Box;
import tool.Debug;

@:build(haxe.ui.ComponentBuilder.build('vic/pages/RobotPage.xml'))
class RobotPage extends Box {
	final weaponList:WeaponListWidget;
	final robotPilotGrid:RobotPilotGridWidget;
	final robotPilotList:RobotPilotListWidget = new RobotPilotListWidget();

	public function new() {
		super();

		weaponList = new WeaponListWidget();
		box_weapons.addComponent(weaponList);

		robotPilotGrid = new RobotPilotGridWidget();
		box_robotPilot.addComponent(robotPilotGrid);

		box_robotPilotList.addComponent(robotPilotList);
		// robotPilotList = new RobotPilotListWidget();
	}

	override function show() {
		super.show();

		final robots = Main.view.getLobbyController().getRobots();
		robotPilotList.setInfo(robots);

		function updateDetail(info:RobotView) {
			robotPilotGrid.setInfo(info);
			weaponList.setInfo(info);
		}

		// tab_robots.dataSource.clear();

		// for (key => value in robots) {
		// 	final info = value;
		// 	tab_robots.dataSource.add(info);
		// }

		robotPilotList.onChange = function(e) {
			if (robotPilotList.selectedItem) {
				final robotInfo = robots.get(robotPilotList.selectedItem.id);
				updateDetail(robotInfo);
			}
		}

		robotPilotList.selectedIndex = 0;

		verbose("RobotPage", 'vic get robots:${robots}');
	}

	@:bind(btn_equipOrMarket, MouseEvent.CLICK)
	function onBtnEquipOrMarketClick(e) {
		if (robotPilotList.selectedItem == null)
			return;
		final send = {
			robotId: robotPilotList.selectedItem.id
		};
		info("RobotPage", 'vic send ON_CLICK_GOTO_ROBOT_BUY,${send}');
		Main.view.getLobbyController().onEvent(ON_CLICK_GOTO_ROBOT_BUY(send));
	}

	@:bind(btn_backToLobby, MouseEvent.CLICK)
	function onBtnBackClick(e) {
		Main.view.getLobbyController().onEvent(ON_CLICK_GOTO_LOBBY);
	}
}
