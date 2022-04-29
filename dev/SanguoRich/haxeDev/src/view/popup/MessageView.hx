package view.popup;

import model.PeopleGenerator.People;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/message-view.xml"))
class MessageView extends PopupView{

    public var title(null, set):String;
    function set_title(title:String){
        lbl_title.value = title;
        return title;
    }

    public var content(null, set):String;
    function set_content(content:String){
        lbl_content.value = content;
        return content;
    }

    var pList:PeopleListView;

    public function new() {
        super();

        pList = new PeopleListView();
        box_peopleList.addComponent(pList);
    }
    
    var confirmMethod:()->Void = null;

    public function showMessage(title:String, info:String, list:Array<People> = null, confirm:()->Void = null){
        fadeIn();

        this.title = title;
        this.content = info;

        box_peopleList.hide();
        if(list != null && list.length > 0){
            box_peopleList.show();
            pList.setPeopleList(list);
        }
        
        confirmMethod = confirm;
        confirmMethod == null ? btn_cancel.show() : btn_cancel.hide();
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