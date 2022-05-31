package view.popup;

import view.widgets.GridGridView;
import view.widgets.PeopleListView;
import model.Config;
import model.IModel.RESOURCE;
import model.IModel.ResourcePreview;
import model.IModel.PreResultOnResource;
import haxe.ui.events.MouseEvent;
import model.PeopleGenerator.People;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/resourcePreview-view.xml"))
class ResourcePreviewView extends PopupView {
	var p1List:PeopleListView;
	var gridView:GridGridView;

	public function new() {
		super();

		p1List = new PeopleListView();
		box_peopleList1.addComponent(p1List);

		gridView = new GridGridView();
		box_gridView.addComponent(gridView);
	}

	function getMoneyBase() {
		return switch (grp_moneyBase.selectedIndex) {
			case 0: 100;
			case 1: 200;
			case 2: 400;
			case _: 100;
		};
	}

	override function showPopup(info:Dynamic, cb:() -> Void = null) {
		super.showPopup(info, cb);

		final gameInfo = Main.model.gameInfo();
		final previewInfo:ResourcePreview = info;

		function setRate() {
			if (p1List.selectedItem == null)
				return;
			if (grp_moneyBase.selectedButton == null)
				return;

			final p1 = p1List.selectedItem;
			final moneyBase = getMoneyBase();
			final gameInfo = Main.model.gameInfo();
			final result:PreResultOnResource = Main.model.getPreResultOfResource(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1, moneyBase,
				info.market, info.resource);

			pro_energy.value = Main.getEnergyString(result.energyBefore, result.energyAfter, ENERGY_COST_ON_RESOURCE);
			pro_money.value = '${result.moneyBefore} => ${result.moneyAfter} (${result.moneyAfter - result.moneyBefore})';
			pro_food.value = '${result.foodBefore} => ${result.foodAfter} (${result.foodAfter - result.foodBefore})';
			pro_army.value = '${result.armyBefore} => ${result.armyAfter} (${result.armyAfter - result.armyBefore})';
			pro_maintainFood.value = '${Main.getFixNumber(result.maintainFoodBefore, 2)} => ${Main.getFixNumber(result.maintainFoodAfter, 2)}';
		}

		function setOnePeople() {
			final p1:People = p1List.selectedItem;
			pro_name.value = p1.name;
			pro_charm.value = p1.charm;
			pro_political.value = p1.political;
			pro_intelligence.value = p1.intelligence;
			pro_ability.value = switch (cast(info.resource, RESOURCE)) {
				case MONEY: Main.getAbilityString(p1, [4]);
				case FOOD: Main.getAbilityString(p1, [5]);
				case ARMY: Main.getAbilityString(p1, [11]);
				case STRETEGY: Main.getAbilityString(p1, [3]);
			}
			setRate();
		}

		p1List.setPeopleList(previewInfo.p1ValidPeople);
		p1List.onChange = function(e) {
			var p:Dynamic = p1List.selectedItem;
			if (p) {
				setOnePeople();
			}
		}
		p1List.selectedIndex = 0;

		final grid = gameInfo.grids[gameInfo.currentPlayer.atGridId];
		gridView.setInfo(grid);

		// btn_low.disabled = true;
		btn_middle.disabled = true;
		btn_high.disabled = true;

		final favor = grid.favor[gameInfo.currentPlayer.id];
		switch (favor) {
			case favor if (favor >= 2):
				// btn_low.disabled = false;
				btn_middle.disabled = false;
				btn_high.disabled = false;
			case favor if (favor >= 1):
				// btn_low.disabled = false;
				btn_middle.disabled = false;
			case favor if (favor >= -1):
				// btn_low.disabled = false;
			case _:
		}
		grp_moneyBase.onChange = function(e) {
			setRate();
		}
		grp_moneyBase.selectedIndex = 0;

		if (cast(info.resource, RESOURCE) == MONEY) {
			grp_moneyBase.hide();
		} else {
			grp_moneyBase.show();
		}

		btn_confirm.onClick = function(e) {
			fadeOut();

			final moneyBase = getMoneyBase();
			Main.view.onResourcePreviewConfirmClick(p1List.selectedItem.id, moneyBase, info.market, info.resource);
		}
	}

	@:bind(btn_cancel, MouseEvent.CLICK)
	function onBtnCancel(e:MouseEvent) {
		fadeOut();
	}
}
