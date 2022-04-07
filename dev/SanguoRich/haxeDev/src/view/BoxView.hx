package view;
import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build("assets/box-view.xml"))
class BoxView extends Box{

    public var name(default, set):String;
    private function set_name(name:String){
        lbl_name.htmlText = name;
        return name;
    }

    public var boxColor(null, set):String;
    private function set_boxColor(color:String){
        backgroundColor = color;
        return color;
    }

    public function new(width:Float = 10, height:Float = 10) {
        super();

        this.width = width;
        this.height = height;
    }

}