package model.ver1.game.define;

using Lambda;

import haxe.EnumTools;
import haxe.ds.Option;
import haxe.ds.EnumValueMap;
import tool.Table;
import tool.Helper;
import model.ver1.game.define.Timing;

// Context

typedef PlayerSelection = {
	cardIds:Map<String, Array<String>>
}

typedef Memory = {
	playerSelection:PlayerSelection
}

class Context implements hxbit.Serializable {
	public function new() {}

	@:s public var players:Map<String, Player> = [];
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
}


// General

enum GColor {
	Red;
	Black;
	Purple;
}

typedef GSign = {
	colors:Array<GColor>,
	production:String
}

typedef BattlePoint = {
	v1:Int,
	v2:Int,
	v3:Int
};

enum RelativePlayer {
	You;
	Opponent;
}

// Require

class Require {
	public function new(id:String, description:String) {
		this.id = id;
		this.description = description;
	}

	public final id:String;
	public final description:String;

	public function action(ctx:Context, runtime:ExecuteRuntime):Void {}
}

// Player
// 實作hxbit.Serializable這個介面後並使用了@:s
// @:nullSafety就會出錯
// hxbit.Serializable不支援EnumValueMap
class Player implements hxbit.Serializable {
	public function new(id:String) {
		this.id = id;
	}

	// @:s不能作用在interface
	// 不能用final
	// 不支援巢狀typedef
	@:s public var id:String;
}

// Event

enum Event {
	ChangePhase;
	// 「ゲイン」の効果で戦闘修正を得た場合
	Gain(cardId:String, value:Int);
	//
	CardEnterField(cardId:String);
}

// Block

enum BlockCause {
	Pending;
	System(respnosePlayerId:String);
	PlayCard(playerId:String, cardId:String);
	PlayText(cardId:String, textId:String);
	TextEffect(cardId:String, textId:String);
}

class Block implements hxbit.Serializable {
	public function new(id:String, cause:BlockCause, text:CardText) {
		this.id = id;
		this.cause = cause;
		this.text = text;
	}

	@:s public var id:String;
	@:s public var cause:BlockCause;
	@:s public var text:CardText;
	@:s public var isImmediate = false;
}

// ExecuteRuntime

interface ExecuteRuntime {
	function getCardId():String;
	function getResponsePlayerId():String;
}

// CardText

class CardText implements hxbit.Serializable {
	public function new(id:String, description:String) {
		this.id = id;
		this.description = description;
	}

	@:s public var id:String;
	@:s public var description:String;

	public function getEffect(ctx:Context, runtime:ExecuteRuntime):Array<MarkEffect> {
		return [];
	}

	public function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		return [];
	}

	public function action(ctx:Context, runtime:ExecuteRuntime):Void {}

	public function onEvent(ctx:Context, event:Event, runtime:ExecuteRuntime):Void {}
}

// Mark

enum MarkEffect {
	AddBattlePoint(cardId:String, battlePoint:BattlePoint);
	AttackSpeed(cardId:String, speed:Int);
	AddText(cardID:String, text:CardText);
}

class Mark implements hxbit.Serializable {
	public function new(id:String) {
		this.id = id;
	}

	@:s public var id:String;

	public function getEffect(ctx:Context):Array<MarkEffect> {
		return [];
	}

	public function onEvent(ctx:Context, event:Event):Void {}
}

// CardProto

class CardProto implements hxbit.Serializable {
	public function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [];
	}
}
