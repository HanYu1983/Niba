package model.ver1.game;

import tool.Table;
import model.ver1.game.Define;
import model.ver1.game.Timing;

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
