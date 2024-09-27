package assets;

import haxe.ui.core.Component;
import delay.Delay;
import tweenx909.TweenX;
import assets.Card;
import haxe.ui.containers.VBox;
import viewModel.IViewModel;

@:build(haxe.ui.ComponentBuilder.build("src/assets/mainView.xml"))
class MainView extends VBox {
	private final playerTable = new PlayerTable();
	private final enemyTable = new PlayerTable();

	private final commandViews:Array<Command> = [];
	private final cardViews:Array<Card> = [];

	public function new() {
		super();

		box_playerTable.addComponent(playerTable);
		box_playerTable.addComponent(enemyTable);
	}

	override function onInitialize() {
		super.onInitialize();

		// 這個事件觸發的時候，dom的參數（left和top等）還沒有初始化完成，所以這裏等0.1秒。
		Delay.byTime(.1, () -> {
			syncGame();
		});
	}

	private function syncGame() {
		final gameModel = Main.model.getGame();

		clearTable();

		final p1 = gameModel.players[0];
		final p2 = gameModel.players[1];

		syncHand(playerTable.box_hand, p1.hand, p1);
		syncHand(enemyTable.box_hand, p2.hand, p2);

		syncHand(playerTable.box_hand2, p1.hand2, p1);
		syncHand(enemyTable.box_hand2, p2.hand2, p2);

		syncHand(playerTable.box_standby, p1.standby, p1);
		syncHand(enemyTable.box_standby, p2.standby, p2);

		syncHand(playerTable.box_earth, p1.battleEarth, p1);
		syncHand(enemyTable.box_earth, p2.battleEarth, p2);

		syncHand(playerTable.box_universe, p1.battleUniverse, p1);
		syncHand(enemyTable.box_universe, p2.battleUniverse, p2);

		syncDeck(playerTable.box_deck, p1.deck, p1);
		syncDeck(enemyTable.box_deck, p2.deck, p2);

		syncDeck(playerTable.box_deck2, p1.deck2, p1);
		syncDeck(enemyTable.box_deck2, p2.deck2, p2);

		syncDeck(playerTable.box_trash, p1.trash, p1);
		syncDeck(enemyTable.box_trash, p2.trash, p2);

		syncDeck(playerTable.box_out, p1.outOfGame, p1);
		syncDeck(enemyTable.box_out, p2.outOfGame, p2);

		syncCommands();
		selectCommandMode();
	}

	private function clearTable() {
		while (cardViews.length > 0)
			cardViews.pop();
		box_table.removeAllComponents();
	}

	private function syncCommands() {
		while (commandViews.length > 0)
			commandViews.pop();

		box_commandList.removeAllComponents();
		final gameModel = Main.model.getGame();
		final commands = gameModel.commands;
		for (i in 0...commands.length) {
			final model = commands[i];
			final commandView = new Command();
			commandView.model = model;
			box_commandList.addComponent(commandView);

			commandViews.push(commandView);
		}
	}

	private function selectCommandMode() {
		for (cmd in commandViews) {
			final model = cmd.model;
			cmd.selectable = true;
			cmd.focus = false;
			cmd.onMouseOver = function(e) {
				trace('in');
				cmd.focus = true;
			}

			cmd.onMouseOut = function(e) {
				trace('out');
				cmd.focus = false;
			}

			cmd.onClick = function(e) {
				Main.model.play(cmd.id, syncGame);
			}
		}
	}

	private function syncDeck(box:Component, cards:Array<CardModel>, player:PlayerModel) {
		for (i in 0...cards.length) {
			final card = new Card();
			final cardModel = cards[i];
			card.model = cardModel;
			card.playerModel = player;
			card.left = i * 1 + box.screenLeft;
			card.top = i * 1 + box.screenTop;
			box_table.addComponent(card);
		}
	}

	private var firstClick:CardModel = null;

	private function syncHand(box:Component, cards:Array<CardModel>, player:PlayerModel) {
		for (i in 0...cards.length) {
			final card = new Card();
			final cardModel = cards[i];
			card.model = cardModel;
			card.playerModel = player;
			card.left = i * (card.width + 5) + box.screenLeft;
			card.top = box.screenTop;
			box_table.addComponent(card);
			cardViews.push(card);
		}
	}

	// private function syncHand(table:PlayerTable, player:PlayerModel) {
	// 	final cards = player.hand;
	// 	for (i in 0...cards.length) {
	// 		final card = new Card();
	// 		final cardModel = cards[i];
	// 		card.model = cardModel;
	// 		card.playerModel = player;
	// 		card.left = i * (card.width + 5) + table.box_hand.screenLeft;
	// 		card.top = table.box_hand.screenTop;
	// 		table.hand.push(card);
	// 		box_table.addComponent(card);
	// 		cardViews.push(card);
	// 	}
	// }

	private function selectMyHandMode() {
		for (i in 0...playerTable.hand.length) {
			final card = playerTable.hand[i];
			card.box_cover.onMouseOver = function(e) {
				if (firstClick != null)
					return;
				trace('over card: ' + card.model.id);
				TweenX.to(card.box_card, {'top': 30}, .3);

				Main.model.previewPlayCard(card.model.id);
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
