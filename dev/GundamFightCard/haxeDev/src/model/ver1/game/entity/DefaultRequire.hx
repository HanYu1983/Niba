package model.ver1.game.entity;

import model.ver1.game.define.Define;
import model.ver1.game.define.Require;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Event;
import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.entity.Context;

class DefaultRequire extends Require<Context> {
	public function new(id:String, description:String) {
		super(id, description);
	}
}
