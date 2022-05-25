package view.popup;

import view.widgets.PeopleListView;
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

	override function showPopup(info:Dynamic, cb:() -> Void = null) {
		super.showPopup(info, cb);

		final costType = info.type;
		final gameInfo = Main.model.gameInfo();

		btnbr_ops.selectedIndex = costType;

		for (btn in [btn_camp, btn_practice, btn_payForFun]) {
			btn.disabled = false;
		}
		switch (costType) {
			case 0 | 1:
				btn_payForFun.disabled = true;
			case 2:
				btn_camp.disabled = true;
				btn_practice.disabled = true;
		}

		p1List.setPeopleList(gameInfo.currentPlayer.people);
		p1List.selectedIndex = 0;

		function setRate() {
			final p = p1List.selectedItem;
			final result:{
				costArmy:Float,
				costFood:Float,
				costMoney:Float,
				gainExp:Float,
				gainEnergy:Float
			} = Main.model.getResultOfCost(gameInfo.currentPlayer, p, btnbr_ops.selectedIndex);
			final costName = btnbr_ops.selectedButton.text;
			var resultStr = '讓 ${p.name} 領導 ${costName} 嗎?\n';

			// 0: 札營 1: 練兵 2:作樂
			final costType = switch (btnbr_ops.selectedIndex) {
				case 0: '糧草';
				case 1: '士兵';
				case 2: '金錢';
				case _: '';
			}
			final gain = switch (btnbr_ops.selectedIndex) {
				case 0 | 2: result.gainEnergy;
				case 1: result.gainExp;
				case _: 0;
			}
			final recoverName = switch (btnbr_ops.selectedIndex) {
				case 0 | 2: '體力';
				case 1: '功績';
				case _: '';
			}
			final cost = switch (btnbr_ops.selectedIndex) {
				case 0: Main.getFixNumber(result.costFood);
				case 1: Main.getFixNumber(result.costArmy);
				case 2: Main.getFixNumber(result.costMoney);
				case _: 0;
			}
			resultStr += '預計消耗${costType} ${cost} 提升自身所有武將 ${recoverName}差距的 ${Main.getRateString(gain)}';
			lbl_result.value = resultStr;
		}

		btnbr_ops.onChange = function(e) {
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
