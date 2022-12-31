package model;

import viewModel.IViewModel;

class Model extends DefaultViewModel{
	public function new() {}

	private function createCard():CardModel {
		return {
			id: 'card_' + Math.floor(Math.random() * 9999),
			name: 'dx',
			content: 'content',
			owner: 'vic'
		};
	}

	private function createPlayer():PlayerModel {
		return {
			id: 'player_' + Math.floor(Math.random() * 9999),
			name: 'dx',
			hand: [createCard(), createCard(), createCard(), createCard()],
			deck: [createCard(), createCard(), createCard()]
		}
	}

	public override function getGame():GameModel {
		return {
			players: [createPlayer(), createPlayer()]
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
