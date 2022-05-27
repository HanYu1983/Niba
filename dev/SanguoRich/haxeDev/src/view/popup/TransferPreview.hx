package view.popup;

import haxe.ui.containers.dialogs.Dialog.DialogButton;
import haxe.ui.containers.dialogs.MessageBox.MessageBoxType;
import haxe.ui.containers.dialogs.Dialogs;
import view.widgets.PeopleListView;
import model.GridGenerator.Grid;
import view.widgets.GridGridView;
import view.widgets.LeaderGridView;
import haxe.ui.events.MouseEvent;

using Lambda;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/transferPreview-view.xml"))
class TransferPreview extends PopupView {
	var plist:PeopleListView;
	var leaderView:LeaderGridView;
	var gridView:GridGridView;

	public function new() {
		super();

		plist = new PeopleListView();
		box_plist.addComponent(plist);

		leaderView = new LeaderGridView();
		box_leader.addComponent(leaderView);

		gridView = new GridGridView();
		box_grid.addComponent(gridView);
	}

	@:bind(btn_cancel, MouseEvent.CLICK)
	function onBtnCancelClick(e:MouseEvent) {
		fadeOut();
	}

	@:bind(btn_confirm, MouseEvent.CLICK)
	function onBtnConfirmClick(e:MouseEvent) {
		final list:Array<Dynamic> = plist.dataSource.data;
		outData[0].people = list.filter((p:Dynamic) -> !Reflect.field(p, 'chk_sel'));
		outData[1].people = list.filter((p:Dynamic) -> Reflect.field(p, 'chk_sel'));

		function doIt() {
			final gameInfo = Main.model.gameInfo();
			final valid = Main.model.checkValidTransfer(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, outData[0], outData[1]);

			if (valid) {
				fadeOut();
				Main.view.onTransferPreviewConfirmClick(outData);
			} else {
				final msg = '請確定沒有勾選已經在城市裏的將領';
				Dialogs.messageBox(msg, msg, MessageBoxType.TYPE_INFO);
			}
		}

		switch (outData[1].people.length) {
			case 1:
				doIt();
			case 0:
				final msg = '確定不派將領佔領嗎?';
				Dialogs.messageBox(msg, msg, MessageBoxType.TYPE_QUESTION, true, (b) -> {
					if (b == DialogButton.YES) {
						doIt();
					}
				});
			case _:
				final msg = '確定派超過一個將領佔領嗎?';
				Dialogs.messageBox(msg, msg, MessageBoxType.TYPE_QUESTION, true, (b) -> {
					if (b == DialogButton.YES) {
						doIt();
					}
				});
		}
	}

	var outData:Dynamic = [];

	override function showPopup(info:Dynamic, cb:() -> Void = null) {
		super.showPopup(info, cb);

		function updateView(p, g) {
			leaderView.setInfo(p);
			gridView.setInfo(g);

			outData = [p, g];
		}

		final gameInfo = Main.model.gameInfo();
		final player = gameInfo.currentPlayer;
		final grid:Grid = gameInfo.grids[player.atGridId];
		final peopleInPlayer = player.people.slice(0);
		final gridPeopleIds:Array<Int> = grid.people.map(p -> p.id);
		for (p in peopleInPlayer) {
			Reflect.setField(p, 'chk_sel', gridPeopleIds.has(p.id));
		}
		outData = [player, grid];
		plist.setPeopleList(peopleInPlayer);

		updateView(player, grid);

		// 先算出如果儘可能把所有的資源都給格子的話，格子的資源量。
		// 如果資源充足，就是格子的最大量；如果資源不夠，就是玩家身上的資源加上格子目前的資源
		final maxGiveMoney = Math.min((grid.money + player.money), grid.maxMoney);
		final maxGiveFood = Math.min((grid.food + player.food), grid.maxFood);
		final maxGiveArmy = Math.min((grid.army + player.army), grid.maxArmy);

		// 算出格子目前的資源佔所有能給出的占比
		sli_money.pos = (grid.money / maxGiveMoney) * 100;
		sli_food.pos = (grid.food / maxGiveFood) * 100;
		sli_army.pos = (grid.army / maxGiveArmy) * 100;

		var tempPlayer:Dynamic = {};
		for (key in Reflect.fields(player)) {
			Reflect.setField(tempPlayer, key, Reflect.field(player, key));
		}

		var tempGrid:Dynamic = {};
		for (key in Reflect.fields(grid)) {
			Reflect.setField(tempGrid, key, Reflect.field(grid, key));
		}

		sli_money.onChange = function(e) {
			// 算出格子目前的資源量（包含原本有的）
			tempGrid.money = sli_money.value * .01 * maxGiveMoney;
			// 因爲格子本身有資源，所以玩家扣除的量等於算出的量減掉格子本身的量
			tempPlayer.money = player.money - (tempGrid.money - grid.money);
			updateView(tempPlayer, tempGrid);
		}

		sli_food.onChange = function(e) {
			tempGrid.food = sli_food.value * .01 * maxGiveFood;
			tempPlayer.food = player.food - (tempGrid.food - grid.food);
			updateView(tempPlayer, tempGrid);
		}

		sli_army.onChange = function(e) {
			tempGrid.army = sli_army.value * .01 * maxGiveArmy;
			tempPlayer.army = player.army - (tempGrid.army - grid.army);
			updateView(tempPlayer, tempGrid);
		}

		grp_auto.onChange = function(e) {
			switch (grp_auto.selectedIndex) {
				case 0:
				case other:
					sli_money.pos = (other - 1) * 25;
					sli_food.pos = (other - 1) * 25;
					sli_army.pos = (other - 1) * 25;
			}
		}
		grp_auto.selectedIndex = 0;
	}
}
