package view.widgets;

import model.PeopleGenerator.People;
import model.IModel.PlayerInfo;
import haxe.ui.containers.properties.Property;
import haxe.ui.containers.properties.PropertyGroup;
import haxe.ui.containers.properties.PropertyGrid;

@:build(haxe.ui.ComponentBuilder.build("assets/widgets/gridPeople-view.xml"))
class PeopleGridView extends BasicGridView{

    public function new() {
        super();

    }

    override function setInfo(info:Dynamic) {
        super.setInfo(info);

        var p:People = info;
        pro_name.value = p.name;
        pro_force.value = p.force;
        pro_intelligence.value = p.intelligence;
    }
}