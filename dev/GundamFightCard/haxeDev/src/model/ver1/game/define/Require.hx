package model.ver1.game.define;

import haxe.ds.Option;
import tool.LogicTree;
import model.ver1.game.define.Define;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Player;

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
	player:Option<PlayerId>,
	action:() -> Void,
}

function createRequire(id:String, description:String, type:RequireType, player:Option<PlayerId>, action:() -> Void):Require2 {
	return {
		id: id,
		description: description,
		type: type,
		player: player,
		action: action
	}
}

enum RequireSelectionCount {
	// 1枚
	Constants(value:Int);
	// 合計2枚まで
	MuchAsPossible(value:Int);
}

enum RequireSelectionType {
	SelectCard(tips:Array<String>);
	SelectBattlePoint(tips:Array<BattlePoint>);
}

typedef RequireSelection = {
	id:String,
	description:String,
	player:Option<PlayerId>,
	type:RequireSelectionType,
	count:RequireSelectionCount,
	action:() -> Void,
}

typedef Require3 = {
	logic:Option<LogicTree>,
	selections:Array<RequireSelection>
}
