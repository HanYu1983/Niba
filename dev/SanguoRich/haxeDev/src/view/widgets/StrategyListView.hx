package view.widgets;

import model.IModel.StrategyCatelog;
import model.PeopleGenerator;
import haxe.ui.containers.TableView;

@:build(haxe.ui.ComponentBuilder.build("assets/widgets/strategyList-view.xml"))
class StrategyListView extends TableView {
	public function new() {
		super();
	}

	public function setList(strategys:Array<StrategyCatelog>) {
		updateList(strategys);
	}

	function updateList(strategys:Array<StrategyCatelog>) {
		dataSource.clear();

		final clones = [];
		for (strategy in strategys) {
			final clone = Main.cloneObject(strategy);
			Reflect.setField(clone, 'target', switch (strategy.targetType) {
				case TARGET_GRID: '指定格子';
				case TARGET_PLAYER: '指定玩家';
				case TARGET_PEOPLE: '指定武將';
				case SELF_GRID: '玩家自己';
				case SELF_PEOPLE: '玩家自己的武將';
				case SELF_PLAYER: '玩家所在的格子';
			});
			clones.push(clone);
		}
		dataSource.data = clones;
	}
}
