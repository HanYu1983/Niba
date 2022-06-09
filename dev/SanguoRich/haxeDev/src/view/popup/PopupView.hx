package view.popup;

import haxe.ui.containers.VBox;

class PopupView extends VBox{
    public function new() {
        super();
    }

    var cb:()->Void;
    public function showPopup(info:Dynamic, cb:()->Void = null) {
        fadeIn();
        this.cb = cb;
    }

    override function fadeIn(onEnd:() -> Void = null, show:Bool = true) {
        super.fadeIn(onEnd, show);
        Main.view.onShowPopup();
    }

    override function fadeOut(onEnd:() -> Void = null, hide:Bool = true) {
        super.fadeOut(onEnd, hide);
        Main.view.onHidePopup();

        if(this.cb != null) cb();
    }
}