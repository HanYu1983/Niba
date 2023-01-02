package model.ver1.game.define;

import haxe.Exception;
import haxe.EnumTools;
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

private class Wrapper implements hxbit.Serializable {
	public function new() {}

	@:s public var hold:BaSyou;
}

function getCardStackId(obj:BaSyou):String {
	return switch obj {
		case Default(playerId, kw):
			return '${playerId}@@@${EnumValueTools.getName(kw)}';
	}
}

function getBaSyou(cardStackId:String):BaSyou {
	try {
		final pair = cardStackId.split("@@@");
		final playerId = pair[0];
		final kw = EnumTools.createByName(BaSyouKeyword, pair[1]);
		return Default(playerId, kw);
	} catch (e) {
		throw new haxe.Exception('getBaSyou error: ${cardStackId} not right; ${e}');
	}
}

function test() {
	final b1 = BaSyou.Default("0", HonGoku);
	final csId = getCardStackId(b1);
	trace(csId);
	final b2 = getBaSyou(csId);
	if (EnumValueTools.equals(b1, b2) == false) {
		throw new haxe.Exception("b1 must equals b2");
	}
	try {
		getBaSyou("dd");
		throw new haxe.Exception("must throw error");
	} catch (e) {
		// success
	}
	final b3 = BaSyou.Default("0", HonGoku);
	final csId3 = getCardStackId(b3);
	if (csId != csId3) {
		throw "csId != csId3";
	}
}
