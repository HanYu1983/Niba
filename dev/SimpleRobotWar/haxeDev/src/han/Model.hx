package han;

import common.Define;

class Robot extends DefaultRobot {
	final _model:IModelGetter;
	final _id:String;

	public function new(model:IModelGetter, id:String) {
		_model = model;
		_id = id;
	}
}

class Pilot extends DefaultPilot {
	final _model:IModelGetter;
	final _id:String;

	public function new(model:IModelGetter, id:String) {
		_model = model;
		_id = id;
	}
}

class Map extends DefaultMap {
	public function new() {}
}

class Model extends DefaultModel {
	var _id = 0;
	final _map = new Map();

	public function new() {}

	public function addRobot():IRobotGetter {
		final tmp = new Robot(this, '${_id++}');
		_robots.push(tmp);
		return tmp;
	}

	public function addPilot():IPilotGetter {
		final tmp = new Pilot(this, '${_id++}');
		_pilots.push(tmp);
		return tmp;
	}

	public function getMap():IMapGetter {
		return _map;
	}
}
