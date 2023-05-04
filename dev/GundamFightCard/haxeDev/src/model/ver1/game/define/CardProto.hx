package model.ver1.game.define;

import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Require;
import model.ver1.game.define.Define;
import model.ver1.game.define.CardText;

class CardProto {
	public var category = CardCategory.Unit;

	public function new() {}

	public function getTexts(_ctx:Any, runtime:Runtime):Array<CardText> {
		return [];
	}
}
