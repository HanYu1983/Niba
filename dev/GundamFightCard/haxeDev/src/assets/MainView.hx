package assets;

import delay.Delay;
import vdom.JQuery;
import js.html.Document;
import js.Syntax;
import tweenx909.TweenX;
import assets.Card;
import haxe.ui.containers.VBox;
import viewModel.IViewModel;

@:build(haxe.ui.ComponentBuilder.build("src/assets/mainView.xml"))
class MainView extends VBox {
	private var game:IViewModel;

	private var playerTable = new PlayerTable();
	private var enemyTable = new PlayerTable();

	public function new(game:IViewModel) {
		super();

		enemyTable.id = 'abc';

		box_playerTable.addComponent(playerTable);
		box_playerTable.addComponent(enemyTable);

		this.game = game;
	}

	override function onInitialize() {
		super.onInitialize();

		// 這個事件觸發的時候，dom的參數（left和top等）還沒有初始化完成，所以這裏等0.1秒。
		Delay.byTime(.1, () -> {
			syncGame();
		});
	}

	private function syncGame() {
		var gameModel = game.getGame();

		syncHand(playerTable, gameModel.players[0].hand);
		syncHand(enemyTable, gameModel.players[1].hand);
	}

	private var firstClick:CardModel = null;

	private function syncHand(table:PlayerTable, cards:Array<CardModel>) {
		for (i in 0...cards.length) {
			var card = new Card();
			var cardModel = cards[i];
			card.setInfo(cardModel);
			card.left = i * (card.width + 5) + table.box_hand.screenLeft;
			card.top = table.box_hand.screenTop;
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
