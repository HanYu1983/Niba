package;

import haxe.ui.themes.Theme;
import haxe.ui.themes.ThemeManager;
import haxe.Exception;
import haxe.ui.core.Component;
import haxe.ui.HaxeUIApp;
import han.Controller;
import vic.HaxeUIView;

class Main {
	public static var view:HaxeUIView;

	public static function main() {
		if (true) {
			han.ITest.test();
		}
		final app = new HaxeUIApp();
		app.ready(() -> {
			view = new HaxeUIView();
			app.addComponent(view);
			final ctr = new Controller(view);

			ThemeManager.instance.applyTheme(Theme.DARK);
		});
	}
}
