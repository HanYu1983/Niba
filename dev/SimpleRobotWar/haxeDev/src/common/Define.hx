package common;

import haxe.ds.StringMap;

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
}

interface IBattleController extends IBaseController {
	function getMap(x:Int, y:Int, w:Int, h:Int):Array<IGrid>;
	function gotoLobby():Void;
}

interface ILobbyController extends IBaseController {
	function getLobbyInfo():ILobbyInfo;
	function gotoBattle(options:Dynamic):Void;
}

interface IView {
	function startLobby(ctr:ILobbyController):Void;
	function startBattle(ctr:IBattleController):Void;
}

class DefaultView implements IView {
	public function new() {}

	public function startLobby(ctr:ILobbyController):Void {}

	public function startBattle(ctr:IBattleController):Void {}
}
