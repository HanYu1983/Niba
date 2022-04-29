package view.popup;

import haxe.ui.containers.VBox;

class PopupView extends VBox{
    public function new() {
        super();
    }

    public function showPopup(info:Dynamic) {
        fadeIn();
    }

    override function fadeIn(onEnd:() -> Void = null, show:Bool = true) {
        super.fadeIn(onEnd, show);
        Main.view.onShowPopup();
    }

    override function fadeOut(onEnd:() -> Void = null, hide:Bool = true) {
        super.fadeOut(onEnd, hide);
        Main.view.onHidePopup();
    }
}