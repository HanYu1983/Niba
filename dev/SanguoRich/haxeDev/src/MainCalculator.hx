package;

import view.MainCalculatorView;
import haxe.ui.HaxeUIApp;
import model.IModel;


class MainCalculator {
	public static var model:IModel;
	public static var view:MainCalculatorView;

	public static function main() {

		// model = new DebugModel();

		var app = new HaxeUIApp();
		app.ready(function() {
			view = new MainCalculatorView();
			app.addComponent(view);

			// ThemeManager.instance.applyTheme(Theme.DARK);
		});
	}

	
}
