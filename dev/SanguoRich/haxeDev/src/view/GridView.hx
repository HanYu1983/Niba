package view;

import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build("assets/grid-view.xml"))
class GridView extends Box{

    public var name(default, set):String;
    public function set_name(name:String){
        lbl_name.htmlText = name;
        return name;
    }

    public var type(default,set):String;
    public function set_type(type:String){
        lbl_type.htmlText = type;
        return type;
    }

    public function new() {
        super();
    }

    
}