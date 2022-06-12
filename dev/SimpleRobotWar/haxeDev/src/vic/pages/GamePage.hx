package vic.pages;

import common.IDefine.Position;
import vic.widgets.Grid;
import tool.Debug.verbose;
import haxe.ui.containers.Box;

using Lambda;

@:build(haxe.ui.ComponentBuilder.build('vic/pages/GamePage.xml'))
class GamePage extends Box {
	final grids:Array<Grid> = [];

	public function new() {
		super();

		box_grids;

		for (i in 0...400) {
			final g = new Grid();
			final px = i % 20;
			final py = Math.floor(i / 20);
			g.pos = Position.POS(px, py);
			g.left = px * 40;
			g.top = py * 40;
			box_grids.addComponent(g);

			grids.push(g);
		}
	}

	function updateGrids() {
		final gridInfos = Main.view.getBattleController().getGrids();
		verbose('GamePage', 'grid count ${Lambda.count(grids)}');
		verbose('GamePage', 'grid ${gridInfos}');

		for (g in grids) {
			final info = gridInfos.get(g.pos);
			g.title = info.title;
		}
	}

	override function show() {
		super.show();

		updateGrids();
	}
}
