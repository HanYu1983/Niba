package model.ver1.game.define;

using Lambda;

import haxe.EnumTools;
import haxe.ds.Option;
import haxe.ds.EnumValueMap;
import tool.Table;
import tool.Helper;
import model.ver1.game.define.Timing;
import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Block;
import model.ver1.game.define.Require;
import model.ver1.game.define.Event;
import model.ver1.game.define.Player;
import model.ver1.game.alg.CardProto;


// Context
// Player
// 實作hxbit.Serializable這個介面後並使用了@:s
// @:nullSafety就會出錯
// hxbit.Serializable不支援EnumValueMap
// class Player implements hxbit.Serializable {
// 	public function new(id:String) {
// 		this.id = id;
// 	}
// 	// @:s不能作用在interface
// 	// 不能用final
// 	// 不支援巢狀typedef
// 	@:s public var id:String;
// }

// function getOpponentPlayerId(playerId:String):String {
// 	return playerId == PlayerId.A ? PlayerId.B : PlayerId.A;
// }

typedef PlayerSelection = {
	cardIds:Map<String, Array<String>>
}

typedef Memory = {
	playerSelection:PlayerSelection
}

// General

enum TextTypeAutomaticType {
	// 常駐
	Resident;
	// 起動
	Trigger;
	// 恒常
	Constant;
}

enum TextType {
	// 自動型
	Automatic(type:TextTypeAutomaticType);
	// 使用型
	Use;
	// 特殊型
	Special;
}

enum CardCategory {
	Unit;
	Character;
	Command;
	Operation;
	OperationUnit;
	Graphic;
	Ace;
}

enum CardEntityCategory {
	Unit;
	Character;
	Operation;
	G;
}

enum GColor {
	Red;
	Black;
	Purple;
}

enum GProperty {
	Uc;
	Zero8;
}

enum GSign {
	Default(color:GColor, property:GProperty);
}

enum BattlePoint {
	Default(melee:Int, range:Int, hp:Int);
}

enum RelativePlayer {
	You;
	Opponent;
}

class CardText<T, Eff> implements hxbit.Serializable {
	public function new(id:String, description:String) {
		this.id = id;
		this.description = description;
	}

	@:s public var id:String;
	@:s public var description:String;
	@:s public var type = Use;
	// << >>內文
	@:s public var isSurroundedByArrows = false;

	private function getSubKey(v:Int) {
		return '${id}_${v}';
	}

	public function getEffect(ctx:T, runtime:ExecuteRuntime):Array<Eff> {
		return [];
	}

	public function getRequires(ctx:T, runtime:ExecuteRuntime):Array<Require<T>> {
		return [];
	}

	public function getRequires2(ctx:T, runtime:ExecuteRuntime):Array<Require2> {
		return [];
	}

	public function action(ctx:T, runtime:ExecuteRuntime):Void {}

	public function onEvent(ctx:T, event:Event, runtime:ExecuteRuntime):Void {}
}

// CardProto

class CardProto<T, Eff> implements hxbit.Serializable {
	public var category = CardCategory.Unit;

	public function new() {}

	public function getTexts(ctx:T, runtime:ExecuteRuntime):Array<CardText<T, Eff>> {
		return [];
	}
}
