package common;

import hx.injection.Service;
import common.Define;
import han.Model;

class TestController implements Service {
	final _model:IModel;
	final _model2:IModel;
	final _model3:IModel;

	public function new(model:IModel, model2:IModel) {
		this._model = model;
		this._model2 = model2;
		this._model3 = new Model();
	}

	public function doIt() {
		this._model.doIt();
		this._model2.doIt();
		this._model3.doIt();
		trace(this._model == this._model2);
		trace(this._model2 == this._model3);
	}
}
