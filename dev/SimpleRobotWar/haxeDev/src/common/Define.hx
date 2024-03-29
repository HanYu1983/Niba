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

interface IEntityBase {
	function getId():String;
	function getTitle():String;
}

interface IRobot extends IEntityBase {}
interface IPilot extends IEntityBase {}
interface IWeapon extends IEntityBase {}
interface ILobbyInfo {}
interface IGrid {}

interface IBaseController {
	function getRobots():Map<String, IRobot>;
	function getPilots():Map<String, IPilot>;
	function getWeapons():Map<String, IWeapon>;
	function onEvent(action:ViewEvent):Void;
}

interface IBattleController extends IBaseController {
	function getMap(x:Int, y:Int, w:Int, h:Int):Array<IGrid>;
}

interface ILobbyController extends IBaseController {
	function getLobbyInfo():ILobbyInfo;
}

interface IView {
	function startLobby(ctr:ILobbyController):Void;
	function startBattle(ctr:IBattleController):Void;
	function onEvent(action:ViewEvent):Void;
}
