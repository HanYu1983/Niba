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

	public function test() {
		// model.ver1.CardProto_179001_01A_CH_WT007R_white.test();
		model.ver1.data.CardProto_179003_01A_U_BK008U_black.test();
	}

	public function getMemonto():String {
		return tool.Helper.getMemonto(this);
	}

	public static function ofMemonto(memonto:String):Game {
		return tool.Helper.ofMemonto(memonto, Game);
	}
}
