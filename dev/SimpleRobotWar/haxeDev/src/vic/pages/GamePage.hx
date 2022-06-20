package vic.pages;

import haxe.ds.StringMap;
import tweenx909.TweenX;
import js.html.KeyEvent;
import js.Browser;
import js.html.Document;
import common.IDefine.WeaponAttackView;
import vic.widgets.WeaponListWidget;
import vic.widgets.BattleWeaponListWidget;
import haxe.ds.EnumValueMap;
import haxe.ui.events.KeyboardEvent;
import tool.Debug.info;
import haxe.Exception;
import common.IDefine.ViewEvent;
import haxe.ui.events.MouseEvent;
import vic.widgets.Robot;
import common.IConfig;
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
	final grids = new EnumValueMap<Position, Grid>();
	final robots = new StringMap<Robot>();
	final gridDetail = new GridDetail();
	final gridSize = 40;

	final battleWeaponListWidget = new BattleWeaponListWidget();
	final robotStatusPage = new RobotStatePage();

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

			grids.set(g.pos, g);
		}
		box_left.addComponent(gridDetail);

		box_selectWeaponMenu.hide();
		box_weaponList.addComponent(battleWeaponListWidget);

		box_robotStatePage.hide();
		box_robotStatePage.addComponent(robotStatusPage);
	}

	function updateGrids() {
		final gridInfos = Main.getBattleController().getGrids();
		final robotInfos = Main.getBattleController().getRobots();

		for (key in robots.keys()) {
			box_robots.removeComponent(robots.get(key));
		}
		robots.clear();

		for (g in grids) {
			final gridInfo = gridInfos.get(g.pos);
			g.title = gridInfo.title;

			final robotInfo = robotInfos.get(gridInfo.robotId);
			if (robotInfo != null) {
				final r = new Robot();
				r.title = robotInfo.title;
				r.left = g.left;
				r.top = g.top;
				r.isDone = robotInfo.isDone;
				box_robots.addComponent(r);

				robots.set(robotInfo.id, r);
			}
		}
	}

	function updateGridDetail(info:Null<GridView>) {
		if (info != null) {
			verbose('GamePage', 'grid info ${info}');
			gridDetail.showWithData(info);
		}
	}

	function getPosEnumByLocalPos(x:Float, y:Float) {
		final px = Math.floor(x / gridSize);
		final py = Math.floor(y / gridSize);
		return Position.POS(px, py);
	}

	public function updateSystemMenu() {
		final systemMenuView = Main.getBattleController().getSystemMenuView();
		if (systemMenuView == null) {
			box_systemMenu.hide();
			return;
		}
		box_systemMenu.show();
		box_systemMenu.left = lastClickPos[0];
		box_systemMenu.top = lastClickPos[1];
	}

	public function updateRobotMenu() {
		final robotMenuView = Main.getBattleController().getRobotMenuView();
		if (robotMenuView == null) {
			box_robotMenu.hide();
			// 關閉頁面
			return;
		}

		box_robotMenu.show();
		box_robotMenu.left = lastClickPos[0];
		box_robotMenu.top = lastClickPos[1];

		// 打開並同步
		final robotMenu = robotMenuView.menuItems;

		btn_move.hide();
		btn_attack.hide();
		btn_end.hide();
		btn_state.hide();

		for (m in robotMenu) {
			switch (m) {
				case MOVE:
					btn_move.show();
				case ATTACK:
					btn_attack.show();
				case STATUS:
					btn_state.show();
				case DONE:
					btn_end.show();
			}
		}
	}

	var lastClickPos = [0.0, 0.0];

	function updateStageListener() {
		box_listener.unregisterEvents();
		box_cursor.hide();

		function cursorListener() {
			box_cursor.show();
			final gridInfos = Main.getBattleController().getGrids();
			box_listener.registerEvent(MouseEvent.MOUSE_MOVE, (e:MouseEvent) -> {
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
		}

		function battlePosClickListener() {
			box_listener.registerEvent(MouseEvent.CLICK, (e:MouseEvent) -> {
				lastClickPos[0] = e.localX;
				lastClickPos[1] = e.localY;
				final pos = getPosEnumByLocalPos(e.localX, e.localY);
				verbose('GamePage', 'mouse click pos:(${e.localX})(${e.localY}) enum:(${pos})');

				Main.getBattleController().onEvent(ON_CLICK_BATTLE_POS(pos));
			});
		}

		switch (Main.getBattleController().getRobotMenuState()) {
			case NORMAL:
				cursorListener();
				battlePosClickListener();
			case ROBOT_MENU | SYSTEM_MENU:
				box_listener.registerEvent(MouseEvent.CLICK, (e:MouseEvent) -> {
					Main.getBattleController().onEvent(ON_CLICK_CANCEL);
				});
			case ROBOT_SELECT_MOVE_POSITION:
				cursorListener();
				battlePosClickListener();
			case ROBOT_SELECT_WEAPON_ATTACK:
				// cursorListener();
				// battlePosClickListener();
			case ROBOT_SELECT_WEAPON_ATTACK_TARGET(shape):
				cursorListener();
				battlePosClickListener();
			case ROBOT_BATTLE_PREVIEW:
				// 戰鬥預視
				// Main.getBattleController().getRobotBattlePreviewView();
		}
	}

	function onKeydownEvent(e:js.html.KeyboardEvent) {
		switch (e.keyCode) {
			case KeyEvent.DOM_VK_ESCAPE:
				Main.getBattleController().onEvent(ON_CLICK_CANCEL);
			case _:
		}
	}

	override function show() {
		super.show();
		updateGamePage();

		Browser.document.removeEventListener('keydown', onKeydownEvent);
		Browser.document.addEventListener('keydown', onKeydownEvent);

		// 只要注冊一次就好
		btn_move.onClick = function(e) {
			Main.getBattleController().onEvent(ON_CLICK_ROBOT_MENU_ITEM(MOVE));
		}

		btn_attack.onClick = function(e) {
			Main.getBattleController().onEvent(ON_CLICK_ROBOT_MENU_ITEM(ATTACK));
		}

		btn_state.onClick = function(e) {
			Main.getBattleController().onEvent(ON_CLICK_ROBOT_MENU_ITEM(STATUS));
		}

		btn_end.onClick = function(e) {
			Main.getBattleController().onEvent(ON_CLICK_ROBOT_MENU_ITEM(DONE));
		}

		btn_endPhase.onClick = function(e) {
			Main.getBattleController().onEvent(ON_CLICK_SYSTEM_MENU_ITEM(TURN_END));
		}

		btn_confirmSelectWeaponMenu.onClick = function(e) {
			final weapon:WeaponAttackView = battleWeaponListWidget.selectedItem;
			Main.getBattleController().onEvent(ON_CLICK_ROBOT_WEAPON_ATTACK_CONFIRM({attackId: weapon.id, robotId: weapon.robotId}));
		}

		btn_cancelSelectWeaponMenu.onClick = function(e) {
			Main.getBattleController().onEvent(ON_CLICK_CANCEL);
		}
	}

	public function updateMoveRange() {
		final moveRangeView = Main.getBattleController().getMoveRangeView();
		if (moveRangeView == null) {
			// 這個的關閉在updateGrids時會關閉
			return;
		}

		for (pos in moveRangeView.pos) {
			final g = grids.get(pos);
			g.showMoveRange();
		}
	}

	function updateAttackList() {
		final weaponList = Main.getBattleController().getWeaponAttackListView();
		if (weaponList == null) {
			box_selectWeaponMenu.hide();
			return;
		}

		box_selectWeaponMenu.show();
		battleWeaponListWidget.setInfo(weaponList.weaponAttacks);
		battleWeaponListWidget.onChange = function(e) {
			final weapon:WeaponAttackView = battleWeaponListWidget.selectedItem;
			Main.getBattleController().onEvent(ON_CLICK_ROBOT_WEAPON_ATTACK({attackId: weapon.id, robotId: weapon.robotId}));
		}

		// 如果加了這行，
		// 在介面被打開始就會自動呼叫onChange而發出ON_CLICK_ROBOT_WEAPON_ATTACK事件，
		// 這樣導致了render的無限迴圈，這裡要討論一下要怎麼弄
		// 先不自動選
		// battleWeaponListWidget.selectedIndex = 0;
	}

	function updateAttackRange() {
		final rangeView = Main.getBattleController().getAttackRangeView();
		if (rangeView == null) {
			// 這個的關閉在updateGrids時會關閉
			return;
		}

		for (pos in rangeView.pos) {
			final g = grids.get(pos);
			g.showAttackRange();
		}
	}

	public function updateGamePage() {
		updateGrids();
		updateMoveRange();
		updateAttackRange();
		updateRobotMenu();
		updateRobotState();
		updateAttackList();
		updateSystemMenu();
		updateStageListener();

		info('GamePage', 'updateGamePage');
	}

	function updateRobotState() {
		final robotState = Main.getBattleController().getRobotStatusView();
		if (robotState == null) {
			box_robotStatePage.hide();
			return;
		}

		box_robotStatePage.show();
		robotStatusPage.fadeInWithData(robotState);
	}

	public function animateRobotMove(robotId:String, path:Array<Position>, cb:() -> Void) {
		final robot = robots.get(robotId);
		if (robot == null) {
			cb();
			return;
		}

		final ts:Array<Dynamic> = [];
		for (pos in path) {
			switch (pos) {
				case POS(x, y):
					ts.push(TweenX.to(robot, {left: x * gridSize, top: y * gridSize}, 0.05));
			}
		}
		TweenX.serial(ts).onFinish(cb);
	}
}
