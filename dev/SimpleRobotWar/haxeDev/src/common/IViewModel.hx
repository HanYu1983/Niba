package common;

import haxe.Exception;
import haxe.Constraints;
import common.IDefine;

// 顯示UI訊息的例外
// 其它的例外會中斷程式
class MessageException extends Exception {
	public function new(msg:String) {
		super(msg);
	}
}

enum RobotMenuItem {
	// 移動
	MOVE;
	// 攻擊
	ATTACK;
	// 狀態
	STATUS;
	// 終了
	DONE;
}

enum SystemMenuItem {
	// 回合結束
	TURN_END;
}

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
	// 當點擊地圖格子
	ON_CLICK_BATTLE_POS(pos:Position);
	// 當點擊取消
	ON_CLICK_CANCEL;
	// 當點擊機體菜單
	ON_CLICK_ROBOT_MENU_ITEM(item:RobotMenuItem);
	// 當點擊武器攻擊時(顯示攻擊範圍)
	ON_CLICK_ROBOT_WEAPON_ATTACK(value:{attackId:String, robotId:String});
	// 當點擊武器攻擊確認時(確定選擇武器後轉移到選取目標的狀態)
	ON_CLICK_ROBOT_WEAPON_ATTACK_CONFIRM(value:{attackId:String, robotId:String});
	//
	ON_CLICK_SYSTEM_MENU_ITEM(item:SystemMenuItem);
	//
	ON_SYSTEM_ENEMY_TURN(step:Int);
}

typedef RobotView = {
	id:String,
	// 勢力
	playerId:Null<Int>,
	title:String,
	// null代表沒有駕駛
	pilotId:Null<String>,
	weaponIds:Array<String>,
	hp:Int,
	energy:Int,
	// 行動力
	action:Int,
	maxHp:Int,
	maxEnergy:Int,
	maxAction:Int,
	position:Null<Position>,
	isDone:Bool
}

typedef PilotView = {
	id:String,
	title:String,
	// null代表沒有駕機體
	robotId:Null<String>,
	// 格鬥技術
	melee:Int,
	// 射擊技術
	range:Int,
	// 攻擊技術
	attack:Int,
	// 防禦技術
	guard:Int,
	// 運氣
	lucky:Int
}

typedef WeaponView = {
	id:String,
	title:String,
	// null代表沒有設置
	robotId:Null<String>,
	// 等級
	level:Int,
	// 彈藥數
	bullet:Int
}

typedef GridView = {
	terrianId:Int,
	title:String,
	// 防禦系數
	defRate:Float,
	// 回避系數
	evadeRate:Float,
	// 格子上的機體, null代表沒有
	robotId:Null<String>,
}

typedef WeaponAttackView = {
	id:String,
	weaponId:String,
	robotId:String,
	title:String,
	cost:String,
	// 攻擊形狀
	attackShape:String,
	// 攻擊次數
	times:Int,
	// 基本命中率
	hitRate:Float,
	// 傷害類型
	damage:String,
	// 標記
	attackFlag:String,
	// 是否近戰
	isMelee:Bool,
}

typedef WeaponGuardView = {
	id:String,
	weaponId:String,
	robotId:String,
	title:String,
	// 成功率
	successRate:Float,
	// 標記
	attackFlag:String,
	// 是否近戰
	isMelee:Bool,
}

typedef WeaponShieldView = {
	id:String,
	weaponId:String,
	robotId:String,
	title:String,
	cost:String,
	damage:String,
}

interface IBaseController {
	function getRobots():IMap<String, RobotView>;
	function getPilots():IMap<String, PilotView>;
	function getWeapons():IMap<String, WeaponView>;
	function getAttacks(robotId:String):Array<WeaponAttackView>;
	function onEvent(action:ViewEvent):Void;
}

interface ILobbyInfo {}

interface ILobbyController extends IBaseController {
	function getLobbyInfo():ILobbyInfo;
}

enum RobotMenuState {
	// 沒開狀態
	NORMAL;
	// 打開菜單
	ROBOT_MENU;
	// 選擇移動位置時
	ROBOT_SELECT_MOVE_POSITION;
	// 選擇攻擊武器時
	ROBOT_SELECT_WEAPON_ATTACK;
	//
	ROBOT_SELECT_WEAPON_ATTACK_TARGET(shape:AttachShape);
	//
	ROBOT_BATTLE_PREVIEW;
	SYSTEM_MENU;
}

typedef RobotMenuView = {
	menuItems:Array<RobotMenuItem>
}

typedef SystemMenuView = {
	menuItems:Array<SystemMenuItem>
}

typedef MoveRangeView = {
	pos:Array<Position>
}

typedef WeaponAttackListView = {
	weaponAttacks:Array<WeaponAttackView>
}

typedef WeaponGuardListView = {
	weaponGuards: Array<WeaponGuardView>
}

typedef WeaponShieldListView = {
	weaponShields: Array<WeaponShieldView>
}

typedef RobotStatusView = {
	robotId:String,
	weaponAttacks:Array<WeaponAttackView>
}

typedef RobotBattlePreviewView = {
	// 攻擊方
	attack:{
		robotId:String, // 使用的攻擊行為
		weaponAttackView:WeaponAttackView,
	},
	guard:{
		robotId:String, 
		// 選擇的戰鬥反應
		battleReaction:RobotBattleReaction,
		// 可能的防禦行為
		weaponGuardListView: WeaponGuardListView,
		// 護甲
		weaponShieldListView: WeaponShieldListView,
	}
}

interface IBattleController extends IBaseController {
	function getRobotMenuState():RobotMenuState;
	function getRobotMenuView():Null<RobotMenuView>;
	function getSystemMenuView():Null<SystemMenuView>;
	function getMoveRangeView():Null<MoveRangeView>;
	function getAttackRangeView():Null<MoveRangeView>;
	function getAttackHitRangeView():Null<MoveRangeView>;
	function getWeaponAttackListView():Null<WeaponAttackListView>;
	function getRobotStatusView():Null<RobotStatusView>;
	function getRobotBattlePreviewView():Null<RobotBattlePreviewView>;
	function getGrids():IMap<Position, GridView>;
}

enum Page {
	LOBBY;
	BATTLE;
	ROBOT_VIEW;
	PILOT_VIEW;
}

interface IView {
	function changePage(page:Page):Void;
	function renderBattlePage():Void;
	function animateRobotMove(robotId:String, path:Array<Position>, cb:Void->Void):Void;
	function animateMessage(msg:String):Void;
}
