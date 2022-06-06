package common;

interface IRobotGetter {
	function getPilot():Null<IPilotGetter>;
}

interface IRobot extends IRobotGetter {
	function setPilot(pilot:Null<IPilotGetter>):Void;
}

abstract class DefaultRobot implements IRobot {
	function new() {}

	var _pilot:Null<IPilotGetter>;

	public function getPilot():Null<IPilotGetter> {
		return _pilot;
	}

	public function setPilot(pilot:Null<IPilotGetter>) {
		_pilot = pilot;
	}
}

interface IPilotGetter {
	function getRobot():Null<IRobotGetter>;
}

interface IPilot extends IPilotGetter {
	function setRobot(robot:Null<IRobotGetter>):Void;
}

abstract class DefaultPilot implements IPilot {
	function new() {}

	var _robot:Null<IRobotGetter>;

	public function getRobot():Null<IRobotGetter> {
		return _robot;
	}

	public function setRobot(robot:Null<IRobotGetter>) {
		_robot = robot;
	}
}

interface IModelGetter {
	function getRobots():Array<IRobotGetter>;
	function getPilots():Array<IPilotGetter>;
}

interface IModel extends IModelGetter {
	function addRobot():IRobotGetter;
	function addPilot():IPilotGetter;
	function setPilot(robot:IRobotGetter, pilot:IPilotGetter):IRobotGetter;
}

abstract class DefaultModel implements IModel {
	private final _robots:Array<IRobotGetter>;
	private final _pilots:Array<IPilotGetter>;

	function new() {
		_robots = new Array<IRobotGetter>();
		_pilots = new Array<IPilotGetter>();
	}

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
