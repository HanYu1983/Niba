package vic.widgets;

import common.IViewModel.PilotView;
import common.IViewModel.RobotView;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/RobotPilotGridWidget.xml'))
class RobotPilotGridWidget extends BasicGridWidget {
	public function new() {
		super();
	}

	override function setInfo(info:Dynamic) {
		super.setInfo(info);

		pro_robotTitle.value = '--';
		pro_robotHp.value = '--';
		pro_robotEnergy.value = '--';
		pro_robotAction.value = '--';
		pro_pilotName.value = '--';
		pro_pilotMelee.value = '--';
		pro_pilotRange.value = '--';
		pro_pilotAttack.value = '--';
		pro_pilotGuard.value = '--';
		pro_pilotLucky.value = '--';

		final robotAndPilot:{r:RobotView, p:PilotView} = info;
		if (robotAndPilot.r != null) {
			final robot:RobotView = robotAndPilot.r;
			pro_robotTitle.value = robot.title;
			pro_robotHp.value = robot.maxHp;
			pro_robotEnergy.value = robot.maxEnergy;
			pro_robotAction.value = robot.maxAction;
		}

		if (robotAndPilot.p != null) {
			final pilot = robotAndPilot.p;
			pro_pilotName.value = pilot.title;
			pro_pilotMelee.value = pilot.melee;
			pro_pilotRange.value = pilot.range;
			pro_pilotAttack.value = pilot.attack;
			pro_pilotGuard.value = pilot.guard;
			pro_pilotLucky.value = pilot.lucky;
		}
	}
}
