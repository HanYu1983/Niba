package model.ver1.game.define;

import tool.Helper;

enum BaSyouKeyword {
	// 本国
	HonGoku;
	// 捨て山
	SuteYama;
	// 宇宙エリア
	SpaceArea;
	// 地球エリア
	EarchArea;
	// 配備エリア
	MaintenanceArea;
	// Gゾーン
	GZone;
	// ジャンクヤード
	JunkYard;
	// 手札
	TeHuTa;
	// ハンガー
	Hanger;
	// プレイされたカード
	PlayedCard;
	// 取り除かれたカード
	RemovedCard;
}

function isBattleArea(k:BaSyouKeyword) {
	return switch k {
		case SpaceArea | EarchArea:
			true;
		case _:
			false;
	}
}

function isMaintenanceArea(k:BaSyouKeyword) {
	return switch k {
		case MaintenanceArea | GZone:
			true;
		case _:
			false;
	}
}

function isBa(k:BaSyouKeyword) {
	if (isBattleArea(k)) {
		return true;
	}
	if (isMaintenanceArea(k)) {
		return true;
	}
	return false;
}

enum BaSyou {
	Default(playerId:String, baSyouKeyword:BaSyouKeyword);
}

// class CardStackKey implements hxbit.Serializable {
// 	public function new(playerId:String, baSyouKeyword:BaSyouKeyword) {
// 		this.playerId = playerId;
// 		this.baSyouKeyword = baSyouKeyword;
// 	}
// 	@:s public var playerId:String;
// 	@:s public var baSyouKeyword:BaSyouKeyword;
// }

function getCardStackId(obj:BaSyou):String {
	return getMemontoWithWrapper(obj);
}

function getBaSyou(cardStackId:String):BaSyou {
	return ofMemontoWithWrapper(cardStackId);
}
