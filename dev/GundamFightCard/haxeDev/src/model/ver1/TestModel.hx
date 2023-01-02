package model.ver1;

import tool.Table;
import viewModel.IViewModel;
import model.ver1.game.define.Define;
import model.ver1.game.Game;

private function toCardModel(ctx:Context, card:Card):CardModel {
	return {
		id: '${card.id}',
		name: '${card.id}',
		content: 'card ${card.id}',
		owner: card.owner,
		url:'',
		faceup: false,
		watching: true,
	}
}

@:nullSafety
class TestModel extends DefaultViewModel {
	private var game = new Game();

	public function new() {}

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
					url:''
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