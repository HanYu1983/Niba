package view;

import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build("assets/grid-view.xml"))
class GridView extends Box{

    public var name(default, set):String;
    function set_name(name:String){
        lbl_name.htmlText = name;
        return name;
    }

    public var type(default,set):Int;
    function set_type(type:Int){
        lbl_type.htmlText = switch(type){
            case 0: "低地";
            case 1: "平地";
            case 2: "山丘";
            case 3: "高地";
            case _: "未定義";
        };
        return type;
    }

    public function new() {
        super();
    }

    
}