package;

import model.ModelWisp.NativeModule;
import haxe.ui.themes.Theme;
import haxe.ui.themes.ThemeManager;
import model.DebugModel;
import model.IModel;
import view.MainView;
import haxe.ui.HaxeUIApp;
import model.ModelVer1;
import model.ModelWisp;

class Main {
	public static var model:IModel;

	public static function main() {
		model = new ModelWisp();

		var app = new HaxeUIApp();
		app.ready(function() {
			app.addComponent(new MainView());

			// ThemeManager.instance.applyTheme(Theme.DARK);
		});
	}
}
