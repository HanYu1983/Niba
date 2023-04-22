package model.ver1.game.define;

import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Require;
import model.ver1.game.define.Define;
import model.ver1.game.define.CardText;

class CardProto implements hxbit.Serializable {
	public var category = CardCategory.Unit;

	public function new() {}

	public function getTexts(_ctx:IContext, runtime:ExecuteRuntime):Array<CardText> {
		return [];
	}
}
