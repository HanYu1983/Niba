package han;

import common.Define;

class Model implements IModel {
	var _id = 0;

	public function new() {
		trace("Model new");
	}

	public function doIt() {
		_id++;
		trace(_id);
	}
}
