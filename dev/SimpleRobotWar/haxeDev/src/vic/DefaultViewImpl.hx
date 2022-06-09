package vic;

import common.DefaultView;

class DefaultViewImpl extends DefaultView {
	public function new() {
		super();
	}

	public function openLobbyPage():Void {
		trace("openLobbyPage");
		// 關閉所有其它頁, 打開大廳頁
		// 假設按了到去戰鬥
		getLobbyController().onAction(GOTO_BATTLE_ACTION);
	}

	public function openBattlePage():Void {
		trace("openBattlePage");
		// 關閉所有其它頁, 打開戰鬥頁
		trace(getBattleController());
	}
}
