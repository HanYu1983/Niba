package common;

import haxe.ds.StringMap;

enum ViewAction {
	GOTO_LOBBY_ACTION;
	GOTO_BATTLE_ACTION;
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
	function onAction(action:ViewAction):Void;
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
