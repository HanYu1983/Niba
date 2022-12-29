package model.ver1;

import model.ver1.Define;

private final _cardProtoPool:Map<String, ICardProto> = [];

@:nullSafety
function registerCardProto(key:String, proto:ICardProto) {
	_cardProtoPool[key] = proto;
}

@:nullSafety
function getCardProto(key:String):ICardProto {
	final obj = _cardProtoPool[key];
    if(obj == null){
        throw new haxe.Exception('${key} not found');
    }
	return obj;
}
