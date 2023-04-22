package model.ver1.game.define;

import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Require;
import model.ver1.game.define.Define;

class CardText {
	public function new(id:String, description:String) {
		this.id = id;
		this.description = description;
	}

	public var id:String;
	public var description:String;
	public var type = Use;
	// << >>內文
	public var isSurroundedByArrows = false;

	private function getSubKey(v:Int) {
		return '${id}_${v}';
	}

	public function getEffect(_ctx:Any, runtime:Runtime):Array<Any> {
		return [];
	}

	public function getRequires(_ctx:Any, runtime:Runtime):Array<Require> {
		return [];
	}

	public function getRequires2(_ctx:Any, runtime:Runtime):Array<Require2> {
		return [];
	}

	public function action(_ctx:Any, runtime:Runtime):Void {}

	public function onEvent(_ctx:Any, event:Any, runtime:Runtime):Void {}
}
