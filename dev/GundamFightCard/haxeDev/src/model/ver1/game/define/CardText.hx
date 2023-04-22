package model.ver1.game.define;

import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Require;
import model.ver1.game.define.Define;

class CardText implements hxbit.Serializable {
	public function new(id:String, description:String) {
		this.id = id;
		this.description = description;
	}

	@:s public var id:String;
	@:s public var description:String;
	@:s public var type = Use;
	// << >>內文
	@:s public var isSurroundedByArrows = false;

	private function getSubKey(v:Int) {
		return '${id}_${v}';
	}

	public function getEffect(_ctx:IContext, runtime:ExecuteRuntime):Array<MarkEffect> {
		return [];
	}

	public function getRequires(_ctx:IContext, runtime:ExecuteRuntime):Array<Require> {
		return [];
	}

	public function getRequires2(_ctx:IContext, runtime:ExecuteRuntime):Array<Require2> {
		return [];
	}

	public function action(_ctx:IContext, runtime:ExecuteRuntime):Void {}

	public function onEvent(_ctx:IContext, event:Event, runtime:ExecuteRuntime):Void {}
}
