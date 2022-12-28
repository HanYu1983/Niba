package model.ver1;

final PENDING_STRING = "";

// 實作hxbit.Serializable這個介面後並使用了@:s
// @:nullSafety就會出錯
// 因為不能使用Null<Type>，改使用PENDING_STRING用來判斷是否有設值(null的替代品)
class Player implements hxbit.Serializable {
	public function new() {}

	// @:s不能作用在interface
	// 不能用final
	// 不支援巢狀typedef
	@:s public var id = PENDING_STRING;
}

class Card implements hxbit.Serializable {
	public function new() {}

	@:s public var id = PENDING_STRING;
	@:s public var isFaceUp = false;
	@:s public var isTap = false;
	@:s public var protoId = PENDING_STRING;
}

class CardStack implements hxbit.Serializable {
	public function new() {}

	@:s public var id = PENDING_STRING;
	@:s public var cardIds:Array<String> = [];
}

class Table implements hxbit.Serializable {
	public function new() {}

	@:s public var cards:Map<String, Card> = [];
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

class Require {
	public function new() {}

	public var id = PENDING_STRING;

	public function action(ctx:Context, runtime:ExecuteRuntime):Void {}
}

class RequireUserSelect<T> extends Require {
	public function new() {
		super();
	}

	public var tips:Array<T> = [];
	public var responsePlayerId = PENDING_STRING;
}

class CardText {
	public var id = PENDING_STRING;

	public function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		return [];
	}

	public function onEvent(ctx:Context, runtime:ExecuteRuntime):Void {}
}

enum MarkType {
	Pending;
	AttachCard(cardId:String);
}

enum MarkCause {
	Pending;
	CardEffect(cardId:String);
}

class Mark implements hxbit.Serializable {
	public function new() {}

	@:s public var id = PENDING_STRING;
	@:s public var type = MarkType.Pending;
	@:s public var cause = MarkCause.Pending;
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
