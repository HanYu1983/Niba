package common;

import VectorMath;

interface IGetPosition {
	function getPosition():Null<Vec2>;
}

interface IWeapon {}

interface IGetWeapon {
	function getWeapons():Array<IWeapon>;
}

interface IMapObject extends IGetPosition {}
interface IItemBox extends IMapObject {}
interface IPilot extends IMapObject {}

interface IGetPilot {
	function getPilot():Null<IPilot>;
}

interface IRobot extends IMapObject extends IGetWeapon extends IGetPilot {}

interface IModel {
	function getRobots():Array<IRobot>;
	function getPilots():Array<IPilot>;
	function createRobot():IRobot;
	function createPilot():IPilot;
	function push(obj:Any):Void;
	function remove(obj:Any):Void;
	function setPilotRobot(pilot:IPilot, robot:IRobot):Void;
}
