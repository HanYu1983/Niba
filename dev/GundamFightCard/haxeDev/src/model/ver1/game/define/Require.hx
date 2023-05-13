package model.ver1.game.define;

import haxe.ds.Option;
import model.ver1.game.define.Define;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Target;

class Require {
	public function new(id:String, description:String) {
		this.id = id;
		this.description = description;
	}

	public final id:String;
	public final description:String;

	public function action(_ctx:Any, runtime:Runtime):Void {}
}

// TODO: refactor

typedef Tip<T> = {
	value:T,
	weight:Float,
}

enum RequireType {
	Pending;
	SelectCard(tips:Array<Tip<String>>, lengthInclude:Array<Int>);
	SelectBattlePoint(tips:Array<BattlePoint>);
}

typedef Require2 = {
	id:String,
	description:String,
	type:RequireType,
	player:RelativePlayer,
	action:() -> Void,
}

typedef Require3 = {
	id:String,
	description:String,
	target: Target,
	action:() -> Void,
}
