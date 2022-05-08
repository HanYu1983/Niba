package view.popup;

import model.TreasureGenerator.TreasureInfo;
import haxe.ui.containers.dialogs.Dialog.DialogButton;
import model.IModel.GameInfo;
import view.widgets.TreasureListView;
import haxe.ui.containers.dialogs.Dialogs;
import haxe.ui.containers.dialogs.MessageBox;
import view.widgets.PeopleListView;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/treasurePreview-view.xml"))
class TreasurePreviewView extends PopupView {
	var p1List:PeopleListView;
	var treasureInPeople:TreasureListView;
	var treasureInStore:TreasureListView;

	public function new() {
		super();

		p1List = new PeopleListView();
		box_peopleList.addComponent(p1List);

		treasureInPeople = new TreasureListView();
		box_treasureInPeople.addComponent(treasureInPeople);

		treasureInStore = new TreasureListView();
		box_treasureInStore.addComponent(treasureInStore);
	}

	@:bind(btn_equip, MouseEvent.CLICK)
	function onBtnEquipClick(e:MouseEvent) {
		var p1 = p1List.selectedItem;
		final equip = treasureInStore.selectedItem;

		if (p1 == null)
			return;
		if (equip == null)
			return;

		if (equip.belongToPeopleId != null) {
			Dialogs.messageBox('會從其他武將沒收這個寶物，被沒收的武將因為失望會損失一半的體力。\n確定執行嗎?', '', MessageBoxType.TYPE_QUESTION, true, (b) -> {
				if (b == DialogButton.YES) {
					Main.model.takeEquip(p1, equip.id, (gameInfo:GameInfo) -> {
						Dialogs.messageBox('賜予完畢', '賜予完畢', MessageBoxType.TYPE_INFO);
						refresh();
					});
				}
			});
		}
	}

	@:bind(btn_unequip, MouseEvent.CLICK)
	function onBtnUnEquipClick(e:MouseEvent) {
		var p1 = p1List.selectedItem;
		final unequip = treasureInPeople.selectedItem;
		if (p1 == null)
			return;
		if (unequip == null)
			return;

		Dialogs.messageBox('沒收這個寶物，被沒收的武將因為失望會損失一半的體力。\n確定執行嗎?', '', MessageBoxType.TYPE_QUESTION, true, (b) -> {
			if (b == DialogButton.YES) {
				Main.model.takeUnEquip(p1, unequip.id, (gameInfo:GameInfo) -> {
					Dialogs.messageBox('沒收完畢', '沒收完畢', MessageBoxType.TYPE_INFO);
					refresh();
				});
			}
		});
	}

	@:bind(btn_confirm, MouseEvent.CLICK)
	function onBtnConfirmClick(e:MouseEvent) {
		Main.model.refresh(()->{
			Main.view.syncView();
			fadeOut();
		});
	}

	var lastType = 0;
	var lastPeopleId = 0;

	function refresh() {
		final gameInfo = Main.model.gameInfo();
		function setRate(type:Int) {
			if (p1List.selectedItem == null)
				return;

			lastType = type;
			lastPeopleId = p1List.selectedIndex;

			var p1 = p1List.selectedItem;
			var result:{peopleBefore:People, peopleAfter:People} = switch (type) {
				case 0:
					final unequip = treasureInPeople.selectedItem;
					if (unequip == null)
						return;
					Main.model.getUnEquipResult(p1, unequip.id);
				case 1:
					final equip:TreasureInfo = treasureInStore.selectedItem;
					if (equip == null)
						return;
					Main.model.getEquipResult(p1, equip.id);
				case _: null;
			}

			if (result != null) {
				final before = result.peopleBefore;
				final after = result.peopleAfter;
				pro_force.value = '${Main.getCompareString(before.force, after.force)}';
				pro_command.value = '${Main.getCompareString(before.command, after.command)}';
				pro_intelligence.value = '${Main.getCompareString(before.intelligence, after.intelligence)}';
				pro_political.value = '${Main.getCompareString(before.political, after.political)}';
				pro_charm.value = '${Main.getCompareString(before.charm, after.charm)}';
				pro_abilities.value = '${Main.abilitiesToString(result.peopleBefore.abilities)} => ${Main.abilitiesToString(result.peopleAfter.abilities)}';
			}
		}

		function updateTreasureInPeopleList() {
			final p:People = p1List.selectedItem;
			treasureInPeople.setList(p.treasures);
		}

		function setOnePeople(p:People) {
			pro_name.value = p.name;
			pro_force.value = p.force;
			pro_command.value = p.command;
			pro_intelligence.value = p.intelligence;
			pro_political.value = p.political;
			pro_charm.value = p.charm;
			pro_abilities.value = Main.abilitiesToString(p.abilities);

			setRate(lastType);
			treasureInPeople.selectedIndex = -1;
		}

		treasureInPeople.onChange = function(e) {
			var t:Dynamic = treasureInPeople.selectedItem;
			if (t) {
				setRate(0);
			}
		}

		treasureInStore.onChange = function(e) {
			var t:Dynamic = treasureInStore.selectedItem;
			if (t) {
				setRate(1);
			}
		}

		p1List.setPeopleList(gameInfo.currentPlayer.people);
		p1List.onChange = function(e) {
			var p:Dynamic = p1List.selectedItem;
			if (p) {
				setOnePeople(p);
				updateTreasureInPeopleList();
			}
		}

		p1List.selectedIndex = lastPeopleId;

		updateTreasureInPeopleList();
		treasureInStore.setList(gameInfo.currentPlayer.treasures);
	}

	override function showPopup(info:Dynamic, cb:() -> Void = null) {
		super.showPopup(info, cb);
		refresh();
	}
}
