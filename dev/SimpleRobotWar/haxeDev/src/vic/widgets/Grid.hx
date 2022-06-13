package vic.widgets;

import common.IDefine.Position;
import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/Grid.xml'))
class Grid extends Box {
	public var pos:Position;

	public var title(get, set):String;

	function set_title(title:String) {
		lbl_title.value = title;
		box_border.hide();
		switch title {
			case '平原':
				backgroundColor = 'yellow';
				opacity = 1.0;
			case '海':
				backgroundColor = 'blue';
				opacity = 1.0;
			case '山':
				backgroundColor = 'orange';
				opacity = 1.0;
			case '森林':
				backgroundColor = 'green';
				opacity = 1.0;
			case _:
		}
		return title;
	}

	function get_title():String {
		return lbl_title.value;
	}

	public function new() {
		super();
	}

	public function showMoveRange() {
		box_border.show();
	}
}
