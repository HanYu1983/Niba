package view.widgets;

import model.GridGenerator.GROWTYPE;
import model.GridGenerator.Grid;
import model.IModel.StrategyCatelog;
import model.PeopleGenerator;
import haxe.ui.containers.TableView;

@:build(haxe.ui.ComponentBuilder.build("assets/widgets/gridList-view.xml"))
class GridListView extends TableView {
	public function new() {
		super();
	}

	public function setList(grids:Array<Grid>) {
		updateList(grids);
	}

	function updateList(grids:Array<Grid>) {

		final gameInfo = Main.model.gameInfo();
		final clones = [];
		dataSource.clear();
		for (grid in grids) {
			final clone:Dynamic = {};
			
			clone.id= grid.id;
			clone.name = grid.name;

			final gainMoney = Main.getFixNumber(grid.moneyGrow);
			final gainFood = Main.getFixNumber(grid.foodGrow);
			final gainArmy = Main.getFixNumber(grid.armyGrow);
			
			clone.money = '${Math.floor(grid.money)} (${gainMoney)})';
			clone.food = '${Math.floor(grid.food)} (${gainFood)})';
			clone.army = '${Math.floor(grid.army)} (${gainArmy})';
			clone.peopleCount = grid.people.length;
			
			clone.player = "無";
			if(grid.belongPlayerId != null){
				clone.player = gameInfo.players[grid.belongPlayerId].name;
			}

			clone.favor = "無";
			if(grid.buildtype != GROWTYPE.EMPTY){
				clone.favor = Main.getFavorString(grid.favor[gameInfo.currentPlayer.id]);
			}

			var building = "";
			for(b in grid.attachs){
				final catelog = Main.getBuildingCatelog(b);
				switch(catelog.type){
					case MARKET(level):
						building += '市${level}';
					case FARM(level):
						building += '農${level}';
					case BARRACKS(level):
						building += '兵${level}';
					case WALL(level):
						building += '牆${level}';
					case EXPLORE(level):
						building += '人${level}';
					case _:
				}
			}
			clone.building = building;

			var strategyString = '';
			for( index => strategys in grid.strategys){
				if(index < gameInfo.playerGrids.length){
					if( strategys.length > 0){
						strategyString += '${gameInfo.players[index].name.substr(0,1)}:';
						for( sid in strategys){
							final s = Main.getStrategyCatelog(sid);
							strategyString += '${s.name.substr(0,1)} ';
						}
					}
				}
			}
			clone.strategy = strategyString;
			clone.treasureCount = grid.treasures.length;
			clones.push(clone);
		}
		dataSource.data = clones;
	}
}
