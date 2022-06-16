package;

import js.Syntax;
import haxe.ui.themes.Theme;
import haxe.ui.themes.ThemeManager;
import haxe.Exception;
import haxe.ui.core.Component;
import haxe.ui.HaxeUIApp;
import han.controller.Controller;
import vic.DefaultViewImpl;

class Main {
	public static var view:Controller;

	public static function main() {
		if (true) {
			han.ITest.test();
		}
		final app = new HaxeUIApp();
		app.ready(() -> {
			final _view = new DefaultViewImpl();
			app.addComponent(_view.getComponent());
			view = new Controller(_view);

			ThemeManager.instance.applyTheme(Theme.DARK);
		});
	}

	public static function getFixNumber(number:Float, count:Int = 0):Float {
		if (number == null)
			return 0.0;
		var round = Syntax.code('Number.prototype.toFixed');
		return round.call(number, count);
	}

	public static function getRateString(rate:Float, count:Int = 0):String {
		return getFixNumber(rate * 100, count) + '%';
	}
}
