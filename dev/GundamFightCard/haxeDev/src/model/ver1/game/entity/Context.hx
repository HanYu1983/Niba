package model.ver1.game.entity;

using Lambda;
import tool.Table;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Block;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Define.IContext;
import model.ver1.game.define.CardProto;

enum FlowMemoryState {
	PrepareDeck;
	WhoFirst;
	Draw6AndConfirm;
	Playing;
}

typedef Message = Any;

typedef FlowMemory = {
	state:FlowMemoryState,
	hasTriggerEvent:Bool,
	hasPlayerPassPhase:Map<String, Bool>,
	hasPlayerPassCut:Map<String, Bool>,
	hasPlayerPassPayCost:Map<String, Bool>,
	shouldTriggerStackEffectFinishedEvent:Bool,
	msgs:Array<Message>,
}

typedef PlayerSelection = {
	cardIds:Map<String, Array<String>>
}

typedef Memory = {
	playerSelection:PlayerSelection
}

class Context implements hxbit.Serializable implements IContext {
	public function new() {}

	// @:s public var players:Map<String, Player> = [];
	@:s public var playersOrder:Array<String> = [];
	@:s public var table = new Table();
	@:s public var marks:Map<String, Mark> = [];
	@:s public var timing = Timing.Default(Reroll, None, Start);
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
