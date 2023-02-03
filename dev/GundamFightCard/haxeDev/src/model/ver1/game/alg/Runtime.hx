package model.ver1.game.alg;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Event;
import model.ver1.game.alg.Context;
import model.ver1.game.alg.CardProto;

function isContantType(text:CardText) {
	return switch (text.type) {
		case Automatic(Constant):
			true;
		case _:
			false;
	}
}

//
// Runtime
//
function getRuntimeText(ctx:Context):Array<{runtime:ExecuteRuntime, text:CardText}> {
	// ver1 （沒使用）
	// 手牌，hanger中的牌, 直接給它Play的權力
	// ver2
	// 手牌，hanger中的牌
	final cardsInHandAndHanger = [for (cs in ctx.table.cardStacks) cs].filter(cs -> {
		return switch ((cs.id : BaSyouId) : BaSyou) {
			case Default(_, TeHuTa | Hanger):
				true;
			case _:
				false;
		}
	})
		.map(cs -> cs.cardIds)
		.fold((c, a) -> a.concat(c), new Array<String>())
		.map(id -> ctx.table.cards[id]);
	// 恆常內文, 出牌算恆常內文
	final playReturn = [
		for (card in cardsInHandAndHanger) {
			final responsePlayerId = getBaSyouControllerAndAssertExist(ctx, getCardBaSyouAndAssertExist(ctx, card.id));
			final runtime:ExecuteRuntime = new DefaultExecuteRuntime(card.id, responsePlayerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime).filter(isContantType)) {
				{
					runtime: runtime,
					text: text
				};
			}
		}
	];
	// 倒置G
	final cardsInGZone = [for (cs in ctx.table.cardStacks) cs].filter(cs -> {
		return switch ((cs.id : BaSyouId) : BaSyou) {
			case Default(_, GZone):
				true;
			case _:
				false;
		}
	})
		.map(cs -> cs.cardIds)
		.fold((c, a) -> a.concat(c), new Array<String>())
		.map(id -> ctx.table.cards[id]);
	// 可以使用<>內文
	final specialReturn = [
		for (card in cardsInGZone) {
			final responsePlayerId = getBaSyouControllerAndAssertExist(ctx, getCardBaSyouAndAssertExist(ctx, card.id));
			final runtime:ExecuteRuntime = new DefaultExecuteRuntime(card.id, responsePlayerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime).filter(text -> text.isSurroundedByArrows)) {
				{
					runtime: runtime,
					text: text
				};
			}
		}
	];
	// 廢棄庫
	final cardsInJunkYard = [for (cs in ctx.table.cardStacks) cs].filter(cs -> {
		return switch ((cs.id : BaSyouId) : BaSyou) {
			case Default(_, JunkYard):
				true;
			case _:
				false;
		}
	})
		.map(cs -> cs.cardIds)
		.fold((c, a) -> a.concat(c), new Array<String>())
		.map(id -> ctx.table.cards[id]);
	// 恆常內文
	final specialReturn2 = [
		for (card in cardsInJunkYard) {
			final responsePlayerId = getBaSyouControllerAndAssertExist(ctx, getCardBaSyouAndAssertExist(ctx, card.id));
			final runtime:ExecuteRuntime = new DefaultExecuteRuntime(card.id, responsePlayerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime).filter(isContantType)) {
				{
					runtime: runtime,
					text: text
				};
			}
		}
	];
	// 有控制者的卡(配置區, 戰區)
	final cardsHasController = [for (cs in ctx.table.cardStacks) cs].filter(cs -> {
		return switch ((cs.id : BaSyouId) : BaSyou) {
			case Default(_, kw):
				isBa(kw);
			case _:
				false;
		}
	})
		.map(cs -> cs.cardIds)
		.fold((c, a) -> a.concat(c), new Array<String>())
		.map(id -> ctx.table.cards[id]);
	// 原始內文
	final originReturn = [
		for (card in cardsHasController) {
			final responsePlayerId = getCardControllerAndAssertExist(ctx, card.id);
			final runtime:ExecuteRuntime = new DefaultExecuteRuntime(card.id, responsePlayerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime)) {
				{
					runtime: runtime,
					text: text
				};
			}
		}
	];
	// 計算常駐能力新增內文
	final originMarkEffects = [
		for (card in cardsHasController) {
			final responsePlayerId = getCardControllerAndAssertExist(ctx, card.id);
			final runtime:ExecuteRuntime = new DefaultExecuteRuntime(card.id, responsePlayerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime)) {
				for (effect in text.getEffect(ctx, runtime)) {
					effect;
				}
			}
		}
	];
	final attachTextEffect = originMarkEffects.filter(effect -> {
		return switch effect {
			case AddText(_, _):
				true;
			case _:
				false;
		}
	});
	final addedReturn = attachTextEffect.map(effect -> {
		final info = switch effect {
			case AddText(cardId, text):
				{
					cardId: cardId,
					text: text
				};
			case _:
				throw new haxe.Exception("addedReturn xxx");
		}
		final responsePlayerId = getCardControllerAndAssertExist(ctx, info.cardId);
		final runtime:ExecuteRuntime = new DefaultExecuteRuntime(info.cardId, responsePlayerId);
		{
			runtime: runtime,
			text: info.text
		};
	});
	// 計算效果新增內文
	final globalMarkEffects = [
		for (mark in ctx.marks)
			for (effect in mark.getEffect(ctx))
				effect
	];
	final globalAttachTextEffect = globalMarkEffects.filter(effect -> {
		return switch effect {
			case AddText(_, _):
				true;
			case _:
				false;
		}
	});
	final globalAddedReturn = globalAttachTextEffect.map(effect -> {
		final info = switch effect {
			case AddText(cardId, text):
				{
					cardId: cardId,
					text: text
				};
			case _:
				throw new haxe.Exception("globalAddedReturn xxx");
		}
		final responsePlayerId = getCardControllerAndAssertExist(ctx, info.cardId);
		final runtime:ExecuteRuntime = new DefaultExecuteRuntime(info.cardId, responsePlayerId);
		{
			runtime: runtime,
			text: info.text
		};
	});
	return playReturn.concat(specialReturn).concat(specialReturn2).concat(originReturn).concat(addedReturn).concat(globalAddedReturn);
}

function getMarkEffects(ctx:Context):Array<MarkEffect> {
	final textEffects = [
		for (info in getRuntimeText(ctx)) {
			final runtime = info.runtime;
			final text = info.text;
			final effects = text.getEffect(ctx, runtime);
			for (effect in effects) {
				effect;
			}
		}
	];
	final markEffects = [
		for (mark in ctx.marks) {
			final effects = mark.getEffect(ctx);
			for (effect in effects) {
				effect;
			}
		}
	].filter(e -> switch e {
		case AddText(_, _):
			false;
		case _:
			true;
	});
	return textEffects.concat(markEffects);
}
