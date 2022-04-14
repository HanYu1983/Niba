package view.popup;

import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/message-view.xml"))
class MessageView extends PopupView{
    public function new() {
        super();
    }
    

    public function showMessage(info){
        fadeIn();
    }

    @:bind(btn_cancel, MouseEvent.CLICK)
    function onBtnCancelClick(e:MouseEvent){
        fadeOut();
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnComfirmClick(e:MouseEvent){
        fadeOut();
    }
}