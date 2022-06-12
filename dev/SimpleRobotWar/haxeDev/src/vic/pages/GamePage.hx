package vic.pages;

import common.IDefine.GridView;
import vic.widgets.GridDetail;
import VectorMath.floor;
import common.IDefine.Position;
import vic.widgets.Grid;
import tool.Debug.verbose;
import haxe.ui.containers.Box;

using Lambda;

@:build(haxe.ui.ComponentBuilder.build('vic/pages/GamePage.xml'))
class GamePage extends Box {
	final grids:Array<Grid> = [];
	final gridDetail = new GridDetail();

	public function new() {
		super();

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
		box_left.addComponent(gridDetail);
	}

	function updateGrids() {
		final gridInfos = Main.view.getBattleController().getGrids();
		final robots = Main.view.getBattleController().getRobots();
		verbose('GamePage', 'grid count ${Lambda.count(grids)}');
		verbose('GamePage', 'grid ${gridInfos}');
		verbose('GamePage', 'robots ${robots}');

		for (g in grids) {
			final info = gridInfos.get(g.pos);
			g.title = info.title;
		}
	}

	function updateGridDetail(info:Null<GridView>) {
		if (info != null) {
			verbose('GamePage', 'grid info ${info}');
			gridDetail.setInfo(info);
		}
	}

	function getPosEnumByLocalPos(x:Float, y:Float) {
		final px = Math.floor(x / 40.0);
		final py = Math.floor(y / 40.0);
		return Position.POS(px, py);
	}

	override function show() {
		super.show();

		updateGrids();

		final gridInfos = Main.view.getBattleController().getGrids();
		box_grids.onMouseOver = function(e) {
			final pos = getPosEnumByLocalPos(e.localX, e.localY);
			final gridInfo = gridInfos.get(pos);
			updateGridDetail(gridInfo);
		}

		box_grids.onClick = function(e) {
			final pos = getPosEnumByLocalPos(e.localX, e.localY);
			verbose('GamePage', 'mouse click pos:(${e.localX})(${e.localY}) enum:(${pos})');

			Main.view.getBattleController().onEvent(ON_CLICK_BATTLE_POS(pos));
		}
	}
}
