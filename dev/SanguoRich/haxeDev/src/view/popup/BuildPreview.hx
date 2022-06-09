package view.popup;

import model.IModel.PreResultOnBuilding;
import model.PeopleGenerator.People;
import view.widgets.LeaderGridView;
import model.IModel.GameInfo;
import view.widgets.PeopleListView;
import haxe.ui.containers.dialogs.Dialog.DialogButton;
import haxe.ui.containers.dialogs.MessageBox.MessageBoxType;
import haxe.ui.containers.dialogs.Dialogs;
import model.GridGenerator.BUILDING;
import model.GridGenerator.Grid;
import view.widgets.GridGridView;
import haxe.ui.events.MouseEvent;

using Lambda;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/buildingPreview-view.xml"))
class BuildPreview extends PopupView {
	var plist:PeopleListView;
	var gridView:GridGridView;
	var playerView:LeaderGridView;

	public function new() {
		super();

		plist = new PeopleListView();
		box_plist.addComponent(plist);

		gridView = new GridGridView();
		box_grid.addComponent(gridView);

		playerView = new LeaderGridView();
		box_player.addComponent(playerView);
	}

    function getNextLevelBuilding(current:BUILDING) {
        return switch (current) {
			case PUB(level):
				if (level < 1) BUILDING.PUB(level + 1); else BUILDING.PUB(1);
			case TREASURE(level):
				if (level < 1) BUILDING.TREASURE(level + 1); else BUILDING.TREASURE(1);
			case FISHING(level):
				if (level < 1) BUILDING.FISHING(level + 1); else BUILDING.FISHING(1);
			case HUNTING(level):
				if (level < 1) BUILDING.HUNTING(level + 1); else BUILDING.HUNTING(1);
			case MINE(level):
				if (level < 1) BUILDING.MINE(level + 1); else BUILDING.MINE(1);
			case MARKET(level):
				if (level < 3) BUILDING.MARKET(level + 1); else BUILDING.MARKET(3);
			case FARM(level):
				if (level < 3) BUILDING.FARM(level + 1); else BUILDING.FARM(3);
			case BARRACKS(level):
				if (level < 3) BUILDING.BARRACKS(level + 1); else BUILDING.BARRACKS(3);
			case HOME(level):
				if (level < 3) BUILDING.HOME(level + 1); else BUILDING.HOME(3);
			case EXPLORE(level):
				if (level < 1) BUILDING.EXPLORE(level + 1); else BUILDING.EXPLORE(1);
			case SIEGEFACTORY(level):
				if (level < 1) BUILDING.SIEGEFACTORY(level + 1); else BUILDING.SIEGEFACTORY(1);
			case ACADEMY(level):
				if (level < 1) BUILDING.ACADEMY(level + 1); else BUILDING.ACADEMY(1);
			case WALL(level):
				if (level < 3) BUILDING.WALL(level + 1); else BUILDING.WALL(1);
			case BANK(level):
				if (level < 3) BUILDING.BANK(level + 1); else BUILDING.BANK(1);
			case BARN(level):
				if (level < 3) BUILDING.BARN(level + 1); else BUILDING.BARN(1);
		};
    }

	@:bind(btn_cancel, MouseEvent.CLICK)
	function onBtnCancelClick(e:MouseEvent) {
		fadeOut();
	}

