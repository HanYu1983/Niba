package model;

typedef CardModel = {
	id:String,
	name:String,
	content:String,
	owner:String,
}

typedef PlayerModel = {
	id:String,
	name:String,
	hand:Array<CardModel>,
	deck:Array<CardModel>
}

typedef GameModel = {
	players:Array<PlayerModel>
}

typedef PreviewPlayCardModel = {
	success:Bool,
	msg:String,
	content:Dynamic
}

class Model {
	public function new() {}

	private function createCard():CardModel {
		return {
			id: 'card_' + Math.floor(Math.random() * 9999),
			name: 'dx',
			content: 'contentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontent',
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

	public function getGame():GameModel {
		return {
			players: [createPlayer(), createPlayer()]
		};
	}

	public function previewPlayCard(id:String):PreviewPlayCardModel {
		return {
			success: false,
			msg: 'should have xxxx',
			content: {}
		}
	}
}
