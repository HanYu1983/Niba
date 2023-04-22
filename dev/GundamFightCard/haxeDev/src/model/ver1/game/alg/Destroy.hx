package model.ver1.game.alg;

using Lambda;

import model.ver1.game.define.Define;

interface IDestroy {

}

function isDestroyNow(ctx:IDestroy, cardId:String, condition:{isByBattleDamage:Bool}):Bool {
	// cardId是否有破壞並廢棄的效果在堆疊中
	if (condition.isByBattleDamage) {}
	return false;
}

function removeDestroyEffect(ctx:IDestroy, cardId:String):Void {
	trace("移除堆疊中的破壞效果");
}