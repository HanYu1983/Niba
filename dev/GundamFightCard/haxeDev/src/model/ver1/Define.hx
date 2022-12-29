package model.ver1;

using Lambda;

import haxe.ds.Option;
import model.ver1.DataPool;

// 實作hxbit.Serializable這個介面後並使用了@:s
// @:nullSafety就會出錯
class Player implements hxbit.Serializable {
	public function new(id:String) {
		this.id = id;
	}

	// @:s不能作用在interface
	// 不能用final
	// 不支援巢狀typedef
	@:s public var id:String;
}

class Card implements hxbit.Serializable {
	public function new(id:String) {
		this.id = id;
	}

	@:s public var id:String;
	@:s public var isFaceUp = false;
	@:s public var isTap = false;
	@:s public var protoId = "unknown";
}

class CardStack implements hxbit.Serializable {
	public function new(id:String) {
		this.id = id;
	}

	@:s public var id:String;
	@:s public var cardIds:Array<String> = [];
}

class Table implements hxbit.Serializable {
	public function new() {}

	@:s public var cards:Map<String, Card> = [];
	@:s public var cardStacks:Map<String, CardStack> = [];
}

enum Phase {
	Pending;
	Test(str:String);
}

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
	@:s public var phase:Phase = Pending;
	@:s public var cardProtoPool:Map<String, AbstractCardProto> = [];
	@:s public var memory:Memory = {
		playerSelection: {
			cardIds: []
		}
	};
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

class Require {
	public function new(id:String, description:String) {
		this.id = id;
		this.description = description;
	}

	public final id:String;
	public final description:String;

	public function action(ctx:Context, runtime:ExecuteRuntime):Void {}
}

class RequireUserSelect<T> extends Require {
	public function new(id:String, description:String) {
		super(id, description);
	}

	public var tips:Array<T> = [];
	public var responsePlayerId = RelativePlayer.You;
}

class CardText {
	public function new(id:String, description:String) {
		this.id = id;
		this.description = description;
	}

	public final id:String;
	public final description:String;

	public function getEffect(ctx:Context, runtime:ExecuteRuntime):Array<MarkEffect> {
		return [];
	}

	public function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		return [];
	}

	public function action(ctx:Context, runtime:ExecuteRuntime):Void {}

	public function onEvent(ctx:Context, runtime:ExecuteRuntime):Void {}
}

enum MarkType {
	Pending;
	AttachCard(cardId:String);
	Token(cardId:String);
}

enum MarkCause {
	Pending;
	CardEffect(fromCardId:String);
}

enum MarkEffect {
	AddBattlePoint(cardId:String, battlePoint:BattlePoint);
	AttackSpeed(cardId:String, speed:Int);
	AddText(cardID:String, text:CardText);
}

class Mark implements hxbit.Serializable {
	public function new(id:String, type:MarkType, cause:MarkCause) {
		this.id = id;
		this.type = type;
		this.cause = cause;
	}

	@:s public var id:String;
	@:s public var type = MarkType.Pending;
	@:s public var cause = MarkCause.Pending;

	public function getEffect(ctx:Context):Array<MarkEffect> {
		return [];
	}
}

interface ExecuteRuntime {
	function getCardId():String;
	function getSelectedCard(id:String):Array<String>;
}

class DefaultExecuteRuntime implements ExecuteRuntime {
	public function new() {}

	public var cardId = "";

	public function getCardId():String {
		return cardId;
	}

	public function getSelectedCard(id:String):Array<String> {
		return [];
	}
}

interface ICardProto {
	function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText>;
}

class AbstractCardProto implements ICardProto implements hxbit.Serializable {
	public function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [];
	}
}

//
enum GColor {
	Red;
}

// Alg

@:nullSafety
function registerCardProto(ctx:Context, key:String, proto:AbstractCardProto) {
	ctx.cardProtoPool[key] = proto;
}

@:nullSafety
function getCurrentCardProto(ctx:Context, key:String):ICardProto {
	final obj = ctx.cardProtoPool[key];
	if (obj == null) {
		return getCardProto(key);
	}
	return obj;
}

@:nullSafety
function getUnitOfSetGroup(ctx:Context, cardId:String):Option<String> {
	return None;
}

@:nullSafety
function mapRuntimeText<T>(ctx:Context, mapFn:(runtime:ExecuteRuntime, text:CardText) -> T):Array<T> {
	final runtime = new DefaultExecuteRuntime();
	// 原始內文
	final originReturn = [
		for (card in ctx.table.cards) {
			runtime.cardId = card.id;
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime)) {
				mapFn(runtime, text);
			}
		}
	];
	// 計算常駐能力新增內文
	final originMarkEffects = [
		for (card in ctx.table.cards) {
			runtime.cardId = card.id;
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime)) {
				for (effect in text.getEffect(ctx, runtime)) {
					effect;
				}
			}
		}
	];
	final attachTextEffect = originMarkEffects.filter(effect -> {
		return switch effect {
			case AddText(_, _):
				true;
			case _:
				false;
		}
	});
	final addedReturn = attachTextEffect.map(effect -> {
		final info = switch effect {
			case AddText(cardId, text):
				{
					cardId: cardId,
					text: text
				};
			case _:
				throw new haxe.Exception("xxx");
		}
		runtime.cardId = info.cardId;
		return mapFn(runtime, info.text);
	});
	// 計算效果新增內文
	final globalMarkEffects = [
		for (mark in ctx.marks)
			for (effect in mark.getEffect(ctx))
				effect
	];
	final globalAttachTextEffect = globalMarkEffects.filter(effect -> {
		return switch effect {
			case AddText(_, _):
				true;
			case _:
				false;
		}
	});
	final globalAddedReturn = globalAttachTextEffect.map(effect -> {
		final info = switch effect {
			case AddText(cardId, text):
				{
					cardId: cardId,
					text: text
				};
			case _:
				throw new haxe.Exception("xxx");
		}
		runtime.cardId = info.cardId;
		return mapFn(runtime, info.text);
	});
	return originReturn.concat(addedReturn).concat(globalAddedReturn);
}

// Requires

class RequirePhase extends Require {
	public function new(id:String, description:String, phase:Phase) {
		super(id, description);
		this.phase = phase;
	}

	public final phase:Phase;

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		if (ctx.phase != this.phase) {
			throw new haxe.Exception("xxx");
		}
	}
}

@:nullSafety
class RequireG extends RequireUserSelect<String> {
	public function new(id:String, description:String, colors:Array<GColor>, ctx:Context, runtime:ExecuteRuntime) {
		super(id, description);
		trace("查G的ID");
		this.tips = ["0", "1"];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final select = runtime.getSelectedCard(this.id);
		if (select == null) {
			throw new haxe.Exception("還沒選好牌");
		}
		trace("横置選中的卡");
	}
}

@:nullSafety
class ForceTargetCard extends Require {
	public function new(id:String, description:String, selectKey:String, cardId:String) {
		super(id, description);
		this.selectKey = selectKey;
		this.cardId = cardId;
	}

	public final cardId:String;
	public final selectKey: String;

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final selectCard = ctx.table.cards[cardId];
		if (selectCard == null) {
			throw new haxe.Exception('指定的卡不存在: ${cardId}');
		}
		ctx.memory.playerSelection.cardIds[this.selectKey] = [cardId];
	}
}
