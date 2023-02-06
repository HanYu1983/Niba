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

	private function createCommand():CommandModel {
		return {
			id: 'test',
			name: 'testname'
		}
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
		final cmds = [createCommand(), createCommand(), createCommand()];
		cmds[0].id = '0';
		cmds[0].name = '打出gundam';
		cmds[1].id = '1';
		cmds[1].name = '使用x gundam的月光炮';
		cmds[2].id = '2';
		cmds[2].name = '打出g';

		return {
			players: [createPlayer(), createPlayer()],
			commands: cmds
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
