package;

import vic.widgets.MainView;
import haxe.ui.core.Component;
import haxe.ui.HaxeUIApp;
import common.Data;
import common.Define;
import han.Controller;
import vic.DefaultViewImpl;

class Main {

	public static var mainView:Null<Component>;
	public static function main() {
		
		final app = new HaxeUIApp();
		app.ready(()->{
			mainView = new MainView();
			app.addComponent(mainView);

			final ctr = new Controller(new DefaultViewImpl());
		});
	}
}
