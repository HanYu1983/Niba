package model.ver1.game.define;

abstract PlayerId(String) to String {
	public static final A = new PlayerId("A");
	public static final B = new PlayerId("B");

	inline function new(i:String) {
		this = i;
	}

	@:from inline static function fromString(s:String):PlayerId {
		if ([(A : String), (B : String)].contains(s) == false) {
			throw 'playerId (${s}) must be ${A} or ${B}';
		}
		return new PlayerId(s);
	}

	@:op(~A)
	public inline function getOpponentPlayerId():PlayerId {
		return this == PlayerId.A ? PlayerId.B : PlayerId.A;
	}
}
