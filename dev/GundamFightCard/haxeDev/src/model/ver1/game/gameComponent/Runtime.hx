package model.ver1.game.gameComponent;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.CardText;
import model.ver1.game.define.Player;
import model.ver1.game.component.CardProtoPoolComponent;
import model.ver1.game.component.MarkComponent;
import model.ver1.game.component.TimingComponent;
import model.ver1.game.component.ActivePlayerComponent;
import model.ver1.game.gameComponent.Alg;
import model.ver1.game.gameComponent.Event;
import model.ver1.game.gameComponent.MarkEffect;
import model.ver1.game.gameComponent.GameComponent;
import model.ver1.game.gameComponent.PSArmor;

function isContantType(text:CardText) {
	return switch (text.type) {
		case Automatic(Constant):
			true;
		case _:
			false;
	}
}

function flatSpecial(text:CardText):Array<CardText> {
	switch (text.type) {
		case Special(HighMobility):
			return [];
		case Special(PSArmor):
			return [new PSArmorText1(text.id), new PSArmorText2(text.id + "2")];
		case Special(Quick):
			// gen play card text
			return [];
		case _:
			return [text];
	}
}

typedef RuntimeText = {
	runtime:Runtime,
	text:CardText
}

//
// Runtime
//
function getRuntimeText(ctx:IGameComponent):Array<RuntimeText> {
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
	// 恆常內文. PlayCard
	final playReturn = [
		for (card in cardsInHandAndHanger) {
			final responsePlayerId = getBaSyouControllerAndAssertExist(ctx, getCardBaSyouAndAssertExist(ctx, card.id));
			final runtime:Runtime = new DefaultRuntime(card.id, responsePlayerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime).flatMap(flatSpecial).filter(text -> {
				return switch (text.type) {
					case Automatic(Constant) | PlayCard(_):
						return true;
					case _:
						return false;
				}
			})) {
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
			final runtime:Runtime = new DefaultRuntime(card.id, responsePlayerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime).flatMap(flatSpecial).filter(text -> text.isSurroundedByArrows)) {
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
			final runtime:Runtime = new DefaultRuntime(card.id, responsePlayerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime).flatMap(flatSpecial).filter(isContantType)) {
				{
					runtime: runtime,
					text: text
				};
			}
		}
	];
	// 有控制者的卡(配置區, 戰區)
	// 使用型與常駐都在這裡, 也包含恆常
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
			final runtime:Runtime = new DefaultRuntime(card.id, responsePlayerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime).flatMap(flatSpecial)) {
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
			final runtime:Runtime = new DefaultRuntime(card.id, responsePlayerId);
			for (text in getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime).flatMap(flatSpecial)) {
				for (effect in text.getEffect(ctx, runtime)) {
					cast(effect : MarkEffect);
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
		final runtime:Runtime = new DefaultRuntime(info.cardId, responsePlayerId);
		{
			runtime: runtime,
			text: info.text
		};
	}).flatMap(rt -> {
		switch rt.text.type {
			case Special(_):
				return flatSpecial(rt.text).map(t -> {
					runtime: rt.runtime,
					text: t
				});
			case _:
				return [rt];
		}
	});
	// 計算效果新增內文
	final globalMarkEffects = [
		for (mark in getMarks(ctx))
			for (effect in mark.getEffect(ctx))
				cast(effect : MarkEffect)
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
		final runtime:Runtime = new DefaultRuntime(info.cardId, responsePlayerId);
		{
			runtime: runtime,
			text: info.text
		};
	}).flatMap(rt -> {
		switch rt.text.type {
			case Special(_):
				return flatSpecial(rt.text).map(t -> {
					runtime: rt.runtime,
					text: t
				});
			case _:
				return [rt];
		}
	});
	return playReturn.concat(specialReturn).concat(specialReturn2).concat(originReturn).concat(addedReturn).concat(globalAddedReturn);
}

function getMarkEffects(ctx:IGameComponent):Array<MarkEffect> {
	final textEffects = [
		for (info in getRuntimeText(ctx)) {
			final runtime = info.runtime;
			final text = info.text;
			final effects = text.getEffect(ctx, runtime);
			for (effect in effects) {
				cast(effect : MarkEffect);
			}
		}
	];
	final markEffects = [
		for (mark in getMarks(ctx)) {
			final effects = mark.getEffect(ctx);
			for (effect in effects) {
				cast(effect : MarkEffect);
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

function isRequiresCanMet(ctx:IGameComponent, playerId:PlayerId, rt:RuntimeText) {
	return true;
}

function getPlayerRuntimeText(ctx:IGameComponent, playerId:PlayerId):Array<RuntimeText> {
	return getRuntimeText(ctx).filter(rt -> {
		switch (rt.text.type) {
			// 場上的使用型內文
			// 手牌中的PlayCard(PlayUnit, PlayCommand, PlayOperation)
			case Use(useTiming) | PlayCard(useTiming):
				return isPlayerTiming(ctx, useTiming, rt.runtime.getResponsePlayerId(), getTiming(ctx), playerId)
					&& isRequiresCanMet(ctx, playerId, rt);
			case _:
				// 179025_07D_U_RD158C_red
				return isRequiresCanMet(ctx, playerId, rt);
		}
	});
}
