package vic;

import vic.pages.PilotPage;
import vic.pages.RobotPage;
import common.IDefine;
import han.view.ver1.DefaultView;
import vic.pages.GamePage;
import vic.pages.LobbyPage;

class DefaultViewImpl extends DefaultView {
	public function new() {
		super();
	}

	public override function getLobbyController():ILobbyController {
		return super.getLobbyController();
	}

	public override function getBattleController():IBattleController {
		return super.getBattleController();
	}

	// 關閉所有其它頁, 打開大廳頁
	// 左側顯示按鈕列表
	//  機體檢視 ON_CLICK_GOTO_ROBOT_VIEW
	//  駕駛員檢視 ON_CLICK_GOTO_PILOT_VIEW
	//  戰鬥 ON_CLICK_GOTO_BATTLE("")
	public function openLobbyPage(op:SyncViewOperation):Void {
		switch op {
			case OPEN:
				Main.view.closeAllPages();
				Main.view.lobbyPage.fadeIn();
			case CLOSE:
			case UPDATE:
		}
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
	public function openBattlePage(op:SyncViewOperation):Void {
		switch op {
			case OPEN:
				Main.view.closeAllPages();
				Main.view.gamePage.fadeIn();
				trace("顯示格子");
				trace("綁定格字點擊事件到ON_CLICK_BATTLE_POS(Position)");
			case CLOSE:
			case UPDATE:
		}
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
	public function openRobotViewPage(op:SyncViewOperation):Void {
		switch op {
			case OPEN:
				Main.view.closeAllPages();
				Main.view.robotPage.fadeIn();
			case CLOSE:
			case UPDATE:
		}
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
	public function openPilotViewPage(op:SyncViewOperation):Void {
		switch op {
			case OPEN:
				Main.view.closeAllPages();
				Main.view.pilotPage.fadeIn();
			case CLOSE:
			case UPDATE:
		}
	}

	// 打開機體菜單頁
	// 顯示菜單 getBattleController().getUnitMenuItems()
	// 菜單格式尚不確定, 不知道是不是也要像1代那樣每個選項還能左右的子選項
	public function openUnitMenu(op:SyncViewOperation):Void {
		trace("顯示菜單 getBattleController().getUnitMenuItems()");
		switch op {
			case OPEN:
			// 打開頁面
			case CLOSE:
			// 關閉頁面
			case UPDATE:
				// 更新頁面
		}
	}

	public function renderMoveRange(op:SyncViewOperation):Void{
		switch op {
			case OPEN:
			case CLOSE:
			case UPDATE:
		}
	}
}
