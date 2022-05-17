package view.widgets;

import model.TreasureGenerator.TreasureInfo;
import model.PeopleGenerator;
import haxe.ui.containers.TableView;

using Lambda;

@:build(haxe.ui.ComponentBuilder.build("assets/widgets/peopleList-view.xml"))
class PeopleListView extends TableView {
	public function new() {
		super();
	}

	public function setPeopleList(people:Array<People>) {
		updateList(people);

		onChange = function(e) {
			if (selectedItem != null && selectedItem.chk_sel != null) {
				selectedItem.chk_sel = !selectedItem.chk_sel;
			}

			var list:Array<Dynamic> = dataSource.data;
			updateList(list.slice(0));
		}
	}

	function updateList(people:Array<Dynamic>) {
		final gameInfo = Main.model.gameInfo();

		final clones = [];
		dataSource.clear();
		for (p in people) {
			var info:Dynamic = Main.cloneObject(p);

			for (i in 0...3) {
				var abi = "";
				if (i < p.abilities.length) {
					abi = PeopleGenerator.getInst().getAbilityName(p.abilities[i]);
				}
				Reflect.setField(info, 'ability${i + 1}', abi);
			}

			info.gridIdView = p.gridId == null ? "" : gameInfo.grids[p.gridId].name;
			info.typeView = PeopleGenerator.getInst().getPeopleTypeName(p.type);
			info.expView = Main.getFixNumber(p.exp, 0);
			info.nameView = p.name;
			// info.treasureCount = p.treasures.length;

			info.treasureCount = '無';
			if (p.treasures.length > 0) {
				final ts:Array<TreasureInfo> = p.treasures;
				info.treasureCount = ts.fold((cur, total) -> return total += '${cur.catelog.name.substr(0, 2)},', '');
			}

			if (p.sleep)
				info.nameView += '(休)';

			clones.push(info);
		}
		dataSource.data = clones;
	}
}
