package vic.widgets;

import common.IDefine.GridView;
import haxe.ui.containers.VBox;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/GridDetail.xml'))
class GridDetail extends VBox implements IShowData {
	public function new() {
		super();
	}

	private function setInfo(info:GridView) {

        final robots = Main.getBattleController().getRobots();
        final robot = robots.get(info.robotId);
		
		var content = '';
		content += '地形:${info.title}\n';
        content += '防禦:${Main.getRateString(info.defRate)}\n';
        content += '回避:${Main.getRateString(info.evadeRate)}\n';
        content += '機體:${robot == null ? '--' : robot.title}';

        lbl_content.value = content;
	}

	public function showWithData(data:Dynamic) {
		show();
		setInfo(data);
	}

	public function fadeInWithData(data:Dynamic) {
		fadeIn();
		setInfo(data);
	}
}
