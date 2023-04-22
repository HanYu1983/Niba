package model.ver1.game.entity;

using Lambda;

import tool.Table;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Block;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Define.IContext;
import model.ver1.game.define.CardProto;
import model.ver1.game.component.Cut;
import model.ver1.game.component.Block;
import model.ver1.game.component.CardProto;

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

class Context  implements IContext implements ICutComponent implements IBlockComponent implements ICardProtoComponent{
	public function new() {}

	public var playersOrder:Array<String> = [];
	public var table = new Table();
	public var marks:Map<String, Mark> = [];
	public var timing = Timing.Default(Reroll, None, Start);
	public var cardProtoPool:Map<String, CardProto> = [];
	public var memory:Memory = {
		playerSelection: {
			cardIds: []
		}
	};
	public var cuts:Array<Array<Block>> = [];
	public var flowMemory:FlowMemory = {
		state: PrepareDeck,
		hasTriggerEvent: false,
		hasPlayerPassPhase: new Map<String, Bool>(),
		hasPlayerPassCut: new Map<String, Bool>(),
		hasPlayerPassPayCost: new Map<String, Bool>(),
		shouldTriggerStackEffectFinishedEvent: false,
		msgs: [],
	};
	public var activePlayerId:String;
}

function isDestroyNow(ctx:Context, cardId:String, condition:{isByBattleDamage:Bool}):Bool {
	// cardId是否有破壞並廢棄的效果在堆疊中
	if (condition.isByBattleDamage) {}
	return false;
}

function removeDestroyEffect(ctx:Context, cardId:String):Void {
	trace("移除堆疊中的破壞效果");
}
