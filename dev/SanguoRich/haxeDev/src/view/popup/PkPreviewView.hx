package view.popup;

import view.widgets.GridGridView;
import model.Config;
import model.IModel.PreResultOnNego;
import haxe.ui.events.UIEvent;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import model.IModel.NegoPreview;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/pkPreview-view.xml"))
class PkPreviewView extends PopupView {
	var p1List:PeopleListView;
	var p2List:PeopleListView;
	var gridView:GridGridView;

	public function new() {
		super();

		p1List = new PeopleListView();
		box_peopleList1.addComponent(p1List);

		p2List = new PeopleListView();
		box_peopleList2.addComponent(p2List);

		gridView = new GridGridView();
		box_gridInfo.addComponent(gridView);
	}

	override function showPopup(info:Dynamic, cb:()->Void = null) {
		super.showPopup(info, cb);

		final gameInfo = Main.model.gameInfo();

		function setRate() {
			var p1 = p1List.selectedItem;
			var p2 = p2List.selectedItem;

			var result:{energyBefore:Int, energyAfter:Int, armyChange:Int, successRate:Float} = Main.model.getPreResultOfPk(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1.id, p2.id);

			pro_energy.value = Main.getEnergyString(result.energyBefore, result.energyAfter, ENERGY_COST_ON_NEGO);
			pro_army.value = result.armyChange;
			pro_successRate.value = Main.getRateString(result.successRate);
		}

		function setOnePeople() {
			var p1:People = p1List.selectedItem;
			var p2:People = p2List.selectedItem;
			pro_name.value = '${p1.name} vs ${p2.name}';
			pro_force.value = Main.getVSString(p1.force, p2.force);
			pro_intelligence.value = Main.getVSString(p1.intelligence, p2.intelligence);
			pro_charm.value = Main.getVSString(p1.charm, p2.charm);
			pro_ability.value = Main.getAbilityString(p1, [0,1,2,3]);
			setRate();
		}

		p1List.setPeopleList(gameInfo.currentPlayer.people);
		p1List.onChange = function(e) {
			var p:Dynamic = p1List.selectedItem;
			if (p) {
				setOnePeople();
			}
		}
		p1List.selectedIndex = 0;

		final gridId = gameInfo.currentPlayer.atGridId;
		final grid = gameInfo.grids[gridId];
		gridView.setInfo(grid);

		p2List.setPeopleList(grid.people);
		p2List.onChange = function(e) {
			var p:Dynamic = p2List.selectedItem;
			if (p) {
				setOnePeople();
			}
		}
		p2List.selectedIndex = 0;
	}

	@:bind(btn_cancel, MouseEvent.CLICK)
	function onBtnCancelNego(e:MouseEvent) {
		fadeOut();
	}

	@:bind(btn_confirm, MouseEvent.CLICK)
	function onBtnConfirmNego(e:MouseEvent) {
		fadeOut();

		Main.view.onPkPreviewConfirmNegoClick(p1List.selectedItem.id, p2List.selectedItem.id);
	}
}
