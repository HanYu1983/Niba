package view.popup;

import view.widgets.PeopleListView;
import model.IModel.SnatchPreview;
import haxe.ui.events.UIEvent;
import model.IModel.PreResultOnSnatch;
import model.Config;
import model.IModel.PreResultOnWar;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import model.IModel.WarPreview;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/snatchPreview-view.xml"))
class SnatchPreviewView extends PopupView {
	var p1List:PeopleListView;
	var p2List:PeopleListView;

	public function new() {
		super();

		p1List = new PeopleListView();
		box_peopleList1.addComponent(p1List);

		p2List = new PeopleListView();
		box_peopleList2.addComponent(p2List);
	}

	@:bind(btn_cancel, MouseEvent.CLICK)
	function onBtnCancelClick(e:MouseEvent) {
		fadeOut();
	}

	@:bind(btn_confirm, MouseEvent.CLICK)
	function onBtnConfirmClick(e:MouseEvent) {
		fadeOut();

		Main.view.onSnatchPreviewConfirmClick(p1List.selectedItem.id, p2List.selectedItem.id, btn_isOccupation.selected);
	}

	override function showPopup(info:Dynamic, cb:() -> Void = null) {
		super.showPopup(info, cb);

		var warInfo:SnatchPreview = info;

		function setRate() {
			var p1 = p1List.selectedItem;
			var p2 = p2List.selectedItem;

			var isOccupation = btn_isOccupation.selected;
			var gameInfo = Main.model.gameInfo();
			var result:PreResultOnSnatch = Main.model.getPreResultOfSnatch(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1, p2, isOccupation);

			var warResult = result.war;
			pro_force1.value = p1.force;
			pro_command2.value = p2.command;

			pro_money1.value = '${Main.getCompareString(warResult[0].moneyBefore, warResult[0].moneyAfter)} ${warResult[0].moneyAfter <= 0 ? "戰力下降!" : ""}';
			pro_money2.value = '${Main.getCompareString(warResult[1].moneyBefore, warResult[1].moneyAfter)} ${warResult[1].moneyAfter <= 0 ? "戰力下降!" : ""}';

			pro_food1.value = '${Main.getCompareString(warResult[0].foodBefore, warResult[0].foodAfter)} ${warResult[0].foodAfter <= 0 ? "戰力下降!" : ""}';
			pro_food2.value = '${Main.getCompareString(warResult[1].foodBefore, warResult[1].foodAfter)} ${warResult[1].foodAfter <= 0 ? "戰力下降!" : ""}';

			final army1_dead = warResult[0].armyBefore - warResult[0].armyAfter;
			final army1_remain = Math.max(SNATCH_ARMY_AT_LEAST - army1_dead, 0);

			final army2_dead = warResult[1].armyBefore - warResult[1].armyAfter;
			final army2_remain = Math.max(SNATCH_ARMY_AT_LEAST - army2_dead, 0);

			pro_armyFight1.value = '${warResult[0].armyFight} => ${warResult[0].armyFight - army1_dead} (-${army1_dead})';
			pro_armyFight2.value = '${warResult[1].armyFight} => ${warResult[1].armyFight - army2_dead} (-${army2_dead})';

			final grid = gameInfo.grids[gameInfo.currentPlayer.atGridId];
			if (isOccupation) {
				pro_army1.value = '${Main.getFixNumber(warResult[0].armyBefore, 0)} => ${Main.getFixNumber(warResult[0].armyAfter, 0)} (${Main.getFixNumber(warResult[0].armyAfter - warResult[0].armyBefore)})';
				pro_army2.value = '${Main.getFixNumber(warResult[1].armyBefore, 0)} => ${Main.getFixNumber(warResult[1].armyAfter, 0)} (${Main.getFixNumber(warResult[1].armyAfter - warResult[1].armyBefore)})';

				final isWin = result.success;
				lbl_willSnacth.value = isWin ? '占領成功' : '占領失敗';
				lbl_rateForTreasure.value = isWin ? '預計獲得${grid.treasures.length}個寶物' : '無';
			} else {
				pro_army1.value = '${Main.getFixNumber(SNATCH_ARMY_AT_LEAST, 0)} => ${Main.getFixNumber(army1_remain, 0)} (${Main.getFixNumber(army1_remain - SNATCH_ARMY_AT_LEAST)})';
				pro_army2.value = '${Main.getFixNumber(SNATCH_ARMY_AT_LEAST, 0)} => ${Main.getFixNumber(army2_remain, 0)} (${Main.getFixNumber(army2_remain - SNATCH_ARMY_AT_LEAST)})';
				lbl_willSnacth.value = '金錢:${Main.getFixNumber(result.money, 0)}及糧草:${Main.getFixNumber(result.food, 0)}';
				lbl_rateForTreasure.value = Main.getRateString(result.rateForTreasure);
			}
		}

		function setOnePeople(id:Int, p:People) {
			var pro_name:Property = Reflect.getProperty(this, 'pro_name${id}');
			var pro_energy:Property = Reflect.getProperty(this, 'pro_energy${id}');
			var pro_intelligence:Property = Reflect.getProperty(this, 'pro_intelligence${id}');
			var pro_ability:Property = Reflect.getProperty(this, 'pro_ability${id}');

			pro_name.value = p.name;
			pro_energy.value = p.energy;
			pro_intelligence.value = p.intelligence;

			pro_ability.value = Main.getAbilityString(p, switch (id) {
				case 1: [0, 1, 2, 3, 6, 7];
				case 2: info.isOccupation ? [0, 1, 2, 3, 6, 7, 8, 9] : [0, 1, 2, 3, 6, 7];
				case _: [];
			});

			setRate();
		}

		p1List.setPeopleList(warInfo.p1ValidPeople);
		p1List.onChange = function(e) {
			var p:Dynamic = p1List.selectedItem;
			if (p) {
				setOnePeople(1, p);
			}
		}
		p1List.selectedIndex = 0;

		p2List.setPeopleList(warInfo.p2ValidPeople);
		p2List.onChange = function(e) {
			var p:Dynamic = p2List.selectedItem;
			if (p) {
				setOnePeople(2, p);
			}
		}
		p2List.selectedIndex = 0;

		btn_isOccupation.onChange = function(e) {
			lbl_warTypeName.value = btn_isOccupation.selected ? '攻城(${ENERGY_COST_ON_WAR})' : '搶奪(${ENERGY_COST_ON_SNATCH})';
			setRate();
		}

		btn_isOccupation.selected = info.isOccupation;
		btn_isOccupation.disabled = (!warInfo.isP1ArmyValid || !warInfo.isP2ArmyValid);
	}
}
