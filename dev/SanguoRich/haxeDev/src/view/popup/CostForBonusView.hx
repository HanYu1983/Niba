package view.popup;

import model.IModel.SnatchPreview;
import haxe.ui.events.UIEvent;
import model.IModel.PreResultOnSnatch;
import model.Config;
import model.IModel.PreResultOnWar;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import model.IModel.WarPreview;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/costForBonus-view.xml"))
class CostForBonusView extends PopupView {
	var p1List:PeopleListView;

	public function new() {
		super();

		p1List = new PeopleListView();
		box_peopleList.addComponent(p1List);
	}

	@:bind(btn_cancel, MouseEvent.CLICK)
	function onBtnCancelClick(e:MouseEvent) {
		fadeOut();
	}

	@:bind(btn_confirm, MouseEvent.CLICK)
	function onBtnConfirmClick(e:MouseEvent) {
		fadeOut();

		final p = p1List.selectedItem;
		Main.view.onCostForBonusConfirmClick(p.id, btnbr_ops.selectedIndex);
	}

	override function showPopup(info:Dynamic, cb:()->Void = null) {
		super.showPopup(info, cb);

		final costType = info.type;
		final gameInfo = Main.model.gameInfo();

		switch(costType){
			case 0:btnbr_ops.selectedIndex = 0;
			case 1:btnbr_ops.selectedIndex = 1;
			case _:
		}

		p1List.setPeopleList(gameInfo.currentPlayer.people);
		p1List.selectedIndex = 0;

		function setRate() {
			final p = p1List.selectedItem;
			final isCamp = btnbr_ops.selectedIndex == 0;
			final result:{costFood:Float, gainExp:Float, gainEnergy:Float} = Main.model.getResultOfCost(gameInfo.currentPlayer, p, isCamp ? 0 : 1);
			
			final costName = isCamp ? "札營" : "練兵";
			var resultStr = '讓 ${p.name} 領導 ${costName} 嗎?\n';

			final gain = isCamp ? result.gainEnergy : result.gainExp;
			resultStr += '預計消耗糧草 ${Main.getFixNumber(result.costFood)} 提升自身所有武將 ${ btn_camp.selected ? "體力" : "功績"} ${Main.getFixNumber(gain)}';
			lbl_result.value = resultStr;
		}

		btnbr_ops.onChange = function(e){
			setRate();
		}

		p1List.onChange = function(e) {
			var p:Dynamic = p1List.selectedItem;
			if (p) {
				setRate();
			}
		}
	}
}
