package assets;

import model.Model;
import tweenx909.TweenX;
import assets.Card;
import haxe.ui.containers.VBox;

@:build(haxe.ui.ComponentBuilder.build("src/assets/MainView.xml"))
class MainView extends VBox {
	private var game:Model;

	public function new(game:Model) {
		super();

		this.game = game;
		// button1.onClick = function(e) {
		// 	button1.text = "Thanks!";
		// }
	}

	override function onInitialize() {
		super.onInitialize();

		syncGame();
	}

	private function syncGame() {
		var gameModel = game.getGame();

		syncHand(gameModel.players[0].hand);
	}

	private function syncHand(cards:Array<CardModel>) {
		for (i in 0...cards.length) {
			var card = new Card();
			var cardModel = cards[i];
			card.setInfo(cardModel);
			card.left = i * 110;
			card.box_cover.onMouseOver = function(e) {
				trace('over card: ' + cardModel.id);
				TweenX.to(card.box_card, {'top': 30}, .3);

				game.previewPlayCard(cardModel.id);
			};
			card.box_cover.onMouseOut = function(e) {
				trace('out card:' + cardModel.id);
				TweenX.to(card.box_card, {'top': 0}, .3);
			};
			card.box_cover.onClick = function(e){
				trace('play card:' + cardModel.id);
				
			};
			box_table.addComponent(card);
		}
	}

	// @:bind(button2, MouseEvent.CLICK)
	// private function onMyButton(e:MouseEvent) {
	// 	button2.text = "Thanks!";
	// }
}
