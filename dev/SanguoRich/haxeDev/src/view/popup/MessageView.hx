package view.popup;

import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/message-view.xml"))
class MessageView extends PopupView{
    public function new() {
        super();
    }
    

    public function showMessage(info:Dynamic){
        fadeIn();

        lbl_content.text = '
        ${info.success ? '任務成功' : '任務失敗'}\n
        武將:${info.people.name}\n
        體力:${info.energyBefore}=>${info.energyAfter}\n
        金錢:${info.moneyBefore}=>${info.moneyAfter}\n
        糧草:${info.foodBefore}=>${info.foodAfter}\n
        士兵:${info.armyBefore}=>${info.armyAfter}\n
        ';
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