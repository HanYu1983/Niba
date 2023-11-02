package view.popup;

import model.Config.TREASURE_COST_MULTI;
import haxe.ui.containers.dialogs.Dialog.DialogButton;
import model.IModel.PlayerInfo;
import view.widgets.GridGridView;
import view.widgets.LeaderGridView;
import model.TreasureGenerator.TreasureInfo;
import model.IModel.GameInfo;
import view.widgets.TreasureListView;
import model.IModel.PreResultOfStrategy;
import haxe.ui.containers.dialogs.Dialogs;
import haxe.ui.containers.dialogs.MessageBox;
import view.widgets.StrategyListView;
import view.widgets.PeopleListView;
import haxe.ui.events.UIEvent;
import model.GridGenerator.Grid;
import model.IModel.StrategyCatelog;
import model.IModel.StrategyList;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/treasureMarketPreview-view.xml"))
class TreasureMarketPreviewView extends PopupView {
	var p1List:PeopleListView;
	var treasureInPlayer:TreasureListView;
	var treasureInStore:TreasureListView;
	var playerGrid:LeaderGridView;
	var gridGrid:GridGridView;

	public function new() {
		super();

		p1List = new PeopleListView();
		box_peopleList.addComponent(p1List);

		treasureInPlayer = new TreasureListView();
		box_treasureInPeople.addComponent(treasureInPlayer);

		treasureInStore = new TreasureListView();
		box_treasureInStore.addComponent(treasureInStore);

		playerGrid = new LeaderGridView();
		box_playerView.addComponent(playerGrid);

		gridGrid = new GridGridView();
		box_gridView.addComponent(gridGrid);
	}

	@:bind(btn_sellMyTreasure, MouseEvent.CLICK)
	function onBtnSellClick(e:MouseEvent) {
		final sell = treasureInPlayer.selectedItem;
		if (sell == null)
			return;

		if (sell.belongToPeopleId != null) {
			final msg = '這個寶物在別的武將身上，請先沒收再賣';
			Dialogs.messageBox(msg, msg, MessageBoxType.TYPE_INFO);
			return;
		}

		final msg = '確定用${sell.cost * TREASURE_COST_MULTI}價格賣掉${sell.name}寶物嗎?';
		Dialogs.messageBox(msg, msg, MessageBoxType.TYPE_QUESTION, true, (b) -> {
			if (b == DialogButton.YES) {
				Main.view.onTreasureMarketPreviewSellClick(sell.id);
				fadeOut();
			}
		});
	}

	@:bind(btn_buyTreasure, MouseEvent.CLICK)
	function onBtnBuyClick(e:MouseEvent) {

		final buy = treasureInStore.selectedItem;
		if (buy == null)
			return;

		final msg = '確定花費${buy.cost * TREASURE_COST_MULTI}購買${buy.name}寶物嗎?';
		Dialogs.messageBox(msg, msg, MessageBoxType.TYPE_QUESTION, true, (b) -> {
			if (b == DialogButton.YES) {
				Main.view.onTreasureMarketPreviewBuyClick(buy.id);
				fadeOut();
			}
		});
	}

	@:bind(btn_confirm, MouseEvent.CLICK)
	function onBtnConfirmClick(e:MouseEvent) {
		Main.view.syncViewWithEvents();
		fadeOut();
	}

	var lastType = 0;
	var lastPeopleId = 0;
	var currentGiveType = 0;

	function refresh() {
		final gameInfo = Main.model.gameInfo();
		final player = gameInfo.currentPlayer;
		final grid:Grid = gameInfo.grids[gameInfo.currentPlayer.atGridId];

		function setRate(type:Int, t:Dynamic) {
			
			switch(type){
				case 0:
					final playerAfter:PlayerInfo = Main.cloneObject( player );
					playerAfter.money = player.money + t.cost * TREASURE_COST_MULTI;
					playerGrid.setCompareInfo(player, playerAfter);

					final gridAfter = Main.cloneObject( grid );
					gridAfter.money = grid.money - t.cost * TREASURE_COST_MULTI;
					gridGrid.setCompareInfo(grid, gridAfter);

					btn_sellMyTreasure.disabled = !(gridAfter.money > 0);
					btn_sellMyTreasure.text = (gridAfter.money > 0) ? '賣掉這個寶物' : '對方錢不夠';
				case 1:
					final playerAfter = Main.cloneObject( player );
					playerAfter.money = player.money - t.cost * TREASURE_COST_MULTI;
					playerGrid.setCompareInfo(player, playerAfter);

					final gridAfter = Main.cloneObject( grid );
					gridAfter.money = grid.money + t.cost * TREASURE_COST_MULTI;
					gridGrid.setCompareInfo(grid, gridAfter);

					btn_buyTreasure.disabled = !(playerAfter.money > 0);
					btn_buyTreasure.text = (playerAfter.money > 0) ? '買這個寶物' : '主公錢不夠';
				case _:
					throw new haxe.Exception('type only 0:buy or 1:sell. type:${type}');
			}
		}

		treasureInPlayer.onChange = function(e) {
			var t:Dynamic = treasureInPlayer.selectedItem;
			if (t) {
				setRate(0, t);
			}
		}

		treasureInStore.onChange = function(e) {
			var t:Dynamic = treasureInStore.selectedItem;
			if (t) {
				setRate(1, t);
			}
		}

		btn_sellMyTreasure.disabled = true;
		btn_buyTreasure.disabled = true;

		p1List.setPeopleList(gameInfo.currentPlayer.people);

		playerGrid.setInfo(gameInfo.currentPlayer);
		treasureInPlayer.setList(player.treasures);

		gridGrid.setInfo(grid);
		treasureInStore.setList(grid.treasures);
	}

	override function showPopup(info:Dynamic, cb:() -> Void = null) {
		super.showPopup(info, cb);
		refresh();
	}

}
