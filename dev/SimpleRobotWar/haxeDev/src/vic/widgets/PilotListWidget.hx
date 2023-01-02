package vic.widgets;

import common.IViewModel.PilotView;
import common.IViewModel.RobotView;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/PilotListWidget.xml'))
class PilotListWidget extends BasicListWidget {
	public function new() {
		super();
	}

	override function setInfo(info:Dynamic) {
		super.setInfo(info);

		final pilots:Map<String, PilotView> = info;
		final robots = Main.getLobbyController().getRobots();

		dataSource.clear();
		for (key => pilot in pilots) {
			final clone:Dynamic = Reflect.copy(pilot);
			final robot = robots.get(pilot.robotId);
			if (robot != null) {
				clone.robotTitle = robot.title;
			} else {
				clone.robotTitle = '--';
			}
			dataSource.add(clone);
		}
	}
}