package vic.widgets;

import haxe.ui.containers.TableView;

class BasicListWidget extends TableView implements IShowData {
	public function new() {
		super();
	}

	private function setInfo(info:Dynamic):Void {}

	public function showWithData(data:Dynamic) {
		show();
		setInfo(data);
	}

	public function fadeInWithData(data:Dynamic) {
		fadeIn();
		setInfo(data);
	}
}
