package vic.pages;

import tool.Debug.info;
import common.IViewModel.PilotView;
import vic.widgets.PilotListWidget;
import vic.widgets.RobotListWidget;
import vic.widgets.RobotPilotGridWidget;
import vic.widgets.WeaponListWidget;
import haxe.ui.events.MouseEvent;
import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build('vic/pages/PilotPage.xml'))
class PilotPage extends Box {
	final weaponList:WeaponListWidget = new WeaponListWidget();
	final robotPilotGrid:RobotPilotGridWidget = new RobotPilotGridWidget();
	final robotPilotList:PilotListWidget = new PilotListWidget();

	public function new() {
		super();

		box_weapons.addComponent(weaponList);
		box_robotPilot.addComponent(robotPilotGrid);
		box_robotPilotList.addComponent(robotPilotList);
	}

	override function show() {
		super.show();

		final pilots = Main.getLobbyController().getPilots();
		final robots = Main.getLobbyController().getRobots();
		robotPilotList.showWithData(pilots);

		function updateDetail(info:PilotView) {
			final robot = robots.get(info.robotId);
			robotPilotGrid.showWithData({r: robot, p: info});

			final robot = robots.get(info.robotId);
			if (robot != null) {
				weaponList.setInfo(robot.weaponIds);
			} else {
				weaponList.dataSource.clear();
			}
		}

		robotPilotList.onChange = function(e) {
			if (robotPilotList.selectedItem) {
				final pilot = pilots.get(robotPilotList.selectedItem.id);
				updateDetail(pilot);
			}
		}

		robotPilotList.selectedIndex = 0;
	}

	@:bind(btn_robotSetting, MouseEvent.CLICK)
	function onBtnRobotSettingClick(e) {
		if (robotPilotList.selectedItem == null)
			return;
		final send = {
			robotId: robotPilotList.selectedItem.id
		};
		info("PilotPage", 'vic send ON_CLICK_GOTO_ROBOT_BUY,${send}');
		// Main.getLobbyController().onEvent(ON_CLICK_GOTO_ROBOT_BUY(send));
	}

	@:bind(btn_backToLobby, MouseEvent.CLICK)
	function onBtnBackClick(e) {
		Main.getLobbyController().onEvent(ON_CLICK_GOTO_LOBBY);
	}
}
