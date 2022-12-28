package model.ver1;

class Player implements hxbit.Serializable {
    public function new() {}
    // @:s不能作用在interface
	// 不能用final
	// 不支援巢狀typedef
	@:s public var id:String = "unknown";
}

class Card implements hxbit.Serializable {
	public function new() {}

	@:s public var id:String;
	@:s public var isFaceUp = false;
	@:s public var isTap = false;
	@:s public var protoId:Null<String>;
}

class CardStack implements hxbit.Serializable {
	public function new() {}

	@:s public var id:String;
	@:s public var cardIds:Array<String> = [];
}

class Table implements hxbit.Serializable {
	public function new() {}

	@:s public var cards:Map<String, Card> = ["" => new Card()];
	@:s public var cardStacks:Map<String, CardStack> = [];
}

enum Phase {
	Pending;
	Test(str:String);
}

class Context implements hxbit.Serializable {
	public function new() {}

	@:s public var players:Map<String, Player> = [];
	@:s public var playersOrder:Array<String> = [];
	@:s public var table = new Table();
	@:s public var marks:Map<String, Mark> = [];
	@:s public var phase:Phase = Pending;
}

typedef BattlePoint = {
	v1:Int,
	v2:Int,
	v3:Int
};

@:nullSafety
class Require {
	public function new() {}

	public var id:String = "unknown";

	public function action(ctx:Context, runtime:ExecuteRuntime):Void {}
}

class RequireUserSelect<T> extends Require {
	public function new() {
		super();
	}

	public var tips:Array<T> = [];
	public var responsePlayerId:String = "unknown";
}

class CardText {
	public var id:String = "unknown";

	public function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		return [];
	}

	public function onEvent(ctx:Context, runtime:ExecuteRuntime):Void {}
}

enum MarkType {
	AttachCard(cardId:String);
}

enum MarkCause {
	CardEffect(cardId:String);
}

class Mark implements hxbit.Serializable {
	public function new() {}

	@:s public var id:String;
	@:s public var type:MarkType;
	@:s public var cause:MarkCause;
}

enum MarkEffect {
	Text(text:CardText);
}

interface ExecuteRuntime {
	function getCardId():String;
}

interface ICardProto {
	function getMarkEffect(mark:Mark):Array<MarkEffect>;
	function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText>;
}

class AbstractCardProto implements ICardProto {
	public function getMarkEffect(mark:Mark):Array<MarkEffect> {
		return [];
	}

	public function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<CardText> {
		return [];
	}
}