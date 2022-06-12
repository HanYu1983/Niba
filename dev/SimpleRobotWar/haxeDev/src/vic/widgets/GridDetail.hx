package vic.widgets;

import common.IDefine.GridView;
import haxe.ui.containers.VBox;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/GridDetail.xml'))
class GridDetail extends VBox {
	public function new() {
		super();
	}

	public function setInfo(info:GridView) {

        final robots = Main.view.getBattleController().getRobots();
        final robot = robots.get(info.robotId);
		
		var content = '';
		content += '地形:${info.title}\n';
        content += '防禦:${info.defRate}\n';
        content += '回避:${info.evadeRate}\n';
        content += '機體:${robot == null ? '--' : robot.title}';

        lbl_content.value = content;
	}
}
