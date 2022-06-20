package;

import js.Syntax;
import haxe.ui.themes.Theme;
import haxe.ui.themes.ThemeManager;
import haxe.Exception;
import haxe.ui.core.Component;
import haxe.ui.HaxeUIApp;
import common.IDefine;
import common.IViewModel;
import han.controller.Controller;
import vic.DefaultViewImpl;

class Main {
	private static var ctr:Controller;

	public static function main() {
		if (true) {
			han.ITest.test();
		}
		final app = new HaxeUIApp();
		app.ready(() -> {
			final view = new DefaultViewImpl();
			app.addComponent(view.getComponent());
			ctr = new Controller(view);

			ThemeManager.instance.applyTheme(Theme.DARK);
		});
	}

	public static function getLobbyController():ILobbyController{
		return ctr.getLobbyController();
	}

	public static function getBattleController():IBattleController{
		return ctr.getBattleController();
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
