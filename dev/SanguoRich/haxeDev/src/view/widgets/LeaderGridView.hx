package view.widgets;

import model.IModel.PlayerInfo;
import haxe.ui.containers.properties.Property;
import haxe.ui.containers.properties.PropertyGroup;
import haxe.ui.containers.properties.PropertyGrid;

@:build(haxe.ui.ComponentBuilder.build("assets/widgets/leaderGrid-view.xml"))
class LeaderGridView extends BasicGridView{

    public function new() {
        super();
    }

    override function setInfo(info:Dynamic) {
        super.setInfo(info);

        var p:PlayerInfo = info;
        pro_name.value = p.name;
        pro_money.value = '${Math.floor(p.money)} (薪俸:${Main.getFixNumber(p.maintainPeople)})';
        pro_food.value = '${Math.floor(p.food)} (消耗:${Main.getFixNumber(p.maintainArmy)})';
        pro_army.value = '${Math.floor(p.army)} (消耗:${Main.getFixNumber(p.armyGrow)})';
        pro_peopleCount.value = p.people.length;
        pro_cityCount.value = p.grids.length;
        pro_treasureCount.value = p.treasures.length;
        pro_score.value = Math.floor(p.score);
        pro_strategy.value = Main.getStrategyString(p.strategys);
    }

    override function setCompareInfo(infoBefore:Dynamic, infoAfter:Dynamic) {
        super.setCompareInfo(infoBefore, infoAfter);

        var p:PlayerInfo = infoBefore;
        pro_name.value = p.name;
        pro_money.value = '${Main.getCompareString(infoBefore.money, infoAfter.money)}';
        pro_food.value = '${Main.getCompareString(infoBefore.food, infoAfter.food)}';
        pro_army.value = '${Main.getCompareString(infoBefore.army, infoAfter.army)}';
        pro_peopleCount.value = p.people.length;
        pro_cityCount.value = p.grids.length;
        pro_treasureCount.value = p.treasures.length;
        pro_score.value = Math.floor(p.score);
    }
}