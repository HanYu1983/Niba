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
// private class Wrapper implements hxbit.Serializable {
// 	public function new() {}
// 	@:s public var hold:BaSyou;
// }

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

enum abstract PlayerId(String) from String {
	var A;
	var B;
}

abstract BaSyou2(String) to String {
	static final _split = "_";

	inline function new(i:String) {
		this = i;
		// try
		// 	parse()
		// catch (e)
		// 	throw "XXX";
	}

	// @:to
	public function toCustom():{playerId:PlayerId, baSyouKeyword:BaSyouKeyword} {
		final pair = this.split(_split);
		final playerId:PlayerId = pair[0];
		final kw = EnumTools.createByName(BaSyouKeyword, pair[1]);
		return {playerId: playerId, baSyouKeyword: kw};
	}

	// @:from inline static public function fromString(v:String) {
	// 	return new BaSyou2(v);
	// }

	@:from inline static public function fromCustom(custom:{playerId:PlayerId, baSyouKeyword:BaSyouKeyword}) {
		return new BaSyou2('${custom.playerId}${_split}${EnumValueTools.getName(custom.baSyouKeyword)}');
	}
}

abstract BaSyou3({playerId:PlayerId, baSyouKeyword:BaSyouKeyword}) from {playerId:PlayerId, baSyouKeyword:BaSyouKeyword} {
	static final _split = "_";

	inline function new(i:{playerId:PlayerId, baSyouKeyword:BaSyouKeyword}) {
		this = i;
	}

	@:to inline function toString():String {
		return '${this.playerId}${_split}${EnumValueTools.getName(this.baSyouKeyword)}';
	}

	@:from inline static function fromString(v:String) {
		try {
			final pair = v.split(_split);
			final playerId:PlayerId = pair[0];
			final kw = EnumTools.createByName(BaSyouKeyword, pair[1]);
			return new BaSyou3({playerId: playerId, baSyouKeyword: kw});
		} catch (e) {
			throw "unknown key";
		}
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

	// final b4 = ("0_PlayedCard" : BaSyou2);
	final b5:BaSyou2 = {playerId: PlayerId.A, baSyouKeyword: Hanger};
	switch b5.toCustom() {
		case {playerId: _, baSyouKeyword: kw}:
			trace("XX");
	}
	final h = [(b5 : String) => 1];
	trace(h["A_Hanger"]);

	final b6:BaSyou3 = {playerId: PlayerId.A, baSyouKeyword: Hanger};
	final h2 = [(b6 : String) => 1];
	trace(h2["A_Hanger"]);

	final b7:BaSyou3 = "A_Hanger";
}
