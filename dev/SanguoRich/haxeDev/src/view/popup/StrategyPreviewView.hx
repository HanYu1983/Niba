package view.popup;

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

@:build(haxe.ui.ComponentBuilder.build("assets/popup/strategyPreview-view.xml"))
class StrategyPreviewView extends PopupView {
	var p1List:PeopleListView;
	var p2List:PeopleListView;
	var strategyList:StrategyListView;

	var leaderList:LeaderListView;
	var gridList:GridListView;

	public function new() {
		super();

		p1List = new PeopleListView();
		box_peopleList.addComponent(p1List);

		p2List = new PeopleListView();
		box_peopleList2.addComponent(p2List);

		leaderList = new LeaderListView();
		box_leaderList.addComponent(leaderList);

		gridList = new GridListView();
		box_gridList.addComponent(gridList);

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

		if(leaderList.selectedItem == null) return;
		if(p2List.selectedItem == null) return;
		if(gridList.selectedItem == null) return;

		var targetPlayer = leaderList.selectedItem.id;
		var targetPeople = p2List.selectedItem.id;
		var targetGrid = gridList.selectedItem.id;
		trace(targetPlayer, targetPeople, targetGrid);
		Main.view.onStrategyPreviewConfirmClick(p1List.selectedItem.id, strategyList.selectedItem.id, targetPlayer, targetPeople, targetGrid);
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
			if (gridList.selectedItem == null)
				return;

			var p1 = p1List.selectedItem;
			var s = strategyList.selectedItem;

			var targetPlayer = leaderList.selectedItem.id;
			var targetPeople = p2List.selectedItem.id;
			var targetGrid = gridList.selectedItem.id;
			var result:{energyBefore:Int, energyAfter:Int, rate:Float} = Main.model.getStrategyRate(p1, s, targetPlayer, targetPeople, targetGrid);

			pro_energy.value = '${result.energyBefore} => ${result.energyAfter}';
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
			gridList.setList(grids);
			gridList.selectedIndex = 0;
		}

		strategyList.onChange = function(e) {
			var s:StrategyCatelog = strategyList.selectedItem;
			if (s != null) {
				lbl_usingStrategy.value = s.name;

				box_leaderList.hide();
				box_peopleList2.hide();
				box_gridList.hide();
				switch (s.targetType) {
					case TARGET_GRID:
						box_gridList.show();

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
						box_gridList.show();
						
						final grid = gameInfo.grids[gameInfo.currentPlayer.atGridId];
						updateGridList([grid]);
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

		gridList.onChange = function(e){
			setRate();
		}

		updatePlayerList();
		updatePeopleList(gameInfo.currentPlayer.people);
		updateGridList(gameInfo.grids);

		strategyList.selectedIndex = 0;
	}
}
