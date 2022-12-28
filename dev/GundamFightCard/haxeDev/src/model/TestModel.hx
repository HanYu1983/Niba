package model;

import viewModel.IViewModel;

typedef BattlePoint = {
	v1:Int,
	v2:Int,
	v3:Int
};

@:nullSafety
class Require {
	public var id:String = "unknown";
}

class RequireUserSelect<T> extends Require {
	public var tips:Array<T> = [];
	public var responsePlayerId:String = "unknown";
}

class RequireUserSelectCard extends RequireUserSelect<String> {
	public function new() {}
}

class RequireUserSelectBattlePoint extends RequireUserSelect<BattlePoint> {
	public function new() {}
}

class TextConfig {
	public function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		return [];
	}

	public function doRequire(require:Require, ctx:Context, runtime:ExecuteRuntime):Void {}

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
	Text(text:TextConfig);
}

interface ExecuteRuntime {
	function getCardId():String;
}

interface ICardProto {
	function getMarkEffect(mark:Mark):Array<MarkEffect>;
	function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<TextConfig>;
}

class AbstractCardProto implements ICardProto {
	public function getMarkEffect(mark:Mark):Array<MarkEffect> {
		return [];
	}

	public function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<TextConfig> {
		return [];
	}
}

class CardProto1Text1 extends TextConfig {
	public function new() {}

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		final cardId = runtime.getCardId();
		final ret = new RequireUserSelectCard();
		ret.id = "獲得回合結束前速攻";
		ret.tips = ["0", "1"];
		ret.responsePlayerId = "0";
		return [ret];
	}

	public override function doRequire(_require:Require, ctx:Context, runtime:ExecuteRuntime):Void {
		switch _require.id {
			case "獲得回合結束前速攻":
				switch (Type.typeof(_require)) {
					case TClass(cls) if (cls == RequireUserSelectCard):
						final require:RequireUserSelectCard = cast _require;
						final mark = new Mark();
						mark.id = "回合結束前速攻";
						mark.type = AttachCard(runtime.getCardId());
						mark.cause = CardEffect(runtime.getCardId());
						ctx.marks[mark.id] = mark;
					default:
						throw new haxe.Exception("xxx");
				}
		}
	}
}

class CardProto1 extends AbstractCardProto {
	public function new() {}

	public override function getMarkEffect(mark:Mark):Array<MarkEffect> {
		return switch mark.id {
			case "回合結束前速攻":
				[MarkEffect.Text(new CardProto1Text1())];
			default:
				[];
		}
	}

	public override function getTexts(ctx:Context, runtime:ExecuteRuntime):Array<TextConfig> {
		return [new CardProto1Text1()];
	}
}

class Player implements hxbit.Serializable {
	public function new(id:String) {
		this.id = id;
	}

	@:s public var id:String;
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

class Context implements hxbit.Serializable {
	public function new() {}

	@:s public var players:Map<String, Player> = [];
	@:s public var playersOrder:Array<String> = [];
	@:s public var table = new Table();
	@:s public var marks:Map<String, Mark> = [];
}

class SimpleRuntime implements ExecuteRuntime {
	public function new() {}

	public function getCardId():String {
		return "0";
	}
}

@:nullSafety
class Game implements hxbit.Serializable {
	// @:s不能作用在interface
	// 不能用final
	// 不支援巢狀typedef
	@:s public var ctx = new Context();

	public function new() {}

	public function test() {
		final cardProto = new CardProto1();
		final runtime = new SimpleRuntime();
		final texts = cardProto.getTexts(ctx, runtime);
		for (text in texts) {
			final reqs = text.getRequires(ctx, runtime);
			for (req in reqs) {
				text.doRequire(req, ctx, runtime);
			}
		}
	}

	public function getMemonto():String {
		final s = new hxbit.Serializer();
		final bytes = s.serialize(this);
		return bytes.toHex();
	}

	public static function ofMemonto(memonto:String):Game {
		final u = new hxbit.Serializer();
		return u.unserialize(haxe.io.Bytes.ofHex(memonto), Game);
	}
}

@:nullSafety
class TestModel implements IViewModel {
	public function new() {}

	public function getGame():GameModel {
		final game = new Game();
		game.test();

		final loadGame = Game.ofMemonto(game.getMemonto());
		loadGame.test();
		trace(loadGame.ctx);
		for (key => value in loadGame.ctx.marks) {
			trace(key);
			trace(value);
		}
		return {
			players: []
		};
	}

	public function previewPlayCard(id:String):PreviewPlayCardModel {
		return {
			success: false,
			msg: 'should have xxxx',
			content: {}
		}
	}
}
