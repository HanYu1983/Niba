package model.ver1.game.define;

import model.ver1.game.define.Define;
import model.ver1.game.define.Player;

interface ExecuteRuntime {
	function getCardId():String;
	function getResponsePlayerId():PlayerId;
}

class AbstractExecuteRuntime implements ExecuteRuntime {
	public function new() {}

	public function getCardId():String {
		throw new haxe.Exception("not support");
	}

	public function getResponsePlayerId():PlayerId {
		throw new haxe.Exception("not support");
	}
}

class SystemExecuteRuntime extends AbstractExecuteRuntime {
	public function new(responsePlayerId:String) {
		super();
		this.responsePlayerId = responsePlayerId;
	}

	public final responsePlayerId:String;

	public override function getResponsePlayerId():PlayerId {
		return responsePlayerId;
	}
}

class DefaultExecuteRuntime extends AbstractExecuteRuntime {
	public function new(cardId:String, responsePlayerId:PlayerId) {
		super();
		this.cardId = cardId;
		this.responsePlayerId = responsePlayerId;
	}

	public final cardId:String;
	public final responsePlayerId:PlayerId;

	public override function getCardId():String {
		return cardId;
	}

	public override function getResponsePlayerId():PlayerId {
		return responsePlayerId;
	}
}
