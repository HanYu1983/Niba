package ;

import model.DebugModel;
import model.IModel;
import view.MainView;
import haxe.ui.HaxeUIApp;

class Main {

    public static var model:IModel;

    public static function main() {
        model = new DebugModel();
        
        var app = new HaxeUIApp();
        app.ready(function() {
            app.addComponent(new MainView());
        });
    }
}
