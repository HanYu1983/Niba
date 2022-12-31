package model.ver1.game;

import tool.Helper;
import model.ver1.game.define.Define;

// switch Type.typeof(markEffect) {
// 	case TClass(cls) if (cls == Any):
// 		true;
// 	case _:
// 		false;
// }
class Game implements hxbit.Serializable {
	@:s public var ctx = new Context();

	public function new() {}

	public function getMemonto():String {
		return tool.Helper.getMemonto(this);
	}

	public static function ofMemonto(memonto:String):Game {
		return tool.Helper.ofMemonto(memonto, Game);
	}
}
