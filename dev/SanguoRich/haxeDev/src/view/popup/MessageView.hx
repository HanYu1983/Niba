package view.popup;

import model.PeopleGenerator.People;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/message-view.xml"))
class MessageView extends PopupView{

    var pList:PeopleListView;

    public function new() {
        super();

        pList = new PeopleListView();
        box_peopleList.addComponent(pList);
    }
    
    var confirmMethod:()->Void = null;

    public function showMessage(info:String, list:Array<People> = null, confirm:()->Void = null){
        fadeIn();

        box_peopleList.hide();

        lbl_content.text = info;
        if(list != null && list.length > 0){
            box_peopleList.show();
            pList.setPeopleList(list);
        }

        confirmMethod = confirm;
    }

    @:bind(btn_cancel, MouseEvent.CLICK)
    function onBtnCancelClick(e:MouseEvent){
        fadeOut();
        if(confirmMethod != null) confirmMethod();
        confirmMethod = null;
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnComfirmClick(e:MouseEvent){
        fadeOut();
        if(confirmMethod != null) confirmMethod();
        confirmMethod = null;
    }
}