package model.ver1.game;

using Lambda;

import haxe.EnumTools;
import haxe.ds.Option;
import haxe.ds.EnumValueMap;
import tool.Table;
import tool.Helper;
import model.ver1.data.DataPool;

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

// ExecuteRuntime

interface ExecuteRuntime {
	function getCardId():String;
	function getResponsePlayerId():String;
}

class AbstractExecuteRuntime implements ExecuteRuntime {
	public function new() {}

	public function getCardId():String {
		throw new haxe.Exception("not support");
	}

	public function getResponsePlayerId():String {
		throw new haxe.Exception("not support");
	}
}

class SystemExecuteRuntime extends AbstractExecuteRuntime {
	public function new(responsePlayerId:String) {
		super();
		this.responsePlayerId = responsePlayerId;
	}

	public final responsePlayerId:String;

	public override function getResponsePlayerId():String {
		return responsePlayerId;
	}
}

class DefaultExecuteRuntime extends AbstractExecuteRuntime {
	public function new(cardId:String, responsePlayerId:String) {
		super();
		this.cardId = cardId;
		this.responsePlayerId = responsePlayerId;
	}

	public final cardId:String;
	public final responsePlayerId:String;

	public override function getCardId():String {
		return cardId;
	}

	public override function getResponsePlayerId():String {
		return responsePlayerId;
	}
}


class CardProto implements hxbit.Serializable {
	public function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [];
	}
}