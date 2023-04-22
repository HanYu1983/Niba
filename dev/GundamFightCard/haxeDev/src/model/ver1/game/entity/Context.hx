package model.ver1.game.entity;

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
import model.ver1.game.define.Player;
import model.ver1.game.define.Define;
import model.ver1.game.alg.CardProto;
import model.ver1.game.alg.Cut;
import model.ver1.game.entity.MarkEffect;
import model.ver1.game.entity.DefaultCardProto;
import model.ver1.game.entity.Flow;

class Context implements hxbit.Serializable implements ICardProtoPool<Context, MarkEffect> implements ICut {
	public function new() {}

	// @:s public var players:Map<String, Player> = [];
	@:s public var playersOrder:Array<String> = [];
	@:s public var table = new Table();
	@:s public var marks:Map<String, DefaultMark> = [];
	@:s public var timing = Timing.Default(Reroll, None, Start);
	@:s public var cardProtoPool:Map<String, DefaultCardProto> = [];
	@:s public var memory:Memory = {
		playerSelection: {
			cardIds: []
		}
	};
	// serializable不支援List
	@:s public var cuts:Array<Array<DefaultBlock>> = [];
	@:s public var flowMemory:FlowMemory = {
		state: PrepareDeck,
		hasTriggerEvent: false,
		hasPlayerPassPhase: new Map<String, Bool>(),
		hasPlayerPassCut: new Map<String, Bool>(),
		hasPlayerPassPayCost: new Map<String, Bool>(),
		shouldTriggerStackEffectFinishedEvent: false,
		msgs: [],
	};
	@:s public var activePlayerId:String;
}
