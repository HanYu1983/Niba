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
	public static var view:MainView;

	public static function main() {
		model = new ModelWisp();
		// model = new DebugModel();

		var app = new HaxeUIApp();
		app.ready(function() {
			view = new MainView();
			app.addComponent(view);

			// ThemeManager.instance.applyTheme(Theme.DARK);
		});
	}
}
