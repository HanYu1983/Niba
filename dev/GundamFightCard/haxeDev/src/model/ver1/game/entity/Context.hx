package model.ver1.game.entity;

using Lambda;

import tool.Table;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Effect;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Define;
import model.ver1.game.define.CardProto;
import model.ver1.game.component.CutComponent;
import model.ver1.game.component.CardProtoPoolComponent;
import model.ver1.game.component.SelectionComponent;
import model.ver1.game.component.MarkComponent;
import model.ver1.game.component.TimingComponent;
import model.ver1.game.flowComponent.FlowComponent;


class Context implements IFlowComponent{
	public function new() {}

	public var playersOrder:Array<String> = [];
	public var table = new Table();
	public var marks:Map<String, Mark> = [];
	public var timing = Timing.Default(Reroll, None, Start);
	public var cardProtoPool:Map<String, CardProto> = [];
	public var playerSelection:PlayerSelection = {
		cardIds: []
	}
	public var cuts:Array<Array<String>> = [];
	public var effects:Map<String, Effect> = [];
	public var activePlayerId:String;
	public var flowMemory:FlowMemory = {
		state: PrepareDeck,
		hasTriggerEvent: false,
		hasPlayerPassPhase: new Map<String, Bool>(),
		hasPlayerPassCut: new Map<String, Bool>(),
		hasPlayerPassPayCost: new Map<String, Bool>(),
		shouldTriggerStackEffectFinishedEvent: false,
		msgs: [],
	};
}
