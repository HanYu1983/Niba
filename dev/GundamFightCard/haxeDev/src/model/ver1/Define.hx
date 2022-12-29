package model.ver1;

using Lambda;

import haxe.EnumTools;
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
	@:s public var owner = "unknown";
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

enum BlockCause {
	Pending;
	System;
	PlayCard(cardId:String);
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
	@:s public var immediateStack:Array<Block> = [];
	@:s public var effectStack:Array<Block> = [];
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

	public function onEvent(ctx:Context, runtime:ExecuteRuntime):Void {}
}

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
}

interface ExecuteRuntime {
	function getCardId():String;
	function getPlayerId():String;
}

@:nullSafety
class DefaultExecuteRuntime implements ExecuteRuntime {
	public function new(cardId:String, playerId:String) {
		this.cardId = cardId;
		this.playerId = playerId;
	}

	public var cardId:String;
	public var playerId:String;

	public function getCardId():String {
		return cardId;
	}

	public function getPlayerId():String {
		return "";
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
	Black;
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
function isDestroyNow(ctx:Context, cardId:String, condition:{isByBattleDamage:Bool}):Bool {
	// cardId是否有破壞並廢棄的效果在堆疊中
	if (condition.isByBattleDamage) {}
	return false;
}

@:nullSafety
function removeDestroyEffect(ctx:Context, cardId:String):Void {
	trace("移除堆疊中的破壞效果");
}

@:nullSafety
function becomeG(ctx:Context, cardId:String):Void {
	trace("將自己變成G");
}

@:nullSafety
function getUnitOfSetGroup(ctx:Context, cardId:String):Option<String> {
	return None;
}

function getBlocks(ctx:Context):Array<Block> {
	return ctx.effectStack.concat(ctx.immediateStack);
}

function getBlock(ctx:Context, blockId:String):Block {
	final blocks = getBlocks(ctx);
	final findBlock = blocks.filter(block -> block.id == blockId);
	if (findBlock.length == 0) {
		throw new haxe.Exception("block not found");
	}
	return findBlock[0];
}

function getBlockRuntime(ctx:Context, playerId:String, blockId:String):ExecuteRuntime {
	final block = getBlock(ctx, blockId);
	return switch block.cause {
		case System:
			new DefaultExecuteRuntime("0", playerId);
		case PlayCard(cardId):
			new DefaultExecuteRuntime(cardId, playerId);
		case PlayText(cardId, textId):
			new DefaultExecuteRuntime(cardId, playerId);
		case TextEffect(cardId, textId):
			new DefaultExecuteRuntime(cardId, playerId);
		case _:
			new DefaultExecuteRuntime("0", playerId);
	}
}

function removeBlock(ctx:Context, blockId:String):Void {
	final block = getBlock(ctx, blockId);
	ctx.effectStack.remove(block);
	ctx.immediateStack.remove(block);
}

@:nullSafety
function getRuntimeText(ctx:Context, playerId:String):Array<{runtime:ExecuteRuntime, text:CardText}> {
	final ret = new Array<{runtime:ExecuteRuntime, text:CardText}>();
	// 原始內文
	final originReturn = [
		for (card in ctx.table.cards) {
			final runtime = new DefaultExecuteRuntime(card.id, playerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime)) {
				ret.push({
					runtime: runtime,
					text: text
				});
			}
		}
	];
	// 計算常駐能力新增內文
	final originMarkEffects = [
		for (card in ctx.table.cards) {
			final runtime = new DefaultExecuteRuntime(card.id, playerId);
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
				throw new haxe.Exception("addedReturn xxx");
		}
		final runtime = new DefaultExecuteRuntime(info.cardId, playerId);
		ret.push({
			runtime: runtime,
			text: info.text
		});
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
				throw new haxe.Exception("globalAddedReturn xxx");
		}
		final runtime = new DefaultExecuteRuntime(info.cardId, playerId);
		ret.push({
			runtime: runtime,
			text: info.text
		});
	});
	return ret;
}

// 常駐增強內文
function getAddBattlePoint(ctx:Context, playerId:String) {
	// TODO
	final infos = [
		for (info in getRuntimeText(ctx, playerId)) {
			final runtime = info.runtime;
			final text = info.text;
			final effects = text.getEffect(ctx, runtime);
			for (effect in effects) {
				switch effect {
					case AddBattlePoint(cardId, battlePoint):
						{
							cardId: cardId,
							battlePoint: battlePoint
						};
					case _:
						null;
				}
			}
		}
	];
}

// 速攻
function getAttackSpeed(ctx:Context, playerId:String) {
	// TODO
	final infos = [
		for (info in getRuntimeText(ctx, playerId)) {
			final runtime = info.runtime;
			final text = info.text;
			final effects = text.getEffect(ctx, runtime);
			for (effect in effects) {
				switch effect {
					case AttackSpeed(cardId, speed):
						{
							cardId: cardId,
							speed: speed
						};
					case _:
						null;
				}
			}
		}
	];
}

// Requires

class RequirePhase extends Require {
	public function new(id:String, description:String, phase:Phase) {
		super(id, description);
		this.phase = phase;
	}

	public final phase:Phase;

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		if (EnumValueTools.equals(ctx.phase, phase) == false) {
			throw new haxe.Exception('ctx.phase != this.phase: ${ctx.phase} != ${phase}');
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
		// final select = runtime.getSelectedCard(this.id);
		// if (select == null) {
		// 	throw new haxe.Exception("還沒選好牌");
		// }
		// trace("横置選中的卡");
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
	public final selectKey:String;

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final selectCard = ctx.table.cards[cardId];
		if (selectCard == null) {
			throw new haxe.Exception('指定的卡不存在: ${cardId}');
		}
		ctx.memory.playerSelection.cardIds[this.selectKey] = [cardId];
	}
}
