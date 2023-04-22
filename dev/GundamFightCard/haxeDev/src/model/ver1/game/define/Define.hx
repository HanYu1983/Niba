package model.ver1.game.define;

import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Require;

// Context
// Player
// 實作hxbit.Serializable這個介面後並使用了@:s
// @:nullSafety就會出錯
// hxbit.Serializable不支援EnumValueMap
// class Player {
// 	public function new(id:String) {
// 		this.id = id;
// 	}
// 	// @:s不能作用在interface
// 	// 不能用final
// 	// 不支援巢狀typedef
// 	public var id:String;
// }
// function getOpponentPlayerId(playerId:String):String {
// 	return playerId == PlayerId.A ? PlayerId.B : PlayerId.A;
// }
// General

enum TextTypeAutomaticType {
	// 常駐
	Resident;
	// 起動
	Trigger;
	// 恒常
	Constant;
}

enum TextType {
	// 自動型
	Automatic(type:TextTypeAutomaticType);
	// 使用型
	Use;
	// 特殊型
	Special;
}

enum CardCategory {
	Unit;
	Character;
	Command;
	Operation;
	OperationUnit;
	Graphic;
	Ace;
}

enum CardEntityCategory {
	Unit;
	Character;
	Operation;
	G;
}

enum GColor {
	Red;
	Black;
	Purple;
}

enum GProperty {
	Uc;
	Zero8;
}

enum GSign {
	Default(color:GColor, property:GProperty);
}

enum BattlePoint {
	Default(melee:Int, range:Int, hp:Int);
}

enum RelativePlayer {
	You;
	Opponent;
}

interface IContext {}