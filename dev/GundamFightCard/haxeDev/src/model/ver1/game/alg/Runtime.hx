package model.ver1.game.alg;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.ExecuteRuntimeImpl;
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
	// 本國捨山以外的卡
	// final hideCards = [for(cs in ctx.table.cardStacks) cs].filter(cs->{
	// 	switch getBaSyou(cs.id) {}
	// })
	final cardsNotHome = [for (card in ctx.table.cards) card].filter(card -> {
		return switch getCardBaSyouAndAssertExist(ctx, card.id) {
			case Default(_, HonGoku | SuteYama):
				false;
			case _:
				true;
		}
	});
	// 沒有控制權的卡（廢棄庫/手牌/hanger）(p.63)
	final cardsHasNoController = cardsNotHome.filter(card -> {
		return switch getCardController(ctx, card.id) {
			case Some(_):
				false;
			case _:
				true;
		};
	});
	// ver1 （沒使用）
	// 手牌，hanger中的牌, 直接給它Play的權力
	// ver2
	// 手牌，hanger中的牌, 可以使用恆常內文。出牌算恆常內文
	final cardsInHandAndHanger = cardsHasNoController.filter(card -> {
		return switch getCardBaSyouAndAssertExist(ctx, card.id) {
			case Default(_, TeHuTa | Hanger):
				true;
			case _:
				false;
		}
	});
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
	// 手牌，hanger以外的沒有控制中的牌(倒置G，廢棄庫...)
	final cardsNotInHandAndHanger = cardsHasNoController.filter(card -> {
		// TODO: 本國以外
		return cardsInHandAndHanger.contains(card) == false;
	});
	// 倒置G的情況可以使用<>內文
	final cardsUseG = cardsNotInHandAndHanger.filter(card -> {
		return switch getCardBaSyouAndAssertExist(ctx, card.id) {
			case Default(_, GZone):
				true;
			case _:
				false;
		}
	});
	final specialReturn = [
		for (card in cardsUseG) {
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
	// 廢棄庫可以使用恆常內文
	final cardsNotUseG = cardsNotInHandAndHanger.filter(card -> {
		return cardsUseG.contains(card) == false;
	});
	final specialReturn2 = [
		for (card in cardsNotUseG) {
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
	//
	final cardsHasController = cardsNotHome.filter(card -> {
		return cardsHasNoController.contains(card) == false;
	});
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
