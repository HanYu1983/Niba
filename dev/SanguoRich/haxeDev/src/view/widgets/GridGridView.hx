package view.widgets;

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
        super.setInfo(info);

        final gameInfo = Main.model.gameInfo();

        var grid:Grid = info;
        pro_name.value = grid.id;
        // pro_landType.value = grid.landType;
        
        pro_money.value = '${Math.floor(grid.money)} (成:${Main.getRateString(grid.moneyGrow)})';
        pro_food.value = '${Math.floor(grid.food)} (成:${Main.getRateString(grid.foodGrow)})';
        pro_army.value = '${Math.floor(grid.army)} (成:${Main.getRateString(grid.armyGrow)})';
        pro_peopleCount.value = grid.people.length;
        
        if(grid.belongPlayerId != null){
            pro_player.value = gameInfo.players[grid.belongPlayerId].name;
        }else{
            pro_player.value = "無";
        }
        if(grid.buildtype != BUILDING.EMPTY){
            pro_favor.value = Main.getFavorString(grid.favor[gameInfo.currentPlayer.id]);
        }else{
            pro_favor.value = "無";
        }
    }
}