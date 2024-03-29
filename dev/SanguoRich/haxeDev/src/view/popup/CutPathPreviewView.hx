package view.popup;

import model.IModel.PreResultOfStrategy;
import view.widgets.GridGridView;
import view.widgets.LeaderGridView;
import haxe.ui.containers.dialogs.Dialogs;
import haxe.ui.containers.dialogs.MessageBox;
import view.widgets.GridListView;
import view.widgets.LeaderListView;
import view.widgets.StrategyListView;
import view.widgets.PeopleListView;
import haxe.ui.events.UIEvent;
import model.GridGenerator.Grid;
import model.IModel.StrategyCatelog;
import model.IModel.StrategyList;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/cutPathPreview-view.xml"))
class CutPathPreviewView extends PopupView {
	var p1List:PeopleListView;
	var gridView:GridGridView;
	var leaderView:LeaderGridView;

	public function new() {
		super();

		p1List = new PeopleListView();
		box_peopleList.addComponent(p1List);

		p2List = new PeopleListView();
		box_peopleList2.addComponent(p2List);

		leaderList = new LeaderListView();
		box_leaderList.addComponent(leaderList);

		// gridList = new GridListView();
		// box_gridList.addComponent(gridList);

		strategyList = new StrategyListView();
		strategyList.setList(StrategyList);

		box_strategyList.addComponent(strategyList);
	}

	var showGrids:Array<Grid>;
	var selectGridId:Int = -1;

	@:bind(btn_selectGrid, MouseEvent.CLICK)
	function onBtnSelectGridClick(e){
		fadeOut();
		Main.view.onStrategyPreviewSelectGridClick(showGrids, (gridId:Int)->{
			fadeIn();

			final gameInfo = Main.model.gameInfo();
			selectGridId = gridId;
			btn_selectGrid.text = gameInfo.grids[gridId].name;
		});
	}

	@:bind(btn_cancel, MouseEvent.CLICK)
	function onBtnCancelClick(e:MouseEvent) {
		fadeOut();
		Main.view.switchStageToNormal();
	}

	@:bind(btn_confirm, MouseEvent.CLICK)
	function onBtnConfirmClick(e:MouseEvent) {
		fadeOut();

		if(leaderList.selectedItem == null) return;
		if(p2List.selectedItem == null) return;
		if(selectGridId == -1) return;
		// if(gridList.selectedItem == null) return;

		final gameInfo = Main.model.gameInfo();
		var targetPlayer = leaderList.selectedItem.id;
		var targetPeople = p2List.selectedItem.id;
		// var targetGrid = gridList.selectedItem.id;
		var strategy = strategyList.selectedItem.id;
		
		switch(strategy.id){
			// 遠交近攻
			case 2:
				final grid = gameInfo.grids[selectGridId];
				if(grid.belongPlayerId != null){
					Dialogs.messageBox('這個計策只能用在中立格子哦', '', MessageBoxType.TYPE_INFO);
					return;
				}
		}
		Main.view.switchStageToNormal();
		Main.view.onStrategyPreviewConfirmClick(p1List.selectedItem.id, strategyList.selectedItem.id, targetPlayer, targetPeople, selectGridId);
	}

	override function showPopup(info:Dynamic, cb:()->Void = null) {
		super.showPopup(info, cb);

		final gameInfo = Main.model.gameInfo();
		function setRate() {
			if (p1List.selectedItem == null)
				return ;
			if (strategyList.selectedItem == null)
				return;
			if (leaderList.selectedItem == null)
				return;
			if (p2List.selectedItem == null)
				return;
			// if (gridList.selectedItem == null)
			// 	return;

			var p1 = p1List.selectedItem;
			var s = strategyList.selectedItem;

			var targetPlayer = leaderList.selectedItem.id;
			var targetPeople = p2List.selectedItem.id;
			// var targetGrid = gridList.selectedItem.id;
			var result:PreResultOfStrategy = Main.model.getStrategyRate(p1, s, targetPlayer, targetPeople, 0);

			pro_energy.value = '${Main.getCompareString(result.energyBefore, result.energyAfter)}';
			lbl_rate.value = Main.getRateString(result.rate);
		}

		function setOnePeople(p:People) {
			pro_name.value = p.name;

			pro_intelligence.value = p.intelligence;
			pro_ability.value = Main.getAbilityString(p, [3]);

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

		function updateGridList(grids:Array<Grid>) {
			btn_selectGrid.text = '選擇格子';
			showGrids = grids;
			// gridList.setList(grids);
			// gridList.selectedIndex = 0;
		}

		strategyList.onChange = function(e) {
			var s:StrategyCatelog = strategyList.selectedItem;
			if (s != null) {
				lbl_usingStrategy.value = s.name;

				box_leaderList.hide();
				box_peopleList2.hide();
				btn_selectGrid.hide();
				// box_gridList.hide();
				switch (s.targetType) {
					case TARGET_GRID:
						// box_gridList.show();
						btn_selectGrid.show();
						btn_selectGrid.disabled = false;

						final currentId = gameInfo.currentPlayer.atGridId;
						function remapId(i){
							final remapId = i + currentId;
							if(remapId > gameInfo.grids.length - 1){
								return remapId - gameInfo.grids.length;
							}else if( remapId < 0 ){
								return gameInfo.grids.length + remapId;
							}else{
								return remapId;
							}
						}
						if(s.value != null){
							final rangeSetting:Array<Int> = s.value.valid;
							final canGo = rangeSetting.map(remapId).map((i)->gameInfo.grids[i]);

							updateGridList(canGo);
						}else{
							updateGridList(gameInfo.grids);
						}
						
					case TARGET_PLAYER:
						box_leaderList.show();
					case TARGET_PEOPLE:
						box_leaderList.show();
						box_peopleList2.show();
					case SELF_GRID:
						// box_gridList.show();
						btn_selectGrid.show();
						btn_selectGrid.disabled = true;
						
						final grid = gameInfo.grids[gameInfo.currentPlayer.atGridId];
						btn_selectGrid.text = grid.name;

						// updateGridList([grid]);
					case SELF_PEOPLE:
						leaderList.selectedIndex = gameInfo.currentPlayer.id;
						box_peopleList2.show();
					case SELF_PLAYER:
				}
				setRate();
			}
		}
		

		function updatePlayerList() {
			leaderList.setList(gameInfo.players);
			leaderList.selectedIndex = 0;
		}

		function updatePeopleList(list:Array<People>) {
			p2List.setPeopleList(list);
			p2List.selectedIndex = 0;
		}

		leaderList.onChange = function(e) {
			updatePeopleList(gameInfo.players[leaderList.selectedItem.id].people);
			setRate();
		}
		
		p2List.onChange = function(e){
			setRate();
		}

		// gridList.onChange = function(e){
		// 	setRate();
		// }

		updatePlayerList();
		updatePeopleList(gameInfo.currentPlayer.people);
		updateGridList(gameInfo.grids);

		strategyList.selectedIndex = 0;
	}
}
