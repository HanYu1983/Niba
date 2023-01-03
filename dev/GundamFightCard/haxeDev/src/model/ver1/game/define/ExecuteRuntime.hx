package model.ver1.game.define;

import model.ver1.game.define.Define;

interface ExecuteRuntime {
	function getCardId():String;
	function getResponsePlayerId():String;
}

class AbstractExecuteRuntime implements ExecuteRuntime {
	public function new() {}

	public function getCardId():String {
		throw new haxe.Exception("not support");
	}

	public function getResponsePlayerId():String {
		throw new haxe.Exception("not support");
	}
}

class SystemExecuteRuntime extends AbstractExecuteRuntime {
	public function new(responsePlayerId:String) {
		super();
		this.responsePlayerId = responsePlayerId;
	}

	public final responsePlayerId:String;

	public override function getResponsePlayerId():String {
		return responsePlayerId;
	}
}

class DefaultExecuteRuntime extends AbstractExecuteRuntime {
	public function new(cardId:String, responsePlayerId:String) {
		super();
		this.cardId = cardId;
		this.responsePlayerId = responsePlayerId;
	}

	public final cardId:String;
	public final responsePlayerId:String;

	public override function getCardId():String {
		return cardId;
	}

	public override function getResponsePlayerId():String {
		return responsePlayerId;
	}
}