	@:bind(btn_confirm, MouseEvent.CLICK)
	function onBtnConfirmClick(e:MouseEvent) {
		final current:BUILDING = tab_buildingList.selectedItem.type;
        final to = getNextLevelBuilding(current);
		// final to = switch (current) {
		// 	case TREASURE(level):
		// 		if (level < 1) BUILDING.TREASURE(level + 1); else BUILDING.TREASURE(1);
		// 	case FISHING(level):
		// 		if (level < 1) BUILDING.FISHING(level + 1); else BUILDING.FISHING(1);
		// 	case HUNTING(level):
		// 		if (level < 1) BUILDING.HUNTING(level + 1); else BUILDING.HUNTING(1);
		// 	case MINE(level):
		// 		if (level < 1) BUILDING.MINE(level + 1); else BUILDING.MINE(1);
		// 	case MARKET(level):
		// 		if (level < 3) BUILDING.MARKET(level + 1); else BUILDING.MARKET(3);
		// 	case FARM(level):
		// 		if (level < 3) BUILDING.FARM(level + 1); else BUILDING.FARM(3);
		// 	case BARRACKS(level):
		// 		if (level < 3) BUILDING.BARRACKS(level + 1); else BUILDING.BARRACKS(3);
		// 	case HOME(level):
		// 		if (level < 3) BUILDING.HOME(level + 1); else BUILDING.HOME(3);
		// 	case EXPLORE(level):
		// 		if (level < 1) BUILDING.EXPLORE(level + 1); else BUILDING.EXPLORE(1);
		// 	case SIEGEFACTORY(level):
		// 		if (level < 1) BUILDING.SIEGEFACTORY(level + 1); else BUILDING.SIEGEFACTORY(1);
		// 	case ACADEMY(level):
		// 		if (level < 1) BUILDING.ACADEMY(level + 1); else BUILDING.ACADEMY(1);
		// 	case WALL(level):
		// 		if (level < 3) BUILDING.WALL(level + 1); else BUILDING.WALL(1);
		// 	case BANK(level):
		// 		if (level < 3) BUILDING.BANK(level + 1); else BUILDING.BANK(1);
		// 	case BARN(level):
		// 		if (level < 3) BUILDING.BARN(level + 1); else BUILDING.BARN(1);
		// }

		if (Type.enumEq(current, to))
			return;

		final people:People = plist.selectedItem;
		final catelog = tab_buildingList.selectedItem;
		final toCatelog = Main.getBuildingCatelog(to);

		// final gameInfo = Main.model.gameInfo();
		// if (gameInfo.currentPlayer.money < catelog.money) {
		// 	Dialogs.messageBox('金錢不足', '金錢不足', MessageBoxType.TYPE_INFO);
		// 	return;
		// }

		final title = '確定要擴建 ${catelog.name} 成 ${toCatelog.name} 嗎?';
		// var msg = '金錢:${Main.getCompareString(gameInfo.currentPlayer.money, gameInfo.currentPlayer.money - catelog.money)}\n';
		final msg = '功能:${toCatelog.describe}';

		Dialogs.messageBox(msg, title, MessageBoxType.TYPE_QUESTION, true, (e) -> {
			if (e == DialogButton.YES) {
				fadeOut();
				Main.view.onBuildingPreviewConfirmClick(people.id, current, to);
			}
		});
	}

	var outData:Dynamic = [];

	override function showPopup(info:Dynamic, cb:() -> Void = null) {
		super.showPopup(info, cb);

		final gameInfo = Main.model.gameInfo();
		final player = gameInfo.currentPlayer;
		final grid:Grid = gameInfo.grids[player.atGridId];

		function setPreview() {
			final catelog = tab_buildingList.selectedItem;
			final people = plist.selectedItem;
			if (catelog == null)
				return;
			if (people == null)
				return;

            final current:BUILDING = catelog.type;
            final to = getNextLevelBuilding(current);

            final result:PreResultOnBuilding = Main.model.getPreResultOfBuilding(player.id, grid.id, people.id, current, to);
            playerView.setCompareInfo(result.playerBefore, result.playerAfter);
            gridView.setCompareInfo(result.gridBefore, result.gridAfter);
            btn_confirm.disabled = !(result.playerAfter.money > 0);
		}

		plist.setPeopleList(player.people);
		plist.onClick = function(e) {
			setPreview();
		}
		plist.selectedIndex = 0;

		playerView.setInfo(player);
		gridView.setInfo(grid);

		tab_buildingList.dataSource.clear();
		for (b in grid.attachs) {
			final catelog = Main.getBuildingCatelog(b);
			tab_buildingList.dataSource.add(catelog);
		}
		tab_buildingList.selectedIndex = 0;

		tab_buildingList.onChange = function(e) {
			setPreview();
		}
	}
}
