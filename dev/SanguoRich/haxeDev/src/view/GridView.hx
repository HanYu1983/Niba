package view;

import model.GridGenerator.BUILDING;
import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build("assets/grid-view.xml"))
class GridView extends Box{

    public var name(default, set):String;
    function set_name(name:String){
        lbl_name.text = name;
        return name;
    }

    public var type(default,set):Int;
    function set_type(type:Int){
        lbl_type.text = switch(type){
            case 0: "低地";
            case 1: "平地";
            case 2: "山丘";
            case 3: "高地";
            case _: "未定義";
        };
        return type;
    }

    public var building(default, set):BUILDING;
    function set_building(type:BUILDING) {
        lbl_building.text = switch (type){
            case EMPTY: "";
            case MARKET: "市";
            case FARM: "田";
            case VILLAGE: "村";
            case FORGE: "工";
            case CITY: "城";
            case _:"";
        }
        return type;
    }

    public function new() {
        super();
    }

    
}