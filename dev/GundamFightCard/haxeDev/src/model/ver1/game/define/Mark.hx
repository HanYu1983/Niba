package model.ver1.game.define;

import model.ver1.game.define.Define;
import model.ver1.game.define.Timing;

class Mark {
	public function new(id:String) {
		this.id = id;
	}

	public var id:String;

	public function getEffect(_ctx:Any):Array<Any> {
		return [];
	}

	public function onEvent(_ctx:Any, event:Any):Void {}
}
