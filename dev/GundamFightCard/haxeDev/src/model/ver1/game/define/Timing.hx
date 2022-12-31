package model.ver1.game.define;

import haxe.ds.Option;
import tool.Helper;

enum TurnKeyword {
	You;
	Opponent;
}

enum PhaseKeyword {
	Reroll;
	Draw;
	Maintenance;
	Battle;
}

enum StepKeyword {
	Attack;
	Defense;
	DamageChecking;
	Return;
	End;
}

enum TimingKeyword {
	Start;
	Free1;
	Rule;
	Free2;
	End;
	DamageReset;
	ResolveEffect;
	AdjustHand;
	TurnEnd;
}

enum Timing {
	Default(phase:PhaseKeyword, step:Option<StepKeyword>, timing:TimingKeyword);
}

final TIMINGS = [
	// Reroll
	Timing.Default(Reroll, None, Start),
	Timing.Default(Reroll, None, Rule),
	Timing.Default(Reroll, None, Free2),
	Timing.Default(Reroll, None, End),
	// Draw
	Timing.Default(Draw, None, Start),
	Timing.Default(Draw, None, Free1),
	Timing.Default(Draw, None, Rule),
	Timing.Default(Draw, None, Free2),
	Timing.Default(Draw, None, End),
	// Maintenance
	Timing.Default(Maintenance, None, Start),
	Timing.Default(Maintenance, None, Free1),
	Timing.Default(Maintenance, None, End),
	// Attack
	Timing.Default(Battle, Some(Attack), Start),
	Timing.Default(Battle, Some(Attack), Free1),
	Timing.Default(Battle, Some(Attack), Rule),
	Timing.Default(Battle, Some(Attack), Free2),
	Timing.Default(Battle, Some(Attack), End),
	// Defense
	Timing.Default(Battle, Some(Defense), Start),
	Timing.Default(Battle, Some(Defense), Free1),
	Timing.Default(Battle, Some(Defense), Rule),
	Timing.Default(Battle, Some(Defense), Free2),
	Timing.Default(Battle, Some(Defense), End),
	// DamageChecking
	Timing.Default(Battle, Some(DamageChecking), Start),
	Timing.Default(Battle, Some(DamageChecking), Free1),
	Timing.Default(Battle, Some(DamageChecking), Rule),
	Timing.Default(Battle, Some(DamageChecking), Free2),
	Timing.Default(Battle, Some(DamageChecking), End),
	// Return
	Timing.Default(Battle, Some(Return), Start),
	Timing.Default(Battle, Some(Return), Free1),
	Timing.Default(Battle, Some(Return), Rule),
	Timing.Default(Battle, Some(Return), Free2),
	//
	Timing.Default(Battle, Some(End), DamageReset),
	Timing.Default(Battle, Some(End), ResolveEffect),
	Timing.Default(Battle, Some(End), AdjustHand),
	Timing.Default(Battle, Some(End), TurnEnd),
];

// class Timing implements hxbit.Serializable {
// 	public function new(phase:PhaseKeyword, step:Option<StepKeyword>, timing:TimingKeyword) {
// 		this.phase = phase;
// 		this.step = step;
// 		this.timing = timing;
// 	}
// 	@:s public var phase:PhaseKeyword;
// 	@:s public var step:Option<StepKeyword>;
// 	@:s public var timing:TimingKeyword;
// }
// final TIMINGS = [
// 	// Reroll
// 	new Timing(Reroll, None, Start),
// 	new Timing(Reroll, None, Rule),
// 	new Timing(Reroll, None, Free2),
// 	new Timing(Reroll, None, End),
// 	// Draw
// 	new Timing(Draw, None, Start),
// 	new Timing(Draw, None, Free1),
// 	new Timing(Draw, None, Rule),
// 	new Timing(Draw, None, Free2),
// 	new Timing(Draw, None, End),
// 	// Maintenance
// 	new Timing(Maintenance, None, Start),
// 	new Timing(Maintenance, None, Free1),
// 	new Timing(Maintenance, None, End),
// 	// Attack
// 	new Timing(Battle, Some(Attack), Start),
// 	new Timing(Battle, Some(Attack), Free1),
// 	new Timing(Battle, Some(Attack), Rule),
// 	new Timing(Battle, Some(Attack), Free2),
// 	new Timing(Battle, Some(Attack), End),
// 	// Defense
// 	new Timing(Battle, Some(Defense), Start),
// 	new Timing(Battle, Some(Defense), Free1),
// 	new Timing(Battle, Some(Defense), Rule),
// 	new Timing(Battle, Some(Defense), Free2),
// 	new Timing(Battle, Some(Defense), End),
// 	// DamageChecking
// 	new Timing(Battle, Some(DamageChecking), Start),
// 	new Timing(Battle, Some(DamageChecking), Free1),
// 	new Timing(Battle, Some(DamageChecking), Rule),
// 	new Timing(Battle, Some(DamageChecking), Free2),
// 	new Timing(Battle, Some(DamageChecking), End),
// 	// Return
// 	new Timing(Battle, Some(Return), Start),
// 	new Timing(Battle, Some(Return), Free1),
// 	new Timing(Battle, Some(Return), Rule),
// 	new Timing(Battle, Some(Return), Free2),
// 	//
// 	new Timing(Battle, Some(End), DamageReset),
// 	new Timing(Battle, Some(End), ResolveEffect),
// 	new Timing(Battle, Some(End), AdjustHand),
// 	new Timing(Battle, Some(End), TurnEnd),
// ];
// function getTimingId(key:Timing):String {
// 	return getMemonto(key);
// }
// function getTiming(timingId:String):Timing {
// 	return ofMemonto(timingId, Timing);
// }
