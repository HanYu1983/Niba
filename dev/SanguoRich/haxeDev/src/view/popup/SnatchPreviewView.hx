package view.popup;

import model.IModel.SnatchPreview;
import haxe.ui.events.UIEvent;
import model.IModel.PreResultOnSnatch;
import model.ver2.Config;
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

	override function showPopup(info:Dynamic) {
		super.showPopup(info);

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

			pro_money1.value = '${warResult[0].moneyBefore} => ${warResult[0].moneyAfter}';
			pro_money2.value = '${warResult[1].moneyBefore} => ${warResult[1].moneyAfter}';

			pro_food1.value = '${warResult[0].foodBefore} => ${warResult[0].foodAfter}';
			pro_food2.value = '${warResult[1].foodBefore} => ${warResult[1].foodAfter}';

			final army1_dead = warResult[0].armyBefore - warResult[0].armyAfter;
			final army1_remain = Math.max(SNATCH_ARMY_AT_LEAST - army1_dead, 0);

			final army2_dead = warResult[1].armyBefore - warResult[1].armyAfter;
			final army2_remain = Math.max(SNATCH_ARMY_AT_LEAST - army2_dead, 0);

			pro_army1.value = '${Main.getFixNumber(SNATCH_ARMY_AT_LEAST, 0)} => ${Main.getFixNumber(army1_remain, 0)}';
			pro_army2.value = '${Main.getFixNumber(SNATCH_ARMY_AT_LEAST, 0)} => ${Main.getFixNumber(army2_remain, 0)}';

			lbl_willSnacth.value = '金錢:${Main.getFixNumber(result.money, 0)}及糧草:${Main.getFixNumber(result.food, 0)}';
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
				case 2: [0, 1, 2, 3, 6, 7, 8, 9];
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

		btn_isOccupation.onChange = function(e){
			lbl_warTypeName.value = btn_isOccupation.selected ? '攻城(${ENERGY_COST_ON_WAR})' : '搶奪(${ENERGY_COST_ON_SNATCH})';
			setRate();
		}

		btn_isOccupation.selected = info.isOccupation;
		btn_isOccupation.disabled = (!warInfo.isP1ArmyValid || !warInfo.isP2ArmyValid);
	}
}
