package model.ver1.game.define;

using Lambda;

import haxe.EnumTools;
import haxe.ds.Option;
import haxe.ds.EnumValueMap;
import tool.Table;
import tool.Helper;
import model.ver1.game.define.Timing;

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

final PLAYER_A = "PLAYER_A";
final PLAYER_B = "PLAYER_B";

// Event

enum Event {
	ChangePhase;
	// 「ゲイン」の効果で戦闘修正を得た場合
	Gain(cardId:String, value:Int);
	//
	CardEnterField(cardId:String);
	//
	CardRoll(cardId:String);
}

typedef PlayerSelection = {
	cardIds:Map<String, Array<String>>
}

typedef Memory = {
	playerSelection:PlayerSelection
}

class Context implements hxbit.Serializable {
	public function new() {}

	//@:s public var players:Map<String, Player> = [];
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

// Mark

enum MarkEffect {
	AddBattlePoint(cardId:String, battlePoint:BattlePoint);
	AttackSpeed(cardId:String, speed:Int);
	AddText(cardId:String, text:CardText);
	EnterFieldThisTurn(cardId:String);
	CanNotReroll(cardId:String);
}

class Mark implements hxbit.Serializable {
	public function new(id:String) {
		this.id = id;
	}

	@:s public var id:String;
	@:s public var age:Null<Int>;

	public function getEffect(ctx:Context):Array<MarkEffect> {
		return [];
	}

	public function onEvent(ctx:Context, event:Event):Void {
		if (age != null) {
			switch event {
				case ChangePhase:
					switch ctx.timing {
						case Default(Battle, Some(End), End):
							age -= 1;
							if (age <= 0) {
								ctx.marks.remove(id);
							}
						case _:
					}
				case _:
			}
		}
	}
}

class EnterFieldThisTurnMark extends Mark {
	public function new(id:String, cardId:String) {
		super(id);
		this.cardId = cardId;
		this.age = 1;
	}

	@:s public var cardId:String;

	public override function getEffect(ctx:Context):Array<MarkEffect> {
		return [EnterFieldThisTurn(this.cardId)];
	}
}

class CanNotRerollMark extends Mark {
	public function new(id:String, cardId:String) {
		super(id);
		this.cardId = cardId;
	}

	@:s public var cardId:String;

	public override function getEffect(ctx:Context):Array<MarkEffect> {
		return [CanNotReroll(this.cardId)];
	}
}

// CardText

interface ExecuteRuntime {
	function getCardId():String;
	function getResponsePlayerId():String;
}

class Require {
	public function new(id:String, description:String) {
		this.id = id;
		this.description = description;
	}

	public final id:String;
	public final description:String;

	public function action(ctx:Context):Void {}
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
