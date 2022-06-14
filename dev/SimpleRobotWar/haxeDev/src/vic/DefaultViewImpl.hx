package vic;

import js.Syntax;
import haxe.ui.core.Component;
import vic.pages.PilotPage;
import vic.pages.RobotPage;
import common.IDefine;
import common.view.ver1.DefaultView;
import vic.pages.GamePage;
import vic.pages.LobbyPage;
import tool.Debug;

// 所有頁面都可以綁定esc到ON_CLICK_CANCEL
class DefaultViewImpl extends DefaultView {
	final _view:HaxeUIView;

	public function new() {
		super();
		_view = new HaxeUIView();
	}

	public function getComponent():Component {
		return _view;
	}

	public function getFixNumber(number:Float, count:Int = 0):Float {
		if (number == null)
			return 0.0;
		var round = Syntax.code('Number.prototype.toFixed');
		return round.call(number, count);
	}

	public function getRateString(rate:Float, count:Int = 0):String {
		return getFixNumber(rate * 100, count) + '%';
	}

	// 關閉所有其它頁, 打開大廳頁
	// 左側顯示按鈕列表
	//  機體檢視 ON_CLICK_GOTO_ROBOT_VIEW
	//  駕駛員檢視 ON_CLICK_GOTO_PILOT_VIEW
	//  戰鬥 ON_CLICK_GOTO_BATTLE("")
	function openLobbyPage():Void {
		// 只要是Page就統一關全部再打開指定Page
		_view.closeAllPages();
		_view.lobbyPage.fadeIn();
		// switch op {
		// 	case OPEN:
		// 		_view.closeAllPages();
		// 		_view.lobbyPage.fadeIn();
		// 	case CLOSE:
		// 	case UPDATE:
		// }
	}

	// 打開戰鬥頁
	// 左邊顯示地圖格子(MAP_W x MAP_H)
	// getBattleController().getGrids()
	// ex.
	// for(pos => grid in gridsFromController) {
	//   switch pos {
	//     case {x:x, y:y}:
	//	     syncGrid(x, y, grid);
	// 	 }
	// }
	// or
	// for(x in 0...MAP_W) {
	//   for(y in 0...MAP_H) {
	//     final grid = gridsFromController.get(POS(x,y));
	//     syncGrid(x,y,grid);
	//   }
	// }
	// 點擊格子 ON_CLICK_BATTLE_POS(Position)
	function openBattlePage():Void {
		// 只要是Page就統一關全部再打開指定Page
		_view.closeAllPages();
		_view.gamePage.fadeIn();
		// switch op {
		// 	case OPEN:
		// 		_view.closeAllPages();
		// 		_view.gamePage.fadeIn();
		// 	case CLOSE:
		// 		_view.gamePage.fadeOut();
		// 	case UPDATE:
		// 		_view.gamePage.updateGamePage();
		// }
	}

	// 打開機體檢視頁
	// 左邊顯示機體列表 getLobbyController().getRobots() 暫無資料
	// 右邊顯示選到的機體詳細資料
	// 詳細資料有
	//   機體基本資料
	//   駕駛
	//   武器列表
	// 右邊資料下方有動作按鈕
	// 動作按鈕為
	//   裝備與買賣 ON_CLICK_GOTO_ROBOT_BUY
	//   設定駕駛
	//   回上頁 ON_CLICK_ROBOT_VIEW_CANCEL
	function openRobotViewPage():Void {
		// 只要是Page就統一關全部再打開指定Page
		_view.closeAllPages();
		_view.robotPage.fadeIn();
		// switch op {
		// 	case OPEN:
		// 		_view.closeAllPages();
		// 		_view.robotPage.fadeIn();
		// 	case CLOSE:
		// 	case UPDATE:
		// }
	}

	// 打開機體檢視頁
	// 左邊顯示駕駛列表 getLobbyController().getPilots() 暫無資料
	// 右邊顯示選到的駕駛詳細資料
	// 詳細資料有
	//   駕駛基本資料
	//   還不知
	// 右邊資料下方有動作按鈕
	// 動作按鈕為
	//   設定機體
	function openPilotViewPage():Void {
		// 只要是Page就統一關全部再打開指定Page
		_view.closeAllPages();
		_view.pilotPage.fadeIn();
		// switch op {
		// 	case OPEN:
		// 		_view.closeAllPages();
		// 		_view.pilotPage.fadeIn();
		// 	case CLOSE:
		// 	case UPDATE:
		// }
	}

	// 打開機體菜單頁
	// 顯示菜單 Main.view.getRobotMenuView()
	// 動作
	//   點擊菜單選項 ON_CLICK_ROBOT_MENU_ITEM(item)
	// 菜單狀態 getRobotMenuState
	// 下方列出各個狀態的事件需求，但基本上任何狀態都能傳任何事件，我這裡會判斷狀態做處理
	// NORMAL
	//   ON_CLICK_BATTLE_POS
	// ROBOT_MENU
	//   ON_CLICK_ROBOT_MENU_ITEM
	//   ON_CLICK_CANCEL
	// ROBOT_SELECT_MOVE_POSITION
	//   ON_CLICK_BATTLE_POS
	//   ON_CLICK_CANCEL

	// 打開選武器攻擊頁 Main.view.getWeaponAttackListView()
	// 動作
	//   點擊選項 ON_CLICK_ROBOT_WEAPON_ATTACK(value:{attackId:String, robotId:String});
	function renderBattlePage(){
		trace("可實作打開選武器攻擊頁", getWeaponAttackListView());
		_view.gamePage.updateGamePage();
	}
}
