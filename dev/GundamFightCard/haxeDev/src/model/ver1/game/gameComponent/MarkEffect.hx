package model.ver1.game.gameComponent;

import model.ver1.game.define.Define;
import model.ver1.game.define.CardText;

enum MarkEffect {
	AddBattlePoint(cardId:String, battlePoint:BattlePoint);
	AttackSpeed(cardId:String, speed:Int);
	AddText(cardId:String, text:CardText);
	EnterFieldThisTurn(cardId:String);
	CanNotReroll(cardId:String);
}
