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

interface IEntityContainer {
	function push(obj:Any):Void;
	function remove(obj:Any):Void;
}

class CompositeContainer implements IEntityContainer {
	final _list:Array<IEntityContainer> = [];

	public function addContainer(c:IEntityContainer) {
		_list.push(c);
	}

	public function push(obj:Any):Void {
		for (c in _list) {
			c.push(obj);
		}
	}

	public function remove(obj:Any):Void {
		for (c in _list) {
			c.remove(obj);
		}
	}
}

abstract class DefaultContainer<T> implements IEntityContainer {
	final _list:Array<T> = [];

	public function remove(obj:Any):Void {
		_list.remove(obj);
	}

	public function getList():Array<T> {
		return _list;
	}
}
