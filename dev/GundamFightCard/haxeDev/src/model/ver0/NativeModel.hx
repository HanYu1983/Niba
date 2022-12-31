package model.ver0;

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
	// 沒有使用JSON.parse字串的形式
	// 直接使用json物件
	// 注意：這樣使用的話，不能傳入js object用StringMap, 只能傳入js array用Array的形式
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
class NativeModel extends DefaultViewModel {
	public function new() {}

	public override function getGame():GameModel {
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
}
