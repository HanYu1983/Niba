package;

import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.Game;

class Test {
	public static function main() {
		test1();
		model.ver1.data.CardProto_179003_01A_U_BK008U_black.test();
	}

	static function test1() {
		var game = new Game();

		final card1 = new Card("0");
		card1.protoId = "179003_01A_U_BK008U_black";

		final card2 = new Card("1");
		card2.protoId = "179003_01A_U_BK008U_black";
		game.ctx.table.cards[card1.id] = card1;
		game.ctx.table.cards[card2.id] = card2;
		trace("============ getGame ============");
		// game.test();
		trace(game.ctx);

		trace("============ testMemonto ============");
		final loadGame = Game.ofMemonto(game.getMemonto());
		// loadGame.test();
		trace(loadGame.ctx);
		trace("=================================");
		for (key => value in loadGame.ctx.marks) {
			trace(key);
			trace(value);
		}
		trace("=================================");
		game = loadGame;
	}
}
