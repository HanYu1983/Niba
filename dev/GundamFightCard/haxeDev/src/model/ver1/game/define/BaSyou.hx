package model.ver1.game.define;

import haxe.Exception;
import haxe.EnumTools;
import tool.Helper;
import model.ver1.game.define.Player;

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

abstract BaSyouId(String) to String {
	static final _split = "@@@";

	inline function new(i:String) {
		this = i;
	}

	@:to public function toBaSyou():BaSyou {
		try {
			final pair = this.split(_split);
			final playerId:PlayerId = pair[0];
			final kw = EnumTools.createByName(BaSyouKeyword, pair[1]);
			return Default(playerId, kw);
		} catch (e) {
			trace(e);
			throw 'can not parse BaSyou (${this}), because ${e}';
		}
	}

	@:from inline static public function fromString(v:String) {
		final ret = new BaSyouId(v);
		ret.toBaSyou();
		return ret;
	}

	@:from inline static public function fromBaSyou(baSyou:BaSyou) {
		return switch baSyou {
			case Default(playerId, baSyouKeyword):
				new BaSyouId('${playerId}${_split}${EnumValueTools.getName(baSyouKeyword)}');
		}
	}
}

function test() {
	final b1 = BaSyou.Default(PlayerId.A, HonGoku);
	final csId = (b1 : BaSyouId);
	trace(csId);
	final b2:BaSyou = csId;
	if (EnumValueTools.equals(b1, b2) == false) {
		throw new haxe.Exception("b1 must equals b2");
	}
	final b3 = BaSyou.Default(PlayerId.A, HonGoku);
	final csId3 = (b3 : BaSyouId);
	if (csId != csId3) {
		throw "csId != csId3";
	}

	final b4 = ("A@@@Hanger" : BaSyouId);
	final b5:BaSyouId = BaSyou.Default(PlayerId.A, Hanger);
	switch (b5 : BaSyou) {
		case Default(_, _):
			trace("XX");
	}
	final h = [(b5 : String) => 1];
	trace(h["A@@@Hanger"]);
}
