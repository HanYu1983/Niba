package;

import model.ver0.NativeModel;
import model.ver1.TestModel;
import model.Model;
import assets.MainView;
import haxe.ui.HaxeUIApp;

class Main {
	public static function main() {
		var app = new HaxeUIApp();
		app.ready(function() {
			// app.addComponent(new MainView(new TestModel()));
			app.addComponent(new MainView(new Model()));

			app.start();
		});
	}

	public static function cumulativeOffset(element:js.html.Element) {
		var top = 0, left = 0;
		do {
			top += element.offsetTop;
			left += element.offsetLeft;
			element = element.offsetParent;
		} while (element != null);

		return {
			top: top,
			left: left
		};
	};
}
