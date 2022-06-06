package han;

import common.Define;

class Robot extends DefaultRobot {
	public function new() {
		super();
	}
}

class Pilot extends DefaultPilot {
	public function new() {
		super();
	}
}

class Model extends DefaultModel {
	public function new() {
		super();
	}

	public function addRobot():IRobotGetter {
		final tmp = new Robot();
		_robots.push(tmp);
		return tmp;
	}

	public function addPilot():IPilotGetter {
		final tmp = new Pilot();
		_pilots.push(tmp);
		return tmp;
	}
}
