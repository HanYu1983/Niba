package model.ver1.game.alg;

using Lambda;

import model.ver1.game.define.Define;
import model.ver1.game.entity.Context;

function isDestroyNow(ctx:Context, cardId:String, condition:{isByBattleDamage:Bool}):Bool {
	// cardId是否有破壞並廢棄的效果在堆疊中
	if (condition.isByBattleDamage) {}
	return false;
}

function removeDestroyEffect(ctx:Context, cardId:String):Void {
	trace("移除堆疊中的破壞效果");
}