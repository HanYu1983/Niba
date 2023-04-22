package model.ver1.game.alg;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.CardProto;
import model.ver1.game.entity.Context;

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