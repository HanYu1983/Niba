package vic.pages;

import common.IDefine.ViewEvent;
import haxe.ui.events.MouseEvent;
import vic.widgets.Robot;
import common.IConfig;
import common.IDefine.GridView;
import common.view.ver1.DefaultView.SyncViewOperation;
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
	final gridMoveRange:Array<Grid> = [];
	final robots:Array<Robot> = [];
	final gridDetail = new GridDetail();
	final gridSize = 40;

	public function new() {
		super();

		final totalCount = MAP_W * MAP_H;
		for (i in 0...totalCount) {
			final g = new Grid();
			final px = i % MAP_W;
			final py = Math.floor(i / MAP_W);
			g.pos = Position.POS(px, py);
			g.left = px * gridSize;
			g.top = py * gridSize;
			box_grids.addComponent(g);

			grids.push(g);
		}
		box_left.addComponent(gridDetail);
	}

	function updateGrids() {
		final gridInfos = Main.view.getBattleController().getGrids();
		final robotInfos = Main.view.getBattleController().getRobots();
		verbose('GamePage', 'grid count ${Lambda.count(grids)}');
		verbose('GamePage', 'grid ${gridInfos}');
		verbose('GamePage', 'robots ${robots}');

		for (r in robots) {
			box_robots.removeComponent(r);
		}
		robots.empty();

		for (g in grids) {
			final gridInfo = gridInfos.get(g.pos);
			g.title = gridInfo.title;

			final robotInfo = robotInfos.get(gridInfo.robotId);
			if (robotInfo != null) {
				final r = new Robot();
				r.title = robotInfo.title;
				box_robots.addComponent(r);

				robots.push(r);
			}
		}
	}

	function updateGridDetail(info:Null<GridView>) {
		if (info != null) {
			verbose('GamePage', 'grid info ${info}');
			gridDetail.setInfo(info);
		}
	}

	function getPosEnumByLocalPos(x:Float, y:Float) {
		final px = Math.floor(x / gridSize);
		final py = Math.floor(y / gridSize);
		return Position.POS(px, py);
	}

	public function updateRobotMenu() {
		final robotMenu = Main.view.getBattleController().getRobotMenuItems();

		btn_move.hide();
		btn_attack.hide();
		btn_end.hide();

		for (m in robotMenu) {
			switch (m) {
				case MOVE:
					btn_move.show();
				case ATTACK:
					btn_attack.show();
				case DONE:
					btn_end.show();
			}
		}

		btn_move.onClick = function(e) {
			Main.view.getBattleController().onEvent(ON_CLICK_ROBOT_MENU_ITEM(MOVE));
		}

		btn_attack.onClick = function(e) {
			Main.view.getBattleController().onEvent(ON_CLICK_ROBOT_MENU_ITEM(ATTACK));
		}

		btn_end.onClick = function(e) {
			Main.view.getBattleController().onEvent(ON_CLICK_ROBOT_MENU_ITEM(DONE));
		}
	}

	var lastClickPos = [0.0, 0.0];

	function switchStageState() {
		box_stages.unregisterEvents();
		switch (Main.view.getRobotMenuState()) {
			case NORMAL:
				final gridInfos = Main.view.getBattleController().getGrids();
				box_stages.registerEvent(MouseEvent.MOUSE_MOVE, (e:MouseEvent) -> {
					final pos = getPosEnumByLocalPos(e.localX, e.localY);
					final gridInfo = gridInfos.get(pos);
					switch (pos) {
						case POS(x, y):
							box_cursor.left = x * gridSize;
							box_cursor.top = y * gridSize;
						case _:
					}
					updateGridDetail(gridInfo);
				});

				box_stages.registerEvent(MouseEvent.CLICK, (e:MouseEvent) -> {
					final pos = getPosEnumByLocalPos(e.localX, e.localY);
					lastClickPos[0] = e.localX;
					lastClickPos[1] = e.localY;
					verbose('GamePage', 'mouse click pos:(${e.localX})(${e.localY}) enum:(${pos})');

					Main.view.getBattleController().onEvent(ON_CLICK_BATTLE_POS(pos));
				});
			case ROBOT_MENU:
				box_stages.registerEvent(MouseEvent.CLICK, (e:MouseEvent) -> {
					Main.view.getBattleController().onEvent(ON_CLICK_CANCEL);
					switchStageState();
				});
			case ROBOT_SELECT_MOVE_POSITION:
				trace('ROBOT_SELECT_MOVE_POSITION');
		}
	}

	override function show() {
		super.show();

		updateGamePage();
		switchStageState();

		closeRobotMenu();
		closeSystemMenu();
	}

	public function openSystemMenu() {
		box_systemMenu.show();
		box_systemMenu.left = lastClickPos[0] + gridSize;
		box_systemMenu.top = lastClickPos[1];
		switchStageState();
	}

	public function closeSystemMenu() {
		box_systemMenu.hide();
	}

	public function updateSystemMenu() {}

	public function updateMoveRange() {
		closeMoveRange();

		final moveRangeInfos = Main.view.getBattleController().getRobotMoveRangeByPosition(Main.view.getActivePosition());
		for (pos in moveRangeInfos) {
			final g = new Grid();
			g.title = '';

			switch (pos) {
				case POS(x, y):
					g.left = x * gridSize;
					g.top = y * gridSize;
			}

			box_moveRanges.addComponent(g);
			gridMoveRange.push(g);
		}
	}

	public function closeMoveRange() {
		for (g in gridMoveRange) {
			box_moveRanges.removeComponent(g);
		}
		gridMoveRange.empty();
	}

	public function openMoveRange() {
		updateMoveRange();
	}

	public function openRobotMenu() {
		box_robotMenu.show();
		box_robotMenu.left = lastClickPos[0] + gridSize;
		box_robotMenu.top = lastClickPos[1];
		updateRobotMenu();
		switchStageState();
	}

	public function closeRobotMenu() {
		box_robotMenu.hide();
	}

	public function updateGamePage() {
		updateGrids();
	}
}
