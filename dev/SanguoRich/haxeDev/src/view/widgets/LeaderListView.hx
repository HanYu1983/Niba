package view.widgets;

import model.IModel.PlayerInfo;
import model.IModel.StrategyCatelog;
import model.PeopleGenerator;
import haxe.ui.containers.TableView;

@:build(haxe.ui.ComponentBuilder.build("assets/widgets/leaderList-view.xml"))
class LeaderListView extends TableView {
	public function new() {
		super();
	}

	public function setList(leaders:Array<PlayerInfo>) {
		updateList(leaders);
	}

	function updateList(leaders:Array<PlayerInfo>) {
		dataSource.clear();
		for (p in leaders) {
			final clone = Main.cloneObject(p);
			clone.name = p.name;
			clone.money = '${Math.floor(p.money)} (薪俸:${Main.getFixNumber(p.maintainPeople)})';
			clone.food = '${Math.floor(p.food)} (消耗:${Main.getFixNumber(p.maintainArmy)})';
			clone.army = '${Math.floor(p.army)} (消耗:${Main.getFixNumber(p.armyGrow)})';
			clone.peopleCount = p.people.length;
			clone.cityCount = p.grids.length;
			dataSource.add(clone);
		}
	}
}
