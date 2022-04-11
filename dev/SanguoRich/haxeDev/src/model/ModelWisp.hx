package model;

import model.DebugModel;
import model.IModel.GameInfo;

@:native("getNativeModule") extern class NativeModule {
	public function new():Void;
	public function gameInfo():GameInfo;
	public function gameStart(cb:Void->Void):Void;
}

class ModelWisp extends DebugModel {
	public override function gameInfo():GameInfo {
		return new NativeModule().gameInfo();
	}

	public override function gameStart(cb:Void->Void):Void {
		return new NativeModule().gameStart(cb);
	}
}
