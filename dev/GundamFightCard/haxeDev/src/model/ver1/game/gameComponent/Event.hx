package model.ver1.game.gameComponent;

import model.ver1.game.define.Define;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.Player;

enum CardEnterReason {
	Whatever;
	Play;
}

enum Event {
	ChangePhase;
	// 「ゲイン」の効果で戦闘修正を得た場合
	Gain(cardId:String, value:BattlePoint);
	//
	CardEnterField(cardId:String);
	//
	CardEnter(cardId:String, baSyouKeyword:BaSyouKeyword, reason:CardEnterReason);
	//
	CardRoll(cardId:String);
	//
	NewBattleGroup(cardIds:Array<String>);
	//
	PlayerEnterTurn(playerId:PlayerId);
}
