package model.ver1.game.define;

using Lambda;

import haxe.ds.Option;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Require;
import model.ver1.game.define.Define;

// interface ICardText {
// 	public function getEffect(_ctx:Any, runtime:Runtime):Array<Any>;
// 	public function getRequires(_ctx:Any, runtime:Runtime):Array<Require>;
// 	public function getRequires2(_ctx:Any, runtime:Runtime):Array<Require2>;
// 	public function action(_ctx:Any, runtime:Runtime):Void;
// 	public function onEvent(_ctx:Any, event:Any, runtime:Runtime):Void;
// }
class CardText {
	public function new(id:String, description:String, type:TextType) {
		this.id = id;
		this.description = description;
		this.type = type;
	}

	public final id:String;
	public final description:String;
	public final type:TextType;
	// << >>內文
	public var isSurroundedByArrows = false;

	private function getSubKey(v:Int) {
		return '${id}_${v}';
	}

	public function getEffect(_ctx:Any, runtime:Runtime):Array<Any> {
		return [];
	}

	public function getRequires(_ctx:Any, runtime:Runtime):Array<Require> {
		return [];
	}

	public function getRequires2(_ctx:Any, runtime:Runtime):Array<Require2> {
		return [];
	}

	public function getRequires3(_ctx:Any, runtime:Runtime):Require3 {
		return {
			logic: None,
			selections: [],
		}
	}

	public function action(_ctx:Any, runtime:Runtime):Void {}

	public function onEvent(_ctx:Any, event:Any, runtime:Runtime):Void {}
}
// class CardTextGroup extends CardText {
// 	public function new(id:String, description:String) {
// 		super(id, description);
// 	}
// 	public var texts:Array<CardText> = [];
// 	public override function getEffect(_ctx:Any, runtime:Runtime):Array<Any> {
// 		return texts.flatMap(t -> t.getEffect(_ctx, runtime));
// 	}
// 	public override function getRequires(_ctx:Any, runtime:Runtime):Array<Require> {
// 		return texts.flatMap(t -> t.getRequires(_ctx, runtime));
// 	}
// 	public override function getRequires2(_ctx:Any, runtime:Runtime):Array<Require2> {
// 		return texts.flatMap(t -> t.getRequires2(_ctx, runtime));
// 	}
// 	public override function action(_ctx:Any, runtime:Runtime):Void {
// 		for (text in texts) {
// 			text.action(_ctx, runtime);
// 		}
// 	}
// 	public override function onEvent(_ctx:Any, event:Any, runtime:Runtime):Void {
// 		for (text in texts) {
// 			text.onEvent(_ctx, event, runtime);
// 		}
// 	}
// }
