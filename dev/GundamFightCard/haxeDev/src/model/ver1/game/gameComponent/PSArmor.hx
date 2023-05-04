package model.ver1.game.gameComponent;

import model.ver1.game.define.Define;
import model.ver1.game.define.CardText;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Require;
import model.ver1.game.gameComponent.GameComponent;

// class PSArmor extends CardTextGroup {
// 	public function new(id:String) {
// 		super(id, "PSArmor");
// 		texts = [new PSArmorText1(id), new PSArmorText2(id)];
// 	}
// }

class PSArmorText1 extends CardText {
	public function new(id:String) {
		super(id, "出場時直立");
		type = Automatic(Trigger);
	}

	public override function onEvent(_ctx:Any, event:Any, runtime:Runtime):Void {}
}

class PSArmorText2 extends CardText {
	public function new(id:String) {
		super(id, " 進入戰場時, 下回合開始時回到手上, 當中如果和補給或供給能力的組到隊的話, 就不必回到手上");
		type = Automatic(Trigger);
	}

	public override function onEvent(_ctx:Any, event:Any, runtime:Runtime):Void {}
}
