package view.popup;

import model.IModel.StrategyCatelog;
import model.IModel.StrategyList;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/strategyPreview-view.xml"))
class StrategyPreviewView extends PopupView {
	var p1List:PeopleListView;
	var strategyList:StrategyListView;

	public function new() {
		super();

		p1List = new PeopleListView();
		box_peopleList.addComponent(p1List);

		strategyList = new StrategyListView();
		strategyList.setList(StrategyList);
		box_strategyList.addComponent(strategyList);
	}

	@:bind(btn_cancel, MouseEvent.CLICK)
	function onBtnCancelClick(e:MouseEvent) {
		fadeOut();
	}

	@:bind(btn_confirm, MouseEvent.CLICK)
	function onBtnConfirmClick(e:MouseEvent) {
		fadeOut();

		var targetPlayer = drp_player.selectedItem.id;
		var targetPeople = drp_people.selectedItem.id;
		var targetGrid = drp_grid.selectedItem.id;
		Main.view.onStrategyPreviewConfirmClick(p1List.selectedItem.id, strategyList.selectedItem.id, targetPlayer, targetPeople, targetGrid);
	}

	override function showPopup(info:Dynamic) {
		super.showPopup(info);

		final gameInfo = Main.model.gameInfo();
		function setRate() {
			if (drp_player.selectedItem == null)
				return;
			if (drp_people.selectedItem == null)
				return;
			if (drp_grid.selectedItem == null)
				return;

			var p1 = p1List.selectedItem;
			var s = strategyList.selectedItem;

			var targetPlayer = drp_player.selectedItem.id;
			var targetPeople = drp_people.selectedItem.id;
			var targetGrid = drp_grid.selectedItem.id;
			var result:{energyBefore:Int, energyAfter:Int, rate:Float} = Main.model.getStrategyRate(p1, s, targetPlayer, targetPeople, targetGrid);

			pro_energy.value = '${result.energyBefore} => ${result.energyAfter}';
			lbl_rate.value = Main.getRateString(result.rate);
		}

		function setOnePeople(p:People) {
			pro_name.value = p.name;

			pro_intelligence.value = p.intelligence;
			pro_ability.value = Main.getAbilityString(p, [4]);

			setRate();
		}

		p1List.setPeopleList(gameInfo.currentPlayer.people);
		p1List.onChange = function(e) {
			var p:Dynamic = p1List.selectedItem;
			if (p) {
				setOnePeople(p);
			}
		}
		p1List.selectedIndex = 0;

		strategyList.onChange = function(e) {
			var s:StrategyCatelog = strategyList.selectedItem;
			if (s != null) {
				lbl_usingStrategy.value = s.name;

				drp_player.disabled = true;
				drp_people.disabled = true;
				drp_grid.disabled = true;
				switch (s.targetType) {
					case TARGET_GRID:
						drp_grid.disabled = false;
					case TARGET_PLAYER:
						drp_player.disabled = false;
					case TARGET_PEOPLE:
						drp_player.disabled = false;
						drp_people.disabled = false;
					case SELF_GRID:
					case SELF_PEOPLE:
						drp_player.selectedIndex = gameInfo.currentPlayer.id;
						drp_people.disabled = false;
					case SELF_PLAYER:
				}
				setRate();
			}
		}
		strategyList.selectedIndex = 0;

		function updatePlayerList() {
			drp_player.dataSource.clear();
			for (player in gameInfo.players) {
				drp_player.dataSource.add({
					id: player.id,
					text: player.name
				});
				drp_player.selectedIndex = 0;
			}
		}

		function updatePeopleList() {
			drp_people.dataSource.clear();
			for (people in gameInfo.players[drp_player.selectedItem.id].people) {
				drp_people.dataSource.add({
					id: people.id,
					text: people.name
				});
			}
			drp_people.selectedIndex = 0;
		}

		function updateGridList() {
			drp_grid.dataSource.clear();
			for (grid in gameInfo.grids) {
				drp_grid.dataSource.add({
					id: grid.id,
					text: grid.name
				});
				drp_grid.selectedIndex = 0;
			}
		}

		updatePlayerList();
		updatePeopleList();
		updateGridList();

		drp_player.onChange = function(e) {
			updatePeopleList();
			setRate();
		}
		drp_player.selectedIndex = 0;

		drp_people.onChange = function(e){
			setRate();
		}

		drp_grid.onChange = function(e){
			setRate();
		}
	}
}
