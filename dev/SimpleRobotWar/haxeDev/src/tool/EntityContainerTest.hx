package tool;

import haxe.Serializer;
import haxe.Unserializer;
import tool.EntityContainer;
import haxe.ds.ObjectMap;

interface IGetPosition {
	function getPosition():Null<Dynamic>;
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

class RobotContainer extends DefaultContainer<IRobot> {
	public function new() {}

	public function push(obj:Any):Void {
		if (Std.isOfType(obj, IRobot) == false) {
			return;
		}
		_list.push(obj);
	}
}

class PilotContainer extends DefaultContainer<IPilot> {
	public function new() {}

	public function push(obj:Any):Void {
		if (Std.isOfType(obj, IPilot) == false) {
			return;
		}
		_list.push(obj);
	}
}

class MapContainer extends DefaultContainer<IMapObject> {
	public function new() {}

	public function push(obj:Any):Void {
		if (Std.isOfType(obj, IMapObject) == false) {
			return;
		}
		_list.push(obj);
	}
}

class Robot implements IRobot {
	final _model:Model;

	public function new(model:Model) {
		_model = model;
	}

	public function getPosition():Null<Dynamic> {
		return null;
	}

	public function getWeapons():Array<IWeapon> {
		return [];
	}

	public function getPilot():Null<IPilot> {
		return _model.getRobotPilot(this);
	}
}

class Pilot implements IPilot {
	public function new() {}

	public function getPosition():Null<Dynamic> {
		return null;
	}
}

class Model extends CompositeContainer implements IModel {
	final _mapObjects = new MapContainer();

	public function new() {
		addContainer(_robots);
		addContainer(_pilots);
		addContainer(_mapObjects);
	}

	public function createRobot():IRobot {
		return new Robot(this);
	}

	public function createPilot():IPilot {
		return new Pilot();
	}

	final _robots = new RobotContainer();

	public function getRobots():Array<IRobot> {
		return _robots.getList();
	}

	final _pilots = new PilotContainer();

	public function getPilots():Array<IPilot> {
		return _pilots.getList();
	}

	final _pilotToRobot = new ObjectMap<IPilot, IRobot>();
	final _robotToPilot = new ObjectMap<IRobot, IPilot>();

	public function setPilotRobot(pilot:IPilot, robot:IRobot):Void {
		_pilotToRobot.set(pilot, robot);
		_robotToPilot.set(robot, pilot);
	}

	public function getRobotPilot(robot:IRobot):Null<IPilot> {
		return _robotToPilot.get(robot);
	}
}

function test() {
	final model:IModel = new Model();
	{
		final robot1 = model.createRobot();
		model.push(robot1);
		final robot2 = model.createRobot();
		model.push(robot2);
		final pilot1 = model.createPilot();
		model.push(pilot1);
		model.setPilotRobot(pilot1, robot1);
	}
	Serializer.USE_CACHE = true;
	final s = Serializer.run(model);
	trace(s);
	final model2 = Unserializer.run(s);
	trace(model2);
	{
		final robot1 = model.getRobots()[0];
		final robot2 = model.getRobots()[1];
		final pilot1 = model.getPilots()[0];
		trace(robot1.getPilot() == robot2.getPilot());
		trace(robot1.getPilot() == pilot1);
	}
}
