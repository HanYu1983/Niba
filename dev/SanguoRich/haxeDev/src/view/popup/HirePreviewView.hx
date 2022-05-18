package view.popup;

import view.widgets.PeopleListView;
import model.Config;
import model.IModel.PreResultOnHire;
import haxe.ui.events.MouseEvent;
import model.PeopleGenerator.People;
import haxe.ui.events.UIEvent;
import model.IModel.HirePreview;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/hirePreview-view.xml"))
class HirePreviewView extends PopupView {
	var p1List:PeopleListView;
	var p2List:PeopleListView;

	public function new() {
		super();

		p1List = new PeopleListView();
		box_peopleList1.addComponent(p1List);

		p2List = new PeopleListView();
		box_peopleList2.addComponent(p2List);
	}

	var isValidHire = false;

	override function showPopup(info:Dynamic, cb:()->Void = null) {
		super.showPopup(info, cb);

		var info:HirePreview = info;

		function setRate() {
			if(p1List.selectedItem == null) return;
			if(p2List.selectedItem == null) return;
			if(grp_moneyMore.selectedButton == null) return;

			final p1 = p1List.selectedItem;
			final p2 = p2List.selectedItem;
			final moneyMore = Std.parseFloat( grp_moneyMore.selectedButton.text );
			final gameInfo = Main.model.gameInfo();
			final result:PreResultOnHire = Main.model.getPreResultOfHire(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1, p2, moneyMore);

			isValidHire = result.moneyAfter >= 0;
			btn_confirm.disabled = !isValidHire;
			
			pro_energy.value = Main.getEnergyString(result.energyBefore, result.energyAfter, ENERGY_COST_ON_HIRE);
			pro_money.value = '${Main.getFixNumber(result.moneyBefore)} => ${Main.getFixNumber(result.moneyAfter)} ${!isValidHire ? "金錢不夠" : ""}';
			pro_maintainMoney.value = '${Main.getFixNumber(result.maintainMoneyBefore, 2)} => ${Main.getFixNumber(result.maintainMoneyAfter, 2)}';
			pro_successRate.value = Main.getRateString(result.successRate);
		}

		function setOnePeople() {
			var p1:People = p1List.selectedItem;
			var p2:People = p2List.selectedItem;
			pro_name.value = '${p1.name} vs ${p2.name}';
			pro_charm.value = Main.getVSString(p1.charm, p2.charm);
			setRate();
		}

		p1List.setPeopleList(info.p1ValidPeople);
		p1List.onChange = function(e) {
			var p:Dynamic = p1List.selectedItem;
			if (p) {
				setOnePeople();
			}
		}
		p1List.selectedIndex = 0;

		p2List.setPeopleList(info.p2ValidPeople);
		p2List.onChange = function(e) {
			var p:Dynamic = p2List.selectedItem;
			if (p) {
				setOnePeople();
			}
		}
		p2List.selectedIndex = 0;

		grp_moneyMore.onChange = function(e){
			setRate();
		}
		grp_moneyMore.selectedIndex = 0;
	}

	@:bind(btn_cancel, MouseEvent.CLICK)
	function onBtnCancel(e:MouseEvent) {
		fadeOut();
	}

	@:bind(btn_confirm, MouseEvent.CLICK)
	function onBtnConfirm(e:MouseEvent) {
		if (isValidHire) {
			fadeOut();

			final moneyMore = Std.parseFloat( grp_moneyMore.selectedButton.text );
			Main.view.onHirePreviewViewConfirmClick(p1List.selectedItem.id, p2List.selectedItem.id, moneyMore);
		}
	}
}
