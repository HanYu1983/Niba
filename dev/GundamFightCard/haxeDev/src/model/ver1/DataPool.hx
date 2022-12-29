package model.ver1;

import model.ver1.Define;

private final _cardProtoPool:Map<String, ICardProto> = [
    "179001_01A_CH_WT007R_white" => new CardProto_179001_01A_CH_WT007R_white(),
    "179003_01A_U_BK008U_black" => new CardProto_179003_01A_U_BK008U_black(),
];

@:nullSafety
function getCardProto(key:String):ICardProto {
	final obj = _cardProtoPool[key];
    if(obj == null){
        throw new haxe.Exception('${key} not found');
    }
	return obj;
}