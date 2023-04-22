package model.ver1.game.alg;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;

interface ICardProtoPool<T, Eff> {
	var cardProtoPool:Map<String, CardProto<T, Eff>>;
}

function registerCardProto<T, Eff>(ctx:ICardProtoPool<T, Eff>, key:String, proto:CardProto<T, Eff>) {
	ctx.cardProtoPool[key] = proto;
}

function getCurrentCardProto<T, Eff>(ctx:ICardProtoPool<T, Eff>, key:String):CardProto<T, Eff> {
	final obj = ctx.cardProtoPool[key];
	if (obj == null) {
		// return model.ver1.game.data.DataBinding.getCardProto(key);

	}
	return obj;
}