package model;

typedef CardModel = {
	id:String,
	name:String,
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

class Model {
    public function new(){

    }

	private function createCard():CardModel {
		return {
			id: 'card_' + Math.floor(Math.random() * 9999),
			name: 'dx',
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
			players: [
				createPlayer(),
                createPlayer()
			]
		};
	}
}
