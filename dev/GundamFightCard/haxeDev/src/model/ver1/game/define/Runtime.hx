package model.ver1.game.define;

import haxe.ds.Option;
import model.ver1.game.define.Define;
import model.ver1.game.define.Player;

interface Runtime {
	function getCardId():String;
	function getResponsePlayerId():PlayerId;
}

class AbstractRuntime implements Runtime {
	public function getCardId():String {
		throw new haxe.Exception("not support");
	}

	public function getResponsePlayerId():PlayerId {
		throw new haxe.Exception("not support");
	}
}

class SystemRuntime extends AbstractRuntime {
	public function new(responsePlayerId:Option<String>) {
		this.responsePlayerId = responsePlayerId;
	}

	public final responsePlayerId:Option<String>;

	public override function getResponsePlayerId():PlayerId {
		switch responsePlayerId {
			case None:
				throw new haxe.Exception("no need playerId");
			case Some(playerId):
				return playerId;
		}
	}
}

class DefaultRuntime extends AbstractRuntime {
	public function new(cardId:String, responsePlayerId:PlayerId) {
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
