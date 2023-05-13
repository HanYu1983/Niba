package model.ver1.game.flowComponent;

import haxe.ds.Option;
import model.ver1.game.define.Define;
import model.ver1.game.define.Player;
import model.ver1.game.define.Effect;
import model.ver1.game.define.Runtime;
import model.ver1.game.component.CutComponent;
import model.ver1.game.component.TimingComponent;
import model.ver1.game.component.ActiveEffectComponent;
import model.ver1.game.component.ActivePlayerComponent;
import model.ver1.game.gameComponent.Alg;
import model.ver1.game.gameComponent.Event;
import model.ver1.game.gameComponent.GameComponent;
import model.ver1.game.gameComponent.Runtime;
import model.ver1.game.gameComponent.DrawRule;
import model.ver1.game.gameComponent.RerollRule;
import model.ver1.game.gameComponent.AttackRule;
import model.ver1.game.gameComponent.DefenceRule;
import model.ver1.game.gameComponent.DamageRule;
import model.ver1.game.gameComponent.ReturnRule;
import model.ver1.game.flowComponent.FlowMemory;

interface IFlowComponent extends IGameComponent {
	var flowMemory:FlowMemory;
}

enum SystemHandle {
	PrepareDeck;
	WhoFirst;
	Draw6AndConfirm;
	Playing;
	DrawRule;
	RerollRule;
	AttackRule;
	DefenceRule;
	DamageRule;
	ReturnRule;
	TriggerEvent(event:Event);
	StackEffectFinished;
}

enum FlowType {
	WaitPlayer;
	ObserveEffect;
	DoEffect(blockId:String);
	PassPayCost(blockId:String);
	CancelActiveEffect;
	SetActiveEffectId(blockId:String, tips:Array<Effect>);
	DeleteImmediateEffect(blockId:String, tips:Array<Effect>);
	CancelPassCut;
	PassCut;
	PassPhase;
	CancelPassPhase;
	NextTiming;
	SystemHandle(handle:SystemHandle);
}

typedef Flow = {
	type:FlowType,
	description:String
}

function createFlow(type:FlowType, description:String):Flow {
	return {
		type: type,
		description: description
	}
}

