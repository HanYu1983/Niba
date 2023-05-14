package model.ver1.game.define;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.Player;
import model.ver1.game.define.BaSyou;
import model.ver1.game.component.TableComponent;

enum TargetCount {
	// 全て
	All;
	// 1枚
	Constants(value:Int);
	// 合計2枚まで
	MuchAsPossible(value:Int);
}

enum RelativeBaSyou {
	RelativeBaSyou(playerId:RelativePlayer, baSyouKeyword:BaSyouKeyword);
}

interface ITargetCardFilter {
	function apply(ctx:Any, runtime:Runtime, card:Card):Bool;
}

class AbstractTargetCardFilter implements ITargetCardFilter {
	public function apply(ctx:Any, runtime:Runtime, card:Card):Bool {
		return false;
	}
}

class Or extends AbstractTargetCardFilter {
	final value:Array<ITargetCardFilter>;

	public function new(value:Array<ITargetCardFilter>) {
		this.value = value;
	}

	public override function apply(ctx:Any, runtime:Runtime, card:Card):Bool {
		return value.exists(f -> f.apply(ctx, runtime, card));
	}
}

class And extends AbstractTargetCardFilter {
	final value:Array<ITargetCardFilter>;

	public function new(value:Array<ITargetCardFilter>) {
		this.value = value;
	}

	public override function apply(ctx:Any, runtime:Runtime, card:Card):Bool {
		return value.filter(f -> f.apply(ctx, runtime, card)).length == value.length;
	}
}

class Not extends AbstractTargetCardFilter {
	final value:ITargetCardFilter;

	public function new(value:ITargetCardFilter) {
		this.value = value;
	}

	public override function apply(ctx:Any, runtime:Runtime, card:Card):Bool {
		return !value.apply(ctx, runtime, card);
	}
}
