package vic.pages;

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

	public function new() {
		super();

		weaponList = new WeaponListWidget();
		box_weapons.addComponent(weaponList);

		robotPilotGrid = new RobotPilotGridWidget();
		box_robotPilot.addComponent(robotPilotGrid);
	}

	override function show() {
		super.show();

		final robots = Main.view.getLobbyController().getRobots();

		function updateDetail(info:RobotView) {
			robotPilotGrid.setInfo(info);
			weaponList.setInfo(info);
		}

		tab_robots.dataSource.clear();

		for (key => value in robots) {
			final info = value;
			tab_robots.dataSource.add(info);
		}

		tab_robots.onChange = function(e) {
			if (tab_robots.selectedItem) {
				final robotInfo = robots.get(tab_robots.selectedItem.id);
				updateDetail(robotInfo);
			}
		}

		tab_robots.selectedIndex = 0;

		verbose("RobotPage", 'vic get robots:${robots}');
	}

	@:bind(btn_equipOrMarket, MouseEvent.CLICK)
	function onBtnEquipOrMarketClick(e) {
		if (tab_robots.selectedItem == null)
			return;
		final send = {
			robotId: tab_robots.selectedItem.id
		};
		info("RobotPage", 'vic send ON_CLICK_GOTO_ROBOT_BUY,${send}');
		Main.view.getLobbyController().onEvent(ON_CLICK_GOTO_ROBOT_BUY(send));
	}

	@:bind(btn_backToLobby, MouseEvent.CLICK)
	function onBtnBackClick(e) {
		Main.view.getLobbyController().onEvent(ON_CLICK_GOTO_LOBBY);
	}
}
