package model.ver1.game.entity;

using Lambda;

import tool.Table;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Block;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Define;
import model.ver1.game.define.CardProto;
import model.ver1.game.component.CutComponent;
import model.ver1.game.component.BlockComponent;
import model.ver1.game.component.CardProtoPoolComponent;
import model.ver1.game.component.SelectionComponent;
import model.ver1.game.component.MarkComponent;
import model.ver1.game.component.TimingComponent;
import model.ver1.game.gameComponent.GameComponent;

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

class Context implements IGameComponent {
	public function new() {}

	public var playersOrder:Array<String> = [];
	public var table = new Table();
	public var marks:Map<String, Mark> = [];
	public var timing = Timing.Default(Reroll, None, Start);
	public var cardProtoPool:Map<String, CardProto> = [];
	public var playerSelection:PlayerSelection = {
		cardIds: []
	}
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
