package vic.widgets;

import common.Define.RobotView;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/RobotPilotGridWidget.xml'))
class RobotPilotGridWidget extends BasicGridWidget {
	public function new() {
		super();
	}

	override function setInfo(info:Dynamic) {
		super.setInfo(info);

		final robot:RobotView = info;
		pro_robotTitle.value = robot.title;
		pro_robotHp.value = robot.maxHp;
		pro_robotEnergy.value = robot.maxEnergy;

		final pilots = Main.view.getLobbyController().getPilots();
		final pilot = pilots.get(robot.pilotId);
		if (pilot != null) {
			pro_pilotName.value = pilot.title;
			pro_pilotMelee.value = pilot.melee;
			pro_pilotRange.value = pilot.range;
			pro_pilotGuard.value = pilot.guard;
			pro_pilotLucky.value = pilot.lucky;
		} else {
			pro_pilotName.value = '--';
			pro_pilotMelee.value = '--';
			pro_pilotRange.value = '--';
			pro_pilotGuard.value = '--';
			pro_pilotLucky.value = '--';
		}
	}
}
