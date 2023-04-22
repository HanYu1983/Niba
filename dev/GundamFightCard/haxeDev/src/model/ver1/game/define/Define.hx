package model.ver1.game.define;

import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Require;

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