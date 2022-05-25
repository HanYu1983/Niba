package view.widgets;

import model.GridGenerator.GROWTYPE;
import model.GridGenerator.BUILDING;
import model.GridGenerator.Grid;
import model.IModel.PlayerInfo;
import haxe.ui.containers.properties.Property;
import haxe.ui.containers.properties.PropertyGroup;
import haxe.ui.containers.properties.PropertyGrid;

@:build(haxe.ui.ComponentBuilder.build("assets/widgets/gridGrid-view.xml"))
class GridGridView extends BasicGridView{

    public function new() {
        super();
    }

    override function setInfo(info:Dynamic) {
        if(info == null) return;

        super.setInfo(info);

        final gameInfo = Main.model.gameInfo();

        var grid:Grid = Main.cloneObject(info);
        pro_name.value = grid.name;

        final gainMoney = Main.getFixNumber(grid.moneyGrow);
        final gainFood = Main.getFixNumber(grid.foodGrow);
        final gainArmy = Main.getFixNumber(grid.armyGrow);
        
        pro_money.value = '${Math.floor(grid.money)}/${grid.maxMoney} (${gainMoney})';
        pro_food.value = '${Math.floor(grid.food)}/${grid.maxFood} (${gainFood})';
        pro_army.value = '${Math.floor(grid.army)}/${grid.maxArmy} (${gainArmy})';
        pro_peopleCount.value = grid.people.length;
        
        pro_player.value = "無";
        if(grid.belongPlayerId != null){
            pro_player.value = gameInfo.players[grid.belongPlayerId].name;
        }

        pro_favor.value = "無";
        if(grid.buildtype != GROWTYPE.EMPTY){
            pro_favor.value = Main.getFavorString(grid.favor[gameInfo.currentPlayer.id]);
        }

        var building = "";
        for(b in grid.attachs){
            final catelog = Main.getBuildingCatelog(b);
            switch(catelog.type){
                case ACADEMY(level):
                    if( level > 0 ) building += '學${level}';
                case SIEGEFACTORY(level):
                    if( level > 0 ) building += '攻${level}';
                case MARKET(level):
                    if( level > 0 ) building += '市${level}';
                case FARM(level):
                    if( level > 0 ) building += '農${level}';
                case BARRACKS(level):
                    if( level > 0 ) building += '兵${level}';
                case HOME(level):
                    if( level > 0 ) building += '房${level}';
                case WALL(level):
                    if( level > 0 ) building += '牆${level}';
                case EXPLORE(level):
                    if( level > 0 ) building += '人${level}';
                case BANK(level):
                    if( level > 0 ) building += '庫${level}';
                case BARN(level):
                    if( level > 0 ) building += '倉${level}';
            }
        }
        pro_building.value = building;

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
        pro_strategy.value = strategyString;

        pro_treasureCount.value = grid.treasures.length;
    }
}