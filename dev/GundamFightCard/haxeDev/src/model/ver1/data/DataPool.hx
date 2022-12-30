package model.ver1.data;

import model.ver1.game.Define;

private final _cardProtoPool:Map<String, ICardProto> = [
	"179001_01A_CH_WT007R_white" => new CardProto_179001_01A_CH_WT007R_white(),
	"179003_01A_U_BK008U_black" => new CardProto_179003_01A_U_BK008U_black(),
	"179004_01A_CH_WT009R_white" => new CardProto_179004_01A_CH_WT009R_white(),
];

@:nullSafety
function getCardProto(key:String):ICardProto {
	final obj = _cardProtoPool[key];
	if (obj == null) {
		throw new haxe.Exception('${key} not found');
	}
	return obj;
}
