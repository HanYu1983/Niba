package model;

import viewModel.IViewModel;
import model.ver1.Define;
import model.ver1.TestCardProto;

class SimpleRuntime implements ExecuteRuntime {
	public function new() {}

	public function getCardId():String {
		return "0";
	}
}

@:nullSafety
class Game implements hxbit.Serializable {
	@:s public var ctx = new Context();

	public function new() {}

	public function test() {
		final cardProto = new CardProto1();
		final runtime = new SimpleRuntime();
		final texts = cardProto.getTexts(ctx, runtime);
		for (text in texts) {
			final reqs = text.getRequires(ctx, runtime);
			for (req in reqs) {
				req.action(ctx, runtime);
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
class TestModel extends DefaultViewModel {
	public function new() {}

	public override function getGame():GameModel {
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

	public override function previewPlayCard(id:String):PreviewPlayCardModel {
		return {
			success: false,
			msg: 'should have xxxx',
			content: {}
		}
	}
}
