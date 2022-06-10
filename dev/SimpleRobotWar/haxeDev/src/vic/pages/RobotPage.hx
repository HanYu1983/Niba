package vic.pages;

import vic.widgets.RobotListWidget;
import vic.widgets.RobotPilotGridWidget;
import vic.widgets.WeaponListWidget;
import common.Define;
import haxe.ui.events.MouseEvent;
import haxe.ui.containers.Box;
import tool.Debug;

@:build(haxe.ui.ComponentBuilder.build('vic/pages/RobotPage.xml'))
class RobotPage extends Box {
	final weaponList:WeaponListWidget = new WeaponListWidget();
	final robotPilotGrid:RobotPilotGridWidget = new RobotPilotGridWidget();
	final robotPilotList:RobotListWidget = new RobotListWidget();

	public function new() {
		super();

		box_weapons.addComponent(weaponList);
		box_robotPilot.addComponent(robotPilotGrid);
		box_robotPilotList.addComponent(robotPilotList);
	}

	override function show() {
		super.show();

		final robots = Main.view.getLobbyController().getRobots();
		final pilots = Main.view.getLobbyController().getPilots();
		robotPilotList.setInfo(robots);

		function updateDetail(info:RobotView) {
			final pilot = pilots.get(info.pilotId);
			robotPilotGrid.setInfo({r:info, p:pilot});
			weaponList.setInfo(info);
		}

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
