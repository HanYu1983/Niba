package vic.widgets;

import haxe.ui.containers.properties.PropertyGrid;

class BasicGridWidget extends PropertyGrid implements IShowData {
	public function new() {
		super();
	}

	function setInfo(info:Dynamic):Void {}

	public function showWithData(data:Dynamic) {
		show();
		setInfo(data);
	}

	public function fadeInWithData(data:Dynamic) {
		fadeIn();
		setInfo(data);
	}
}
