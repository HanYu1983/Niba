package view.popup;

import model.Config.SETTLE_FARM_COST;
import model.Config.SETTLE_CITY_COST;
import model.Config.SETTLE_VILLAGE_COST;
import model.Config.SETTLE_MARKET_COST;
import model.GridGenerator.Grid;
import view.widgets.GridGridView;
import view.widgets.PeopleListView;
import model.PeopleGenerator.People;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/settleView-view.xml"))
class SettleView extends PopupView {
	var p1List:PeopleListView;
	var gridViewBefore:GridGridView;
	var gridViewAfter:GridGridView;

	public function new() {
		super();

		p1List = new PeopleListView();
		box_peopleList1.addComponent(p1List);

		gridViewBefore = new GridGridView();
		box_gridViewBefore.addComponent(gridViewBefore);

		gridViewAfter = new GridGridView();
		box_gridViewAfter.addComponent(gridViewAfter);

		btn_market.text = '${btn_market.text}(${SETTLE_MARKET_COST})';
		btn_farm.text = '${btn_farm.text}(${SETTLE_FARM_COST})';
		btn_village.text = '${btn_village.text}(${SETTLE_VILLAGE_COST})';
		btn_city.text = '${btn_city.text}(${SETTLE_CITY_COST})';
	}

	@:bind(btn_cancel, MouseEvent.CLICK)
	function onBtnCancelClick(e:MouseEvent) {
		fadeOut();
	}

	@:bind(btn_confirm, MouseEvent.CLICK)
	function onBtnConfirmClick(e:MouseEvent) {
		final p = p1List.selectedItem;
		final settleType = grp_settleType.selectedIndex;
		if (p == null)
			return;
		if (settleType == -1)
			return;

		fadeOut();
		Main.view.onSettleViewClickConfirm(p.id, settleType);
	}

	override function showPopup(info:Dynamic, cb:() -> Void = null) {
		super.showPopup(info, cb);

		final gameInfo = Main.model.gameInfo();
		final player = gameInfo.currentPlayer;
		final grid = gameInfo.grids[gameInfo.currentPlayer.atGridId];

		function setRate() {
			final p = p1List.selectedItem;
			final settleType = grp_settleType.selectedIndex;
			if (p == null)
				return;
			if (settleType == -1)
				return;

			switch (settleType) {
				case 0: btn_confirm.disabled = (player.money < SETTLE_MARKET_COST) || (player.food < SETTLE_MARKET_COST);
				case 1: btn_confirm.disabled = (player.money < SETTLE_FARM_COST) || (player.food < SETTLE_FARM_COST);
				case 2: btn_confirm.disabled = (player.money < SETTLE_VILLAGE_COST) || (player.food < SETTLE_VILLAGE_COST);
				case 3: btn_confirm.disabled = (player.money < SETTLE_CITY_COST) || (player.food < SETTLE_CITY_COST);
			}

			final result:Grid = Main.model.getPreResultOfSettle(gameInfo.currentPlayer.id, p.id, grid.id, settleType);
			gridViewAfter.setInfo(result);
		}

		p1List.setPeopleList(gameInfo.currentPlayer.people);
		p1List.onChange = function(e) {
			var p:Dynamic = p1List.selectedItem;
			if (p) {
				setRate();
			}
		}
		p1List.selectedIndex = 0;

		grp_settleType.onChange = function(e) {
			setRate();
		}
		grp_settleType.selectedIndex = 0;

		gridViewBefore.setInfo(grid);
		gridViewAfter.setInfo(grid);
	}
}
