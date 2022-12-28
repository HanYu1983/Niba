package ;

import model.TestModel;
import model.Model;
import assets.MainView;
import haxe.ui.HaxeUIApp;

class Main {
    public static function main() {
        var app = new HaxeUIApp();
        app.ready(function() {
            app.addComponent(new MainView(new TestModel()));
            // app.addComponent(new MainView(new Model()));

            app.start();

            trace('test');
        });
    }
}
