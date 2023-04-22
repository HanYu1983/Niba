package model.ver1.game.component;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.CardProto;

interface ICardProtoPoolComponent {
	var cardProtoPool:Map<String, CardProto>;
}

function registerCardProto(ctx:ICardProtoPoolComponent, key:String, proto:CardProto) {
	ctx.cardProtoPool[key] = proto;
}

function getCurrentCardProto(ctx:ICardProtoPoolComponent, key:String):CardProto {
	final obj = ctx.cardProtoPool[key];
	if (obj == null) {
		return model.ver1.game.data.DataBinding.getCardProto(key);
	}
	return obj;
}
