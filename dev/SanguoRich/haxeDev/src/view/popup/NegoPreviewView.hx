package view.popup;

import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/negoPreview-view.xml"))
class NegoPreviewView extends PopupView{
    public function new() {
        super();
    }

    public function showNegoPreview() {
        fadeIn();
    }

    @:bind(btn_cancelNego, MouseEvent.CLICK)
    function onBtnCancelNego(e:MouseEvent) {
        fadeOut();
    }

    @:bind(btn_confirmNego, MouseEvent.CLICK)
    function onBtnConfirmNego(e:MouseEvent) {
        fadeOut();
        Main.view.onNegoPreviewConfirmNegoClick();
    }
}