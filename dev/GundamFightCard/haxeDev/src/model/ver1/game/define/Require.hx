package model.ver1.game.define;

import model.ver1.game.define.Define;
import model.ver1.game.define.ExecuteRuntime;

class Require {
	public function new(id:String, description:String) {
		this.id = id;
		this.description = description;
	}

	public final id:String;
	public final description:String;

	public function action(ctx:Context, runtime:ExecuteRuntime):Void {}
}

