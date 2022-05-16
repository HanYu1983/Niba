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

    public function new() {
        super();
    }

    public function showMessage(title:String, info:String){
        fadeIn();

        this.title = title;
        this.content = info;
    }

}