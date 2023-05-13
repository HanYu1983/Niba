package model.ver1.game.define;

using Lambda;

import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Require;
import model.ver1.game.define.Timing;

enum RelativePlayer {
	You;
	Opponent;
}

enum AbsoluteUseTiming {
	Any;
	Draw;
	Reroll;
	Maintenance;
	Battle;
	Attack;
	Defense;
	DamageChecking;
	Return;
}

enum RelativeUseTiming {
	Turn;
	Draw;
	Reroll;
	Maintenance;
	Battle;
	Attack;
	Defense;
	DamageChecking;
	Return;
}

enum UseTiming {
	Absolute(timing:AbsoluteUseTiming);
	Relative(relativePlayer:RelativePlayer, timing:RelativeUseTiming);
}

enum TextTypeAutomaticType {
	// 常駐
	Resident;
	// 起動
	Trigger;
	// 恒常
	Constant;
}

enum TextTypeSpecialType {
	// 高機動
	HighMobility;
	// 速攻
	Haste;
	// サイコミュ
	Psycommu(power:Int);
	// 強襲
	Assault;
	// 範囲兵器
	RangeWeapons(power:Int);
	// ゲイン
	Gain;
	// 改装
	Refit(name:String);
	// 共有
	Share(name:String);
	// 供給
	Supply;
	// クロスウェポン
	CrossWeapon(name:String);
	// PS装甲
	PSArmor;
	// クイック
	Quick;
	// 戦闘配備
	CombatDeployment;
	// ステイ
	Stay;
	// 1枚制限
	Limit1;
}

enum TextType {
	// 自動型
	Automatic(type:TextTypeAutomaticType);
	// 使用型
	Use(timing:UseTiming);
	// 特殊型
	Special(type:TextTypeSpecialType);
	// PlayCard
	PlayCard(timing:UseTiming);
	//
	System;
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

enum RollCost {}

enum DamageType {
	// 普通傷害(傷判以外的傷害)
	Normal;
	// 戰鬥傷害(傷判的傷害)
	Battle(speed:Int);
}

// p71
enum DestroyReason {
	Damage(type:DamageType, playerId:String);
}



// typedef DestroyReason = {
// 	playerId:String;
// }