function applyFlow(ctx:IFlowComponent, playerID:PlayerId, flow:Flow):Void {
	switch flow.type {
		case SystemHandle(PrepareDeck):
			ctx.flowMemory.state = WhoFirst;
			ctx.flowMemory.hasTriggerEvent = true;
		case SystemHandle(WhoFirst):
			ctx.flowMemory.state = Draw6AndConfirm;
			ctx.flowMemory.hasTriggerEvent = true;
		case SystemHandle(Draw6AndConfirm):
			ctx.flowMemory.state = Playing;
			ctx.flowMemory.hasTriggerEvent = true;
		case SystemHandle(DrawRule):
			addDrawRule(ctx, getActivePlayerIdAndAssert(ctx));
			ctx.flowMemory.hasTriggerEvent = true;
		case SystemHandle(RerollRule):
			addRerollRule(ctx, getActivePlayerIdAndAssert(ctx));
			ctx.flowMemory.hasTriggerEvent = true;
		case SystemHandle(AttackRule):
			addAttackRule(ctx, getActivePlayerIdAndAssert(ctx));
			ctx.flowMemory.hasTriggerEvent = true;
		case SystemHandle(DefenceRule):
			addDefenceRule(ctx, getActivePlayerIdAndAssert(ctx));
			ctx.flowMemory.hasTriggerEvent = true;
		case SystemHandle(DamageRule):
			addDamageRule(ctx, getActivePlayerIdAndAssert(ctx));
			ctx.flowMemory.hasTriggerEvent = true;
		case SystemHandle(ReturnRule):
			addReturnRule(ctx, getActivePlayerIdAndAssert(ctx));
			ctx.flowMemory.hasTriggerEvent = true;
		case SetActiveEffectId(blockId, tips):
			switch getActiveEffect(ctx) {
				case Some(effect):
					switch getEffectRuntime(ctx, effect).getResponsePlayerIdOption() {
						case None:
							throw new haxe.Exception("系統效果不能替換");
						case Some(controller) if (controller != playerID):
							throw new haxe.Exception("你不是控制者");
						case _:
							// ignore
					}
				// if (ctx.flowMemory.hasEffectRequireActionHandled[effect.id]) {
				// 	throw new haxe.Exception("已經處理需求的不能取消");
				// }
				case _:
			}
			switch model.ver1.game.component.EffectComponent.getEffect(ctx, blockId) {
				case None:
					throw new haxe.Exception('effect not found: ${blockId}');
				case Some(effect):
					setActiveEffect(ctx, Some(effect));
			}
		case DoEffect(effectID):
			switch getActiveEffect(ctx) {
				case Some(effect):
					if (effect.id != effectID) {
						throw new haxe.Exception("activeEffectID != effectID");
					}
					// 處理事件
					final runtime = getEffectRuntime(ctx, effect);
					// 試運行在測試的上下文
					try {
						final copyCtx = cast(ctx.copy() : IFlowComponent);
						for (require in effect.text.getRequires2(copyCtx, runtime)) {
							require.action();
						}
						effect.text.action(copyCtx, runtime);
					} catch (e) {
						throw e;
					}
					// 若沒錯誤, 再執行一次
					for (require in effect.text.getRequires2(ctx, runtime)) {
						require.action();
					}
					effect.text.action(ctx, runtime);
					// 清除旗標，代表現在沒有正在支付的效果
					setActiveEffect(ctx, None);
					switch effect.cause {
						case System(_):
						// 規則的效果不會在堆疊內
						case _:
							// 將效果移除
							removeEffect(ctx, effect.id);
							// 如果是堆疊事件，將事件移到堆疊記憶去
							// final isStackEffect = stackeffectEffect != null;
							// if (isStackEffect) {
							// 	ctx = {
							// 		...ctx,
							// 		gameState:{
							// 			...ctx.gameState,
							// 			stackEffectMemory:[...ctx.gameState.stackEffectMemory, stackEffect],
							// 		},
							// 	};
							// }
							// // 是否堆疊結束
							// // 觸發切入解決事件，並清空堆疊記憶
							// const isStackFinished = isStackEffect && ctx.gameState.stackEffect.length == 0;
							// if (isStackFinished) {
							// 	ctx = {
							// 		...ctx,
							// 		gameState:{
							// 			...ctx.gameState,
							// 			flowMemory:{
							// 				...ctx.gameState.flowMemory,
							// 				shouldTriggerStackEffectFinishedEvent:true,
							// 			},
							// 		},
							// 	};
							// }
					}
				case _:
			}
		case _:
	}
}

