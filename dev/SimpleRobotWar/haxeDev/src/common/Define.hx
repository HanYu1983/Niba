package common;

import haxe.Exception;
import VectorMath;

interface IRobotGetter {
	function getPilot():Null<IPilotGetter>;
	function getPosition():Vec2;
}

interface IRobot extends IRobotGetter {
	function setPilot(pilot:Null<IPilotGetter>):Void;
	function setPosition(v:Vec2):Void;
}

abstract class DefaultRobot implements IRobot {
	var _pilot:Null<IPilotGetter>;
	var _pos:Vec2 = vec2(0, 0);

	public function getPilot():Null<IPilotGetter> {
		return _pilot;
	}

	public function setPilot(pilot:Null<IPilotGetter>) {
		_pilot = pilot;
	}

	public function getPosition():Vec2 {
		return _pos;
	}

	public function setPosition(v:Vec2):Void {
		_pos = v;
	}
}

interface IPilotGetter {
	function getRobot():Null<IRobotGetter>;
}

interface IPilot extends IPilotGetter {
	function setRobot(robot:Null<IRobotGetter>):Void;
}

abstract class DefaultPilot implements IPilot {
	var _robot:Null<IRobotGetter>;

	public function getRobot():Null<IRobotGetter> {
		return _robot;
	}

	public function setRobot(robot:Null<IRobotGetter>) {
		_robot = robot;
	}
}

interface IMapGridGetter {}

interface IMapGetter {
	function getGrid(pos:Vec2):IMapGridGetter;
	function getPath(s:Vec2, e:Vec2):Array<IMapGridGetter>;
}

interface IMap extends IMapGetter {}

abstract class DefaultMap implements IMap {
	final _grids = new Array<IMapGridGetter>();

	public function getGrid(pos:Vec2):IMapGridGetter {
		throw new haxe.Exception("not impl");
	}

	public function getPath(s:Vec2, e:Vec2):Array<IMapGridGetter> {
		throw new haxe.Exception("not impl");
	}
}

interface IModelGetter {
	function getRobots():Array<IRobotGetter>;
	function getPilots():Array<IPilotGetter>;
	function getMap():IMapGetter;
}

interface IModel extends IModelGetter {
	function addRobot():IRobotGetter;
	function addPilot():IPilotGetter;
	function setPilot(robot:IRobotGetter, pilot:IPilotGetter):IRobotGetter;
}

abstract class DefaultModel implements IModel {
	final _robots:Array<IRobotGetter> = [];
	final _pilots:Array<IPilotGetter> = [];

	public function getRobots():Array<IRobotGetter> {
		return _robots;
	}

	public function getPilots():Array<IPilotGetter> {
		return _pilots;
	}

	public function setPilot(robot:IRobotGetter, pilot:Null<IPilotGetter>):IRobotGetter {
		final robotWriter = cast(robot, IRobot);
		final originPilot = robotWriter.getPilot();
		if (originPilot != null) {
			cast(originPilot, IPilot).setRobot(null);
		}
		robotWriter.setPilot(pilot);
		if (pilot != null) {
			cast(pilot, IPilot).setRobot(robot);
		}
		return robotWriter;
	}
}
