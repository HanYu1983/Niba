package common;

import haxe.Exception;
import haxe.ds.StringMap;
import haxe.ds.EnumValueMap;
import haxe.Constraints;

enum Position {
	POS(x:Int, y:Int);
}

enum AttackCost {
	ENERGY(v:Float);
	BULLET(v:Int);
	ACTION(v:Int);
}

enum AttachShape {
	DOT(min:Int, max:Int);
	LINE(min:Int, max:Int);
	CIRCLE(min:Int, max:Int, w:Int);
	SHAPE(pos:Array<Position>);
	SELECT(min:Int, max:Int, w:Int);
}

enum Damage {
	PHYSICS(v:Int);
	BEAM(v:Int);
	FIRE(v:Int);
	EXPLODE(v:Int);
}

enum AttackFlag {
	MELEE;
	BEAM;
	MISSILE;
}

typedef AttackData = {
	title:String,
	cost:Array<AttackCost>,
	attackShape:AttachShape,
	times:Int,
	hitRate:Float,
	damage:Array<Damage>,
	attackFlag:Array<AttackFlag>,
	isMelee:Bool,
}

function getDefaultAttack():AttackData {
	return {
		title: "未命名",
		cost: [],
		attackShape: DOT(0, 0),
		times: 0,
		hitRate: 0,
		damage: [],
		attackFlag: [],
		isMelee: false,
	}
}

enum GuardResult {
	REDUCE(v:Int);
	CANCEL();
}

typedef GuardData = {
	title:String,
	cost:Array<AttackCost>,
	successRate:Float,
	attackFlag:Array<AttackFlag>,
	guardResult:GuardResult,
	isMelee:Bool,
}

function getDefaultGuard():GuardData {
	return {
		title: "未命名",
		cost: [],
		successRate: 0,
		attackFlag: [],
		guardResult: CANCEL,
		isMelee: false,
	}
}

typedef ShieldData = {
	title:String,
	cost:Array<AttackCost>,
	damage:Array<Damage>,
}

typedef WeaponData = {
	title:String,
	bullet:Int,
	attack:Array<AttackData>,
	guard:Array<GuardData>,
	shield:Array<ShieldData>,
	cost:Int
}

function getDefaultWeapon():WeaponData {
	return {
		title: "未命名",
		bullet: 0,
		attack: [],
		guard: [],
		shield: [],
		cost: 0,
	}
}

typedef TerrianData = {
	title:String,
	// 移動成本係數
	moveFactor:Array<Float>,
	// 防守方回避系數
	evade:Float,
	// 防守方防禦系數
	def:Float
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
}

typedef RobotView = {
	id:String,
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

interface ILobbyInfo {}

interface IBaseController {
	function getRobots():IMap<String, RobotView>;
	function getPilots():IMap<String, PilotView>;
	function getWeapons():IMap<String, WeaponView>;
	function onEvent(action:ViewEvent):Void;
}

enum UnitMenuItem {
	// 移動
	MOVE;
	// 攻擊
	ATTACK;
	// 終了
	DONE;
}

interface IBattleController extends IBaseController {
	function getRobotMenuItems():Array<UnitMenuItem>;
	function getRobotMoveRangeByPosition(pos:Position):Array<Position>;
	function getRobotIdByPosition(pos:Position):Null<String>;
	function getGrids():IMap<Position, GridView>;
}

interface ILobbyController extends IBaseController {
	function getLobbyInfo():ILobbyInfo;
}

interface IView {
	function startLobby(ctr:ILobbyController):Void;
	function startBattle(ctr:IBattleController):Void;
	function onEvent(action:ViewEvent):Void;
}
