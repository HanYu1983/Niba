package vic.widgets;

import common.IDefine.Position;
import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/Robot.xml'))
class Robot extends Box{

    public var pos:Position;

    public var title(get, set):String;
    function set_title(title:String){
        lbl_title.value = title.substring(0,2);
        return title;
    }

    function get_title():String {
		return lbl_title.value;
	}

    public function new() {
        super();
    }

	
}