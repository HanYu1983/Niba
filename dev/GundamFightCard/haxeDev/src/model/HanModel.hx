package model;

import haxe.Exception;
import viewModel.IViewModel;

@:nullSafety
private typedef Card = {
	id:Int,
	faceUp:Bool,
	tap:Bool,
	protoId:Null<String>,
	owner:Null<String>
}

@:nullSafety
private typedef CardStack = Array<Int>;

@:nullSafety
private typedef Table = {
	cards:Array<Card>,
	cardStacks:Array<CardStack>
}

@:nullSafety
private typedef Player = {
	id:Int,
	handId:Int,
}

@:nullSafety
private typedef App = {
	table:Table,
	players:Array<Player>
}

@:native("Native")
private extern class Native {
	public static function getApp():App;
}

private function toCardModel(app:App, card:Card):CardModel {
	return {
		id: '${card.id}',
		name: '${card.id}',
		content: 'card ${card.id}',
		owner: card.owner,
	}
}

@:nullSafety
class HanModel implements IViewModel {
	public function new() {}

	public function getGame():GameModel {
		final app = Native.getApp();
		return {
			players: app.players.map(player -> {
				final handCards = app.table.cardStacks[player.handId];
				if (handCards == null) {
					throw new Exception('${player.handId} not found');
				}
				return {
					id: '${player.id}',
					name: '${player.id}',
					hand: handCards.map(c -> {
						return toCardModel(app, app.table.cards[c]);
					}),
					deck: handCards.map(c -> {
						return toCardModel(app, app.table.cards[c]);
					}),
				}
			})
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
