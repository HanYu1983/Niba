package;

import haxe.ui.themes.Theme;
import haxe.ui.themes.ThemeManager;
import haxe.Exception;
import haxe.ui.core.Component;
import haxe.ui.HaxeUIApp;
import han.controller.Controller;
import vic.DefaultViewImpl;

class Main {
	public static var view:DefaultViewImpl;

	public static function main() {
		if (true) {
			han.ITest.test();
		}
		final app = new HaxeUIApp();
		app.ready(() -> {
			view = new DefaultViewImpl();
			app.addComponent(view.getComponent());
			final ctr = new Controller(view);

			ThemeManager.instance.applyTheme(Theme.DARK);
		});
	}
}
