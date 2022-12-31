package model.ver1.game;

using Lambda;

import model.ver1.game.Define;

class Require {
	public function new(id:String, description:String) {
		this.id = id;
		this.description = description;
	}

	public final id:String;
	public final description:String;

	public function action(ctx:Context, runtime:ExecuteRuntime):Void {}
}

class RequireUserSelect<T> extends Require {
	public function new(id:String, description:String) {
		super(id, description);
	}

	public var tips:Array<T> = [];
	public var lengthInclude:Array<Int> = [1];
	public var responsePlayerId = RelativePlayer.You;
}

class RequireUserSelectCard extends RequireUserSelect<String> {
	public function new(id:String, description:String) {
		super(id, description);
	}
}

class RequireUserSelectBattlePoint extends RequireUserSelect<BattlePoint> {
	public function new(id:String, description:String) {
		super(id, description);
	}
}