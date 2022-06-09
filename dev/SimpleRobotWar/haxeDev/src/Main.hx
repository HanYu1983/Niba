package;

import vic.widgets.HaxeUIView;
import common.DefaultView;
import haxe.ui.core.Component;
import haxe.ui.HaxeUIApp;
import han.Controller;
import vic.DefaultViewImpl;

class Main {

	public static var haxeUIView:Null<Component>;
	public static var defaultView:Null<DefaultView>;
	public static function main() {
		
		final app = new HaxeUIApp();
		app.ready(()->{
			haxeUIView = new HaxeUIView();
			app.addComponent(haxeUIView);

			defaultView = new DefaultViewImpl();
			final ctr = new Controller(defaultView);
		});
	}
}
