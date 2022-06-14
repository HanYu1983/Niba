package vic.pages;

import vic.widgets.BattleWeaponListWidget;
import common.view.ver1.DefaultView.RobotStatusView;
import vic.widgets.RobotListWidget;
import vic.widgets.RobotPilotGridWidget;
import vic.widgets.WeaponListWidget;
import common.IDefine;
import haxe.ui.events.MouseEvent;
import haxe.ui.containers.Box;
import tool.Debug;

@:build(haxe.ui.ComponentBuilder.build('vic/pages/RobotStatePage.xml'))
class RobotStatePage extends Box implements IShowData {
	final weaponList = new WeaponListWidget();
	final battalWeaponList = new BattleWeaponListWidget();
	final robotPilotGrid = new RobotPilotGridWidget();

	public function new() {
		super();

		box_weapons.addComponent(weaponList);
		box_attackWeapons.addComponent(battalWeaponList);
		box_robotPilot.addComponent(robotPilotGrid);
	}

	function setRobot(robotState:RobotStatusView) {
		super.show();

		final robots = Main.view.getLobbyController().getRobots();
		final pilots = Main.view.getLobbyController().getPilots();

		final robot = robots.get(robotState.robotId);
		final pilot = pilots.get(robot.pilotId);
		robotPilotGrid.showWithData({r: robot, p: pilot});
		weaponList.showWithData(robot.weaponIds);
		battalWeaponList.showWithData(robotState.weaponAttacks);

		btn_confirm.onClick = function(e) {
			Main.view.getBattleController().onEvent(ViewEvent.ON_CLICK_CANCEL);
		}
	}

	public function showWithData(data:Dynamic) {
		show();
		setRobot(data);
	}

	public function fadeInWithData(data:Dynamic) {
		fadeIn();
		setRobot(data);
	}
}
