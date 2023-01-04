package model.ver1.game.define;

import haxe.ds.Option;
import model.ver1.game.define.Define;
import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.define.Timing;

class Require {
	public function new(id:String, description:String) {
		this.id = id;
		this.description = description;
	}

	public final id:String;
	public final description:String;

	public function action(ctx:Context, runtime:ExecuteRuntime):Void {}
}

// TODO: refactor

enum RequireType {
	Pending;
	SelectCard(tips:Array<String>);
	SelectBattlePoint(tips:Array<BattlePoint>);
}

typedef Require2 = {
	id:String,
	description:String,
	type: RequireType,
	action:() -> Void,
}
