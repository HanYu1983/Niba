package view.widgets;

import model.IModel.PlayerInfo;
import haxe.ui.containers.properties.Property;
import haxe.ui.containers.properties.PropertyGroup;
import haxe.ui.containers.properties.PropertyGrid;

@:build(haxe.ui.ComponentBuilder.build("assets/widgets/gridLeader-view.xml"))
class LeaderGridView extends BasicGridView{

    public function new() {
        super();

        // addComponent(leaderGroup);
        // var map = [
        //     "武將",
        //     "體力",
        //     "武力",
        //     "統率",
        //     "智力",
        //     "政治",
        //     "魅力",
        //     "金錢",
        //     "糧草",
        //     "士兵",
        //     "計略",
        // ];
        // for(key in map){
        //     var pro = new Property();
        //     pro.label = key;
        //     pro.value = "abc";
        //     leaderGroup.addComponent(pro);
        // }
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
    }
}