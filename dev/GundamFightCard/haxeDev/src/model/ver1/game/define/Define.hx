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
import model.ver1.game.define.Flow;
import model.ver1.game.define.Player;

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

class Context implements hxbit.Serializable {
	public function new() {}

	// @:s public var players:Map<String, Player> = [];
	@:s public var playersOrder:Array<String> = [];
	@:s public var table = new Table();
	@:s public var marks:Map<String, Mark> = [];
	@:s public var timing = TIMINGS[0];
	@:s public var cardProtoPool:Map<String, CardProto> = [];
	@:s public var memory:Memory = {
		playerSelection: {
			cardIds: []
		}
	};
	// serializable不支援List
	@:s public var cuts:Array<Array<Block>> = [];
	@:s public var flowMemory:FlowMemory = {
		state: PrepareDeck,
		hasTriggerEvent: false,
		hasPlayerPassPhase: new Map<String, Bool>(),
		hasPlayerPassCut: new Map<String, Bool>(),
		hasPlayerPassPayCost: new Map<String, Bool>(),
		shouldTriggerStackEffectFinishedEvent: false,
		msgs: [],
	};
	@:s public var activePlayerId: String;
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

class CardText implements hxbit.Serializable {
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

	public function getEffect(ctx:Context, runtime:ExecuteRuntime):Array<MarkEffect> {
		return [];
	}

	public function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		return [];
	}

	public function action(ctx:Context, runtime:ExecuteRuntime):Void {}

	public function onEvent(ctx:Context, event:Event, runtime:ExecuteRuntime):Void {}
}

// CardProto

class CardProto implements hxbit.Serializable {
	public var category = CardCategory.Unit;

	public function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [];
	}
}
