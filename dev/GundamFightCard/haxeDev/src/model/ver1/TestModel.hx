package model.ver1;

import tool.Table;
import viewModel.IViewModel;
import model.ver1.game.define.Define;
import model.ver1.game.define.Player;
import model.ver1.game.define.BaSyou;
import model.ver1.game.gameComponent.Alg;
import model.ver1.game.Game;
import model.ver1.game.entity.Context;

private function toCardModel(ctx:Context, card:Card):CardModel {
	return {
		id: '${card.id}',
		protoId: card.protoId != null ? card.protoId : "",
		watchingByPlayer: [],
		owner: card.owner,
		faceup: card.isFaceUp,
	}
}

private function getPlayerModel(ctx:Context, playerId:PlayerId):PlayerModel {
	final cards = getCardIdsByBaSyou(ctx, Default(playerId, MaintenanceArea)).map(cardId -> ctx.table.cards[cardId]).map(card -> toCardModel(ctx, card));
	return {
		id: playerId,
		name: playerId,
		hand: cards,
		hand2: cards,
		deck: cards,
		deck2: cards,
		standby: cards,
		trash: cards,
		outOfGame: cards,
		battleUniverse: cards,
		battleEarth: cards,
		url: 'https://particle-979.appspot.com/card/images/cardback.png'
	}
}

class TestModel extends DefaultViewModel {
	private var game = new Game();

	public function new() {
		final ctx = game.ctx;
		final player1 = PlayerId.A;
		final player2 = PlayerId.B;
		final player2Hand = new CardStack((Default(player2, MaintenanceArea) : BaSyouId));
		ctx.table.cardStacks[player2Hand.id] = player2Hand;
		
		final card = new Card("1");
		card.owner = player1;
		card.protoId = "179030_11E_U_VT186R_purple";
		card.isFaceUp = true;
		addCard(ctx.table, (Default(player1, MaintenanceArea) : BaSyouId), card);
	}

	public override function getGame():GameModel {
		return {
			players: [getPlayerModel(game.ctx, PlayerId.A), getPlayerModel(game.ctx, PlayerId.B)],
			commands: []
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
