package model.ver1.game.define;

abstract BattlePoint(Array<Any>) to Array<Any> {
	inline function new(i:Array<Any>) {
		this = i;
	}

	@:from inline static function fromArray(s:Array<Any>):BattlePoint {
		if (s.length != 3) {
			throw 'length must be 3';
		}
		for (v in s) {
			if (v is String) {
				if (v != "*") {
					throw 'string must be *';
				}
			} else if (v is Int) {
				// pass
			} else {
				throw 'must be * or int';
			}
		}
		return new BattlePoint(s);
	}

	public function getMelee():Int {
		final v = this[0];
		return if (v is String) {
			0;
		} else if (v is Int) {
			v;
		} else {
			throw 'must be * or int';
		}
	}

	public function getRange():Int {
		final v = this[1];
		return if (v is String) {
			0;
		} else if (v is Int) {
			v;
		} else {
			throw 'must be * or int';
		}
	}

	public function getHp():Int {
		final v = this[2];
		return if (v is String) {
			0;
		} else if (v is Int) {
			v;
		} else {
			throw 'must be * or int';
		}
	}

	public function getValue():Array<Int> {
		return this.map(v -> {
			if (v is String) {
				return 0;
			} else if (v is Int) {
				return v;
			} else {
				throw 'must be * or int';
			}
		});
	}
}