function queryFlow(ctx:IFlowComponent, playerId:PlayerId):Array<Flow> {
	// 是否有玩家牌生命歸0，遊戲結束
	switch hasSomeoneLiveIsZero(ctx) {
		case Some(playerId):
			return [createFlow(WaitPlayer, "遊戲結束")];
		case _:
	}
	// 有玩家在支付卡片或有系統效果(抽牌規定效果等)
	switch getActiveEffect(ctx) {
		case Some(activeBlock):
			switch getEffectRuntime(ctx, activeBlock).getResponsePlayerIdOption() {
				case None:
					// 沒有控制者的效果由主動玩家處理
					if (playerId != getActivePlayerIdAndAssert(ctx)) {
						return [createFlow(WaitPlayer, "等待伺服器處理")];
					}
					return [createFlow(DoEffect(activeBlock.id), "")];
				case Some(controller):
					final isPass = ctx.flowMemory.hasPlayerPassPayCost[playerId];
					final isOpponentPass = ctx.flowMemory.hasPlayerPassPayCost[~(playerId)];
					if (isPass && isOpponentPass) {
						// 雙方都已支付
						if (controller != playerId) {
							// 非控制者等待
							return [createFlow(ObserveEffect, "")];
						}
						// 控制者可解決效果
						return [createFlow(DoEffect(activeBlock.id), "")];
					} else if (isPass || isOpponentPass) {
						// 其中一方支付
						if (controller == playerId) {
							// 控制者
							if (isPass) {
								// 已支付
								// 等待
								return [createFlow(ObserveEffect, "")];
							}
						} else {
							// 非控制者
							if (isOpponentPass == false) {
								// 對方未支付（自己已支付）
								// 等待
								return [createFlow(ObserveEffect, "")];
							}
							// 對方已支付（自己未支付）
							// 自己宣告已支付
							return [createFlow(PassPayCost(activeBlock.id), "")];
						}
					}
					if (controller != playerId) {
						// 非控制者並雙方都支付
						// 等待控制者解決效果
						return [createFlow(WaitPlayer, "等待對方支付ActiveEffectID")];
					}
					// 是控制者但未支付
					// 取消支付或宣告已支付
					return [
						createFlow(CancelActiveEffect, "取消支付效果，讓其它玩家可以支付"),
						createFlow(PassPayCost(activeBlock.id), ""),
					];
			}
		case None:
			// ignore
	}
	// 起動效果
	{
		final immediateEffects = getImmediateEffects(ctx);
		if (immediateEffects.length > 0) {
			final isActivePlayer = getActivePlayerIdAndAssert(ctx) == playerId;
			final myEffect:Array<Effect> = [];
			final opponentEffect:Array<Effect> = [];
			for (effect in immediateEffects) {
				final controller = getEffectRuntime(ctx, effect).getResponsePlayerId();
				if (controller == playerId) {
					myEffect.push(effect);
				} else {
					opponentEffect.push(effect);
				}
			}
			// 不是主動玩家的情況，要等主動玩家先處理完起動效果才行
			if (isActivePlayer == false) {
				if (opponentEffect.length > 0) {
					return [createFlow(WaitPlayer, "等待主動玩家處理起動效果")];
				}
			}
			// 主動玩家
			if (myEffect.length == 0) {
				return [createFlow(WaitPlayer, "等待被動玩家處理起動效果")];
			}
			final optionEffect = myEffect.filter((v) -> v.isOption == true);
			final r1:Array<Flow> = myEffect.length == 0 ? [] : [createFlow(SetActiveEffectId(myEffect[0].id, myEffect), "選擇一個起動效果")];
			final r2:Array<Flow> = optionEffect.length == 0 ? [] : [createFlow(DeleteImmediateEffect(optionEffect[0].id, optionEffect), "你可以放棄這些效果")];
			return r1.concat(r2);
		}
	}
	// 一個切入結束時，由主動玩家執行處理堆疊結束的行為
	if (ctx.flowMemory.shouldTriggerStackEffectFinishedEvent) {
		final isActivePlayer = getActivePlayerIdAndAssert(ctx) == playerId;
		if (isActivePlayer == false) {
			return [createFlow(WaitPlayer, "等待主動玩家處理")];
		}
		return [createFlow(SystemHandle(StackEffectFinished), "處理堆疊結束")];
	}
	// 切入
	{
		final myCommandList = getClientCommand(ctx, playerId);
		final blocks = getTopCut(ctx);
		// 處理堆疊效果，從最上方開始處理
		if (blocks.length > 0) {
			// 取得最上方的效果
			final effect = blocks[0];
			// 取得效果的控制者
			final controller = getEffectRuntime(ctx, effect).getResponsePlayerId();
			// 判斷切入流程
			final isAllPassCut = ctx.flowMemory.hasPlayerPassCut[PlayerId.A] && ctx.flowMemory.hasPlayerPassCut[PlayerId.B];
			// 如果雙方玩家還沒放棄切入
			if (isAllPassCut == false) {
				// 如果我宣告了放棄切入，回傳取消
				final isPassCut = ctx.flowMemory.hasPlayerPassCut[playerId];
				if (isPassCut) {
					return [createFlow(CancelPassCut, "")];
				}
				// 雙方現在都可以切入，但要判斷切入的優先權在誰那
				// 如果堆疊最上方的控制者是自己，則優先權在對方。必須等對方宣告放棄切入
				if (controller == playerId) {
					final opponentPlayerID = ~(playerId);
					final isOpponentPassCut = ctx.flowMemory.hasPlayerPassCut[opponentPlayerID];
					if (isOpponentPassCut == false) {
						return [createFlow(WaitPlayer, "現在的切入優先權在對方")];
					}
				}
				// 可以切入的指令
				final r1 = myCommandList.length == 0 ? [] : [createFlow(SetActiveEffectId(myCommandList[0].id, myCommandList), "你可以切入")];
				// 宣告放棄切入
				final r2 = [createFlow(PassCut, "")];
				return r1.concat(r2);
			}
			// 雙方都已放棄切入，等待堆疊中的效果控制者處理
			if (controller != playerId) {
				return [createFlow(WaitPlayer, "等待效果控制者處理")];
			}
			return [createFlow(SetActiveEffectId(effect.id, [effect]), "支付最上方的堆疊效果")];
		}
	}
	// 處理自由時間，必須雙方都宣告結束才能進行到下一步
	{
		final myCommandList = getClientCommand(ctx, playerId);
		switch getTiming(ctx) {
			case Default(_, _, Free1 | Free2):
				final isAllPassPhase = ctx.flowMemory.hasPlayerPassPhase[PlayerId.A] && ctx.flowMemory.hasPlayerPassPhase[PlayerId.B];
				if (isAllPassPhase == false) {
					if (ctx.flowMemory.hasPlayerPassPhase[playerId]) {
						return [createFlow(CancelPassPhase, '等待對方結束或是取消[${ctx.timing}]結束')];
					}
					final r1 = myCommandList.length == 0 ? [] : [createFlow(SetActiveEffectId(myCommandList[0].id, myCommandList), "選擇一個指令")];
					final r2 = [createFlow(PassPhase, '宣告[${ctx.timing}]結束')];
					return r1.concat(r2);
				}
				if (playerId != getActivePlayerIdAndAssert(ctx)) {
					return [createFlow(WaitPlayer, "等待伺服器處理")];
				}
				return [createFlow(NextTiming, "")];
			case _:
		}
	}
	// 之後的都是系統事件，由主動玩家呼叫
	{
		if (playerId != getActivePlayerIdAndAssert(ctx)) {
			return [createFlow(WaitPlayer, "等待伺服器處理")];
		}
		switch ctx.flowMemory.state {
			case PrepareDeck:
				if (ctx.flowMemory.hasTriggerEvent) {
					return [createFlow(NextTiming, "")];
				}
				return [createFlow(SystemHandle(PrepareDeck), "")];
			case WhoFirst:
				if (ctx.flowMemory.hasTriggerEvent) {
					return [createFlow(NextTiming, "")];
				}
				return [createFlow(SystemHandle(WhoFirst), "")];
			case Draw6AndConfirm:
				if (ctx.flowMemory.hasTriggerEvent) {
					return [createFlow(NextTiming, "")];
				}
				return [createFlow(SystemHandle(Draw6AndConfirm), "")];
			case Playing:
			// ignore
			case _:
				throw new haxe.Exception('unknown state: ${ctx.flowMemory.state}');
		}
		switch getTiming(ctx) {
			case Default(Draw, None, Rule):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [createFlow(NextTiming, "")];
				}
				return [createFlow(SystemHandle(DrawRule), "")];
			case Default(Reroll, None, Rule):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [createFlow(NextTiming, "")];
				}
				return [createFlow(SystemHandle(RerollRule), "")];
			case Default(Battle, Some(Attack), Rule):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [createFlow(NextTiming, "")];
				}
				return [createFlow(SystemHandle(AttackRule), "")];
			case Default(Battle, Some(Defense), Rule):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [createFlow(NextTiming, "")];
				}
				return [createFlow(SystemHandle(DefenceRule), "")];
			case Default(Battle, Some(DamageChecking), Rule):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [createFlow(NextTiming, "")];
				}
				return [createFlow(SystemHandle(DamageRule), "")];
			case Default(Battle, Some(Return), Rule):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [createFlow(NextTiming, "")];
				}
				return [createFlow(SystemHandle(ReturnRule), "")];
			case Default(Battle, Some(End), DamageReset):
			case Default(Battle, Some(End), ResolveEffect):
			case Default(Battle, Some(End), AdjustHand):
			case Default(Battle, Some(End), TurnEnd):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [createFlow(NextTiming, "")];
				}
				return [createFlow(SystemHandle(TriggerEvent(ChangePhase)), "")];
			case Default(_, _, Start | End):
				// 如果已經觸發事件
				if (ctx.flowMemory.hasTriggerEvent) {
					return [createFlow(NextTiming, "")];
				}
				return [createFlow(SystemHandle(TriggerEvent(ChangePhase)), "")];
			case _:
		}
	}
	return [];
}

function getClientCommand(ctx:IFlowComponent, playerId:PlayerId):Array<Effect> {
	final infos = getRuntimeText(ctx).filter(info -> {
		return true;
	});
	return [];
}

function addDrawRuleEffect(ctx:IFlowComponent):Void {}
function addRerollRuleEffect(ctx:IFlowComponent):Void {}
function test() {}
