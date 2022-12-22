package assets;

import haxe.ui.core.Component;
import haxe.ui.dragdrop.DragManager;
import model.Model;
import tweenx909.TweenX;
import assets.Card;
import haxe.ui.containers.VBox;

@:build(haxe.ui.ComponentBuilder.build("src/assets/MainView.xml"))
class MainView extends VBox {
	private var game:Model;

	private var playerTable = new PlayerTable();
	private var enemyTable = new PlayerTable();

	public function new(game:Model) {
		super();

		box_playerTable.addComponent(playerTable);
		box_playerTable.addComponent(enemyTable);

		this.game = game;
		// button1.onClick = function(e) {
		// 	button1.text = "Thanks!";
		// }
	}

	// override function onInitialize() {
	// 	super.onInitialize();
	// 	syncGame();
	// }
	// override function onComponentAdded(child:Component) {
	// 	super.onComponentAdded(child);
	// 	syncGame();
	// }

	override function ready() {
		super.ready();
		syncGame();
	}

	private function syncGame() {
		var gameModel = game.getGame();

		syncHand(playerTable, gameModel.players[0].hand);
	}

	private var firstClick:CardModel = null;

	private function syncHand(table:PlayerTable, cards:Array<CardModel>) {
		trace(table.box_deck);

		for (i in 0...cards.length) {
			var card = new Card();
			var cardModel = cards[i];
			card.setInfo(cardModel);
			card.left = i * 110 + table.box_deck.screenLeft;
			card.top = table.box_deck.screenTop;
			card.box_cover.onMouseOver = function(e) {
				if (firstClick != null)
					return;
				trace('over card: ' + cardModel.id);
				TweenX.to(card.box_card, {'top': 30}, .3);

				game.previewPlayCard(cardModel.id);
			};
			card.box_cover.onMouseOut = function(e) {
				if (firstClick != null)
					return;
				trace('out card:' + cardModel.id);
				TweenX.to(card.box_card, {'top': 0}, .3);
			};
			card.box_cover.onClick = function(e) {
				if (firstClick == null) {
					firstClick = cardModel;
					trace('first click card:' + cardModel.id);
				}
			};
			// card.onDragStart = function(e){

			// };
			// card.onDragEnd = function(e) {
			// 	trace(e);
			// };
			// card.onDrag = function(e) {
			// 	trace(e.left, e.top);
			// };
			// DragManager.instance.registerDraggable(card);
			box_table.addComponent(card);
		}
	}

	// @:bind(button2, MouseEvent.CLICK)
	// private function onMyButton(e:MouseEvent) {
	// 	button2.text = "Thanks!";
	// }
}
