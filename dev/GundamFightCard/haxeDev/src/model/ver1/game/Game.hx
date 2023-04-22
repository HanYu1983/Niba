package model.ver1.game;

import haxe.Exception;
import tool.Helper;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.Timing;
import model.ver1.game.entity.Context;

// switch Type.typeof(markEffect) {
// 	case TClass(cls) if (cls == Any):
// 		true;
// 	case _:
// 		false;
// }
class Game {
	public var ctx = new Context();

	public function new() {}

	public function getMemonto():String {
		return tool.Helper.getMemonto(this);
	}

	public static function ofMemonto(memonto:String):Game {
		return tool.Helper.ofMemonto(memonto, Game);
	}
}

function test() {
	final game = new Game();
	final card1 = new Card("0");
	card1.protoId = "179003_01A_U_BK008U_black";
	final card2 = new Card("1");
	card2.protoId = "179003_01A_U_BK008U_black";
	game.ctx.table.cards[card1.id] = card1;
	game.ctx.table.cards[card2.id] = card2;
	game.ctx.timing = TIMINGS[2];
	final loadGame = Game.ofMemonto(game.getMemonto());
	switch game.ctx.timing {
		case Default(Reroll, None, Free2):
		default:
			throw new haxe.Exception("timing not right");
	}
	if (loadGame.ctx.table.cards.get(card1.id).id != card1.id) {
		throw new haxe.Exception("loadGame.ctx.table.cards[card1.id].id != card1.id");
	}
	if (loadGame.ctx.table.cards.get(card2.id).id != card2.id) {
		throw new haxe.Exception("loadGame.ctx.table.cards[card2.id].id != card2.id");
	}
}
