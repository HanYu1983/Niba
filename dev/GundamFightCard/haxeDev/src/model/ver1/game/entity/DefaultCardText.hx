package model.ver1.game.entity;

import model.ver1.game.define.Define;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Event;
import model.ver1.game.entity.Context;
import model.ver1.game.entity.MarkEffect;

class DefaultCardText extends CardText<Context, MarkEffect> {
	public function new(id:String, description:String) {
		super(id, description);
	}
}
