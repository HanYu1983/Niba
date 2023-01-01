package model;

import viewModel.IViewModel;

class Model extends DefaultViewModel {
	public function new() {}

	private function createCard():CardModel {
		return {
			id: 'card_' + Math.floor(Math.random() * 9999),
			name: 'dx',
			content: 'content',
			owner: 'vic',
			url: 'https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/179030_11E_U_BL208S_2_blue.jpg',
			faceup: (Math.random() > 0.5),
			watching: (Math.random() > 0.5),
		};
	}

	private function createPlayer():PlayerModel {
		return {
			id: 'player_' + Math.floor(Math.random() * 9999),
			name: 'dx',
			hand: [createCard(), createCard(), createCard(), createCard()],
			deck: [createCard(), createCard(), createCard()],
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
