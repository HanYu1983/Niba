package model.ver1.game.define;

import model.ver1.game.define.Define;

enum Event {
	ChangePhase;
	// 「ゲイン」の効果で戦闘修正を得た場合
	Gain(cardId:String, value:Int);
	//
	CardEnterField(cardId:String);
	//
	CardRoll(cardId:String);
}