package common;

import haxe.ds.StringMap;

enum ViewEvent {
	// 當點擊回大廳按鈕
	ON_CLICK_GOTO_LOBBY;
	// 當點擊去戰鬥按鈕
	ON_CLICK_GOTO_BATTLE(options:Dynamic);
	// 當點擊去機體檢視按鈕
	ON_CLICK_GOTO_ROBOT_VIEW;
	// 當點擊去駕駛檢視按鈕
	ON_CLICK_GOTO_PILOT_VIEW;
	// 當點擊去機體改裝按鈕
	ON_CLICK_GOTO_ROBOT_BUY(v:{robotId:String});
	// 當點擊去確定購買按鈕
	ON_CLICK_ROBOT_BUY_WEAPON(v:{robotId:String, weaponId:String});
	// 當點擊機體檢視頁的取消按鈕
	ON_CLICK_ROBOT_VIEW_CANCEL;
}

typedef RobotView = {
	id:String,
	title:String,
	pilotId:Null<String>,
	weaponIds:Array<String>,
}

typedef PilotView = {
	id:String,
	title:String,
	robotId:Null<String>
}

typedef WeaponView = {
	id:String,
	title:String,
	robotId:Null<String>
}

typedef GridView = {}
interface ILobbyInfo {}

interface IBaseController {
	function getRobots():Map<String, RobotView>;
	function getPilots():Map<String, PilotView>;
	function getWeapons():Map<String, WeaponView>;
	function onEvent(action:ViewEvent):Void;
}

interface IBattleController extends IBaseController {
	function getMap(x:Int, y:Int, w:Int, h:Int):Array<GridView>;
}

interface ILobbyController extends IBaseController {
	function getLobbyInfo():ILobbyInfo;
}

interface IView {
	function startLobby(ctr:ILobbyController):Void;
	function startBattle(ctr:IBattleController):Void;
	function onEvent(action:ViewEvent):Void;
}
