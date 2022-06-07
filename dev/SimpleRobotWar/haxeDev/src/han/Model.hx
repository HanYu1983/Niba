package han;

import haxe.ds.ObjectMap;
import VectorMath;
import common.Define;

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

	public function getPosition():Null<Vec2> {
		return vec2(0, 0);
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

	public function getPosition():Null<Vec2> {
		return vec2(0, 0);
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
