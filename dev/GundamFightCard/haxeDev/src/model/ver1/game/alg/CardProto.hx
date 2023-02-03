package model.ver1.game.alg;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;

function registerCardProto(ctx:Context, key:String, proto:CardProto) {
	ctx.cardProtoPool[key] = proto;
}

function getCurrentCardProto(ctx:Context, key:String):CardProto {
	final obj = ctx.cardProtoPool[key];
	if (obj == null) {
		return model.ver1.game.data.DataBinding.getCardProto(key);
	}
	return obj;
}