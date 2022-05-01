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
        super.setInfo(info);

        final gameInfo = Main.model.gameInfo();

        var grid:Grid = Main.cloneObject(info);
        pro_name.value = grid.name;
        // pro_landType.value = grid.landType;

        final gainMoney = Main.getFixNumber(grid.moneyGrow);
        final gainFood = Main.getFixNumber(grid.foodGrow);
        final gainArmy = Main.getFixNumber(grid.armyGrow);
        
        pro_money.value = '${Math.floor(grid.money)} (成長:${gainMoney)})';
        pro_food.value = '${Math.floor(grid.food)} (成長:${gainFood)})';
        pro_army.value = '${Math.floor(grid.army)} (成長:${gainArmy})';
        pro_peopleCount.value = grid.people.length;
        
        pro_player.value = "無";
        if(grid.belongPlayerId != null){
            pro_player.value = gameInfo.players[grid.belongPlayerId].name;
        }

        pro_favor.value = "無";
        if(grid.buildtype != GROWTYPE.EMPTY){
            pro_favor.value = Main.getFavorString(grid.favor[gameInfo.currentPlayer.id]);
        }
    }
}