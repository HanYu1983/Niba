package common;

import haxe.ds.StringMap;

enum ViewEvent {
	ON_CLICK_GOTO_LOBBY;
	ON_CLICK_GOTO_BATTLE(options:Dynamic);
}

interface IRobot {}
interface IPilot {}
interface IWeapon {}
interface ILobbyInfo {}
interface IGrid {}

interface IBaseController {
	function getRobots():StringMap<IRobot>;
	function getPilots():StringMap<IPilot>;
	function getWeapons():StringMap<IWeapon>;
	function save():Void;
	function load():Void;
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
}
