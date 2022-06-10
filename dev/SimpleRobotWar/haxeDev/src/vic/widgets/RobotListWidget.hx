package vic.widgets;

import haxe.ui.data.DataSource;
import common.IDefine.RobotView;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/RobotListWidget.xml'))
class RobotListWidget extends BasicListWidget {
	public function new() {
		super();
	}

	override function setInfo(info:Dynamic) {
		super.setInfo(info);

		final robots:Map<String, RobotView> = info;
		final pilots = Main.view.getLobbyController().getPilots();

		dataSource.clear();
		for (key => robot in robots) {
			final clone:Dynamic = Reflect.copy(robot);
			final pilot = pilots.get(robot.pilotId);
			if (pilot != null) {
				clone.pilotTitle = pilot.title;
			} else {
				clone.pilotTitle = '--';
			}
			dataSource.add(clone);
		}
	}
}
