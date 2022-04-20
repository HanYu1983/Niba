package;

import model.TestNegoModel;
import js.Syntax;
import model.ModelWisp.NativeModule;
import haxe.ui.themes.Theme;
import haxe.ui.themes.ThemeManager;
import model.DebugModel;
import model.IModel;
import view.MainView;
import haxe.ui.HaxeUIApp;
import model.ModelVer1;
import model.ModelWisp;
import model.TestExploreModel;

class Main {
	public static var model:IModel;
	public static var view:MainView;

	public static function main() {
		// model = new ModelWisp();
		model = new TestNegoModel();

		var app = new HaxeUIApp();
		app.ready(function() {
			view = new MainView();
			app.addComponent(view);

			// ThemeManager.instance.applyTheme(Theme.DARK);
		});
	}

	public static function getFixNumber(number:Float, count:Int = 2){
		var round = Syntax.code('Number.prototype.toFixed');
        return round.call(number, count);
	}

	public static function getRateString(rate:Float){
		return getFixNumber(rate * 100, 2) + '%';
	}
}
