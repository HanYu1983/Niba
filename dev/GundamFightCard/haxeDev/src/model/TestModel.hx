package model;

import viewModel.IViewModel;
import model.ver1.Define;
import model.ver1.TestCardProto;
import model.ver1.CardProto_179001_01A_CH_WT007R_white;

// switch Type.typeof(markEffect) {
// 	case TClass(cls) if (cls == Any):
// 		true;
// 	case _:
// 		false;
// }

@:nullSafety
class Game implements hxbit.Serializable {
	@:s public var ctx = new Context();

	public function new() {}

	public function test() {
		trace("============= test =============");
		final cardProto = new CardProto1();
		final runtime = new DefaultExecuteRuntime();
		var texts = {
			var cardTexts = cardProto.getTexts(ctx, runtime);
			var attachTexts:Array<CardText> = cast [
				for (mark in ctx.marks)
					for (markEffect in mark.getEffect(ctx)) {
						switch markEffect {
							case AddText(_, text):
								text;
							case _:
								null;
						}
					}
			].filter(a -> a != null);
			cardTexts.concat(attachTexts);
		}
		for (text in texts) {
			if (text == null) {
				continue;
			}
			final reqs = text.getRequires(ctx, runtime);
			for (req in reqs) {
				req.action(ctx, runtime);
			}
			trace("改變狀態");
			text.action(ctx, runtime);
		}
		trace("重取得最新狀態");
		texts = {
			var cardTexts = cardProto.getTexts(ctx, runtime);
			var attachTexts:Array<CardText> = cast [
				for (mark in ctx.marks)
					for (markEffect in mark.getEffect(ctx)) {
						switch markEffect {
							case AddText(_, text):
								text;
							case _:
								null;
						}
					}
			].filter(a -> a != null);
			cardTexts.concat(attachTexts);
		}
		final markEffects = [
			for (mark in ctx.marks)
				for (markEffect in mark.getEffect(ctx))
					markEffect
		].concat([
			for (text in texts)
				for (markEffect in text.getEffect(ctx, runtime))
					markEffect
		]);
		trace("常駐增強內文");
		final bonusList = [
			for (markEffect in markEffects) {
				switch markEffect {
					case AddBattlePoint(cardId, battlePoint):
						{
							cardId: cardId,
							battlePoint: battlePoint
						};
					case _:
						null;
				}
			}
		];
		for (bonus in bonusList) {
			if (bonus == null) {
				continue;
			}
			trace(bonus.cardId);
			trace(bonus.battlePoint);
		}
		trace("速攻");
		final attackSpeedList = [
			for (markEffect in markEffects) {
				switch markEffect {
					case AttackSpeed(cardId, speed):
						{
							cardId: cardId,
							speed: speed
						};
					case _:
						null;
				}
			}
		];
		for (bonus in attackSpeedList) {
			if (bonus == null) {
				continue;
			}
			trace(bonus.cardId);
			trace(bonus.speed);
		}

		// 所有標記
		// final marks = cardProto.getMarks(ctx, runtime);
		// trace(marks);
		// //
		// final texts = [
		// 	for (mark in marks)
		// 		for (markEffect in mark.getEffect(ctx, runtime)) {
		// 			switch markEffect {
		// 				case Text(text):
		// 					text;
		// 				case _:
		// 					null;
		// 			}
		// 		}

		// ];
		// trace(texts);
		// for (text in texts) {
		// 	if (text == null) {
		// 		continue;
		// 	}
		// 	final reqs = text.getRequires(ctx, runtime);
		// 	for (req in reqs) {
		// 		req.action(ctx, runtime);
		// 	}
		// 	text.action(ctx, runtime);
		// }
		// // 常駐增強內文
		// final bonusList = [
		// 	for (mark in marks)
		// 		for (markEffect in mark.getEffect(ctx, runtime)) {
		// 			switch markEffect {
		// 				case AddBattlePoint(cardId, battlePoint):
		// 					{
		// 						cardId: cardId,
		// 						battlePoint: battlePoint
		// 					};
		// 				case _:
		// 					null;
		// 			}
		// 		}
		// ];
		// for(bonus in bonusList){
		// 	if (bonus == null) {
		// 		continue;
		// 	}
		// 	trace(bonus.cardId);
		// 	trace(bonus.battlePoint);
		// }
		trace("==========================");
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
		trace(game.ctx);

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
