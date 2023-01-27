package assets;

import delay.Delay;
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

		syncHand(playerTable, gameModel.players[0]);
		syncHand(enemyTable, gameModel.players[1]);
		syncDeck(playerTable, gameModel.players[0]);
		syncDeck(enemyTable, gameModel.players[1]);
	}

	private function syncDeck(table:PlayerTable, player:PlayerModel) {
		final cards = player.deck;
		for (i in 0...cards.length) {
			final card = new Card();
			final cardModel = cards[i];
			card.model = cardModel;
			card.playerModel = player;
			card.left = i * 1 + table.box_deck.screenLeft;
			card.top = i * 1 + table.box_deck.screenTop;
			box_table.addComponent(card);
		}
	}

	private var firstClick:CardModel = null;

	private function syncHand(table:PlayerTable, player:PlayerModel) {
		final cards = player.hand;
		for (i in 0...cards.length) {
			final card = new Card();
			final cardModel = cards[i];
			card.model = cardModel;
			card.playerModel = player;
			card.left = i * (card.width + 5) + table.box_hand.screenLeft;
			card.top = table.box_hand.screenTop;
			table.hand.push(card);
			box_table.addComponent(card);
		}
		selectMyHandMode();
	}

	private function selectMyHandMode() {
		for (i in 0...playerTable.hand.length) {
			var card = playerTable.hand[i];
			card.box_cover.onMouseOver = function(e) {
				if (firstClick != null)
					return;
				trace('over card: ' + card.model.id);
				TweenX.to(card.box_card, {'top': 30}, .3);

				game.previewPlayCard(card.model.id);
			};
			card.box_cover.onMouseOut = function(e) {
				if (firstClick != null)
					return;
				trace('out card:' + card.model.id);
				TweenX.to(card.box_card, {'top': 0}, .3);
			};
			card.box_cover.onClick = function(e) {
				if (firstClick == null) {
					firstClick = card.model;
					trace('first click card:' + card.model.id);
					selectAreaMode();
				}
			};
		}
	}

	private function selectAreaMode() {
		box_table.hide();
		// box_table.depth = -10;
		final areas = [playerTable.box_deck, playerTable.box_deck2, playerTable.box_hand];
		for (area in areas) {
			area.styleNames = 'selectable';
			area.onMouseOver = function(e) {
				trace('over area');
				// trace(area.screenLeft);
			};
			area.onMouseOut = function(e) {
				trace('out area');
			};
			area.onClick = function(e) {};
		}
	}
}
