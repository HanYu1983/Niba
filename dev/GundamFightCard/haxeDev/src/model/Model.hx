package model;

import viewModel.IViewModel;

class Model extends DefaultViewModel {
	public function new() {}

	private function createCard():CardModel {
		return {
			id: 'card_' + Math.floor(Math.random() * 9999),
			protoId: '',
			owner: 'vic',
			faceup: (Math.random() > 0.5),
			watchingByPlayer: []
		};
	}

	private function createPlayer():PlayerModel {
		return {
			id: 'player_' + Math.floor(Math.random() * 9999),
			name: 'dx',
			hand: [createCard(), createCard(), createCard(), createCard()],
			deck: [
				createCard(),
				createCard(),
				createCard(),
				createCard(),
				createCard(),
				createCard(),
				createCard(),
				createCard(),
				createCard()
			],
			url: 'https://particle-979.appspot.com/card/images/cardback.png',
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
