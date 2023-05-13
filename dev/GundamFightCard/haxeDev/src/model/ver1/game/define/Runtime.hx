package model.ver1.game.define;

import haxe.ds.Option;
import model.ver1.game.define.Define;
import model.ver1.game.define.Player;

interface Runtime {
	function getCardId():String;
	function getResponsePlayerId():PlayerId;
	function getResponsePlayerIdOption():Option<PlayerId>;
}

class AbstractRuntime implements Runtime {
	public function getCardId():String {
		throw new haxe.Exception("not support");
	}

	public function getResponsePlayerId():PlayerId {
		throw new haxe.Exception("not support");
	}

	public function getResponsePlayerIdOption():Option<PlayerId> {
		throw new haxe.Exception("not support");
	}
}

class SystemRuntime extends AbstractRuntime {
	public function new(responsePlayerId:Option<PlayerId>) {
		this.responsePlayerId = responsePlayerId;
	}

	public final responsePlayerId:Option<PlayerId>;

	public override function getResponsePlayerId():PlayerId {
		switch getResponsePlayerIdOption() {
			case None:
				throw new haxe.Exception("no need playerId");
			case Some(playerId):
				return playerId;
		}
	}

	public override function getResponsePlayerIdOption():Option<PlayerId> {
		return responsePlayerId;
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

	public override function getResponsePlayerIdOption():Option<PlayerId> {
		return Some(responsePlayerId);
	}
}
