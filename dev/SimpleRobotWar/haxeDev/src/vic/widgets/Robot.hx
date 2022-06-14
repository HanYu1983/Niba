package vic.widgets;

import common.IDefine.Position;
import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/Robot.xml'))
class Robot extends Box {
	public var pos:Position;

	public var title(get, set):String;

	function set_title(title:String) {
		lbl_title.value = title.substring(0, 2);
		return title;
	}

	function get_title():String {
		return lbl_title.value;
	}

	@:isVar
	public var isDone(null, set):Bool;

	function set_isDone(done:Bool) {
		isDone = done;
		isDone ? box_doneCover.show() : box_doneCover.hide();
		return done;
	}

	public function new() {
		super();
	}
}
