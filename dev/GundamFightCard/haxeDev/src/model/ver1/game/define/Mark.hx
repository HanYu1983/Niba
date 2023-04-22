package model.ver1.game.define;

import model.ver1.game.define.Define;

class Mark<Ctx, Eff> implements hxbit.Serializable {
	public function new(id:String) {
		this.id = id;
	}

	@:s public var id:String;

	public function getEffect(ctx:Ctx):Array<Eff> {
		return [];
	}

	public function onEvent(ctx:Ctx, event:Event):Void {}
}
