package model;

import tool.Table;
import viewModel.IViewModel;
import model.ver1.game.define.Define;

import model.ver1.data.DataPool;
import model.ver1.game.Game;

private function toCardModel(ctx:Context, card:Card):CardModel {
	return {
		id: '${card.id}',
		name: '${card.id}',
		content: 'card ${card.id}',
		owner: card.owner,
	}
}

@:nullSafety
class TestModel extends DefaultViewModel {
	private var game = new Game();

	public function new() {
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

	public override function getGame():GameModel {
		final cards = [
			for (card in game.ctx.table.cards)
				toCardModel(game.ctx, card)
		];
		return {
			players: [
				{
					id: 'test',
					name: 'test',
					hand: cards,
					deck: cards,
				}
			]
		};
	}

	public override function previewPlayCard(id:String):PreviewPlayCardModel {
		return {
			success: false,
			msg: 'should have xxxx',
			content: {}
		}
	}
}
