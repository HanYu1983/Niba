package ;

import model.HanModel;
import haxe.ui.HaxeUIApp;

class Main {
    public static function main() {
        var app = new HaxeUIApp();
        app.ready(function() {
            app.addComponent(new MainView(new HanModel()));

            app.start();
        });
    }
}
