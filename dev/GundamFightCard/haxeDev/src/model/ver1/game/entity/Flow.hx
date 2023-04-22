package model.ver1.game.entity;

import haxe.ds.Option;
import model.ver1.game.define.Define;
import model.ver1.game.define.Player;
import model.ver1.game.define.Block;
import model.ver1.game.entity.Event;
import model.ver1.game.define.Runtime;
import model.ver1.game.component.BlockComponent;
import model.ver1.game.entity.Alg;
import model.ver1.game.entity.Context;

// 宣告結束
function passPhase(memory:FlowMemory, playerId:String):Void {
	memory.hasPlayerPassPhase[playerId] = true;
}

// 取消宣告結束
function cancelPassPhase(memory:FlowMemory, playerId:String):Void {
	memory.hasPlayerPassPhase.remove(playerId);
}

// 清除結束狀態
function resetPassPhase(memory:FlowMemory):Void {
	for (k in memory.hasPlayerPassPhase.keys()) {
		memory.hasPlayerPassPhase.remove(k);
	}
}

// 宣告切入結束
function passCut(memory:FlowMemory, playerId:String):Void {
	memory.hasPlayerPassPayCost[playerId] = true;
}

// 取消宣告切入結束
function cancelPassCut(memory:FlowMemory, playerId:String):Void {
	memory.hasPlayerPassPayCost.remove(playerId);
}

// 清除宣告狀態
function resetPassCut(memory:FlowMemory):Void {
	for (k in memory.hasPlayerPassCut.keys()) {
		memory.hasPlayerPassCut.remove(k);
	}
}

// 清除支付狀態
function resetPassCost(memory:FlowMemory):Void {
	for (k in memory.hasPlayerPassPayCost.keys()) {
		memory.hasPlayerPassPayCost.remove(k);
	}
}

// 是否觸發了事件
function hasTriggerEvent(memory:FlowMemory):Bool {
	return memory.hasTriggerEvent;
}

// 標記事件已觸發
function triggerEvent(memory:FlowMemory):Void {
	memory.hasTriggerEvent = true;
}

// 清除標記事件狀態
function cancelTriggerEvent(memory:FlowMemory):Void {
	memory.hasTriggerEvent = false;
}

// 標記堆疊結束事件已發送
function markTriggerStackEffectFinishedEventDone(memory:FlowMemory):Void {
	memory.shouldTriggerStackEffectFinishedEvent = true;
}

enum FlowType {
	FlowWaitPlayer;
	FlowObserveEffect;
	FlowDoEffect(blockId:String);
	FlowPassPayCost(blockId:String);
	FlowCancelActiveEffect;
	FlowSetActiveEffectId(blockId:String, tips:Array<Block>);
	FlowDeleteImmediateEffect(blockId:String, tips:Array<Block>);
	FlowHandleStackEffectFinished;
	FlowCancelPassCut;
	FlowPassCut;
	FlowPassPhase;
	FlowCancelPassPhase;
	FlowNextTiming;
	FlowTriggerTextEvent(event:Event);
}

enum Flow {
	Default(type:FlowType, description:String);
}

function applyFlow(ctx:Context, playerID:PlayerId, flow:Flow):Void {
	switch flow {
		case Default(FlowSetActiveEffectId(blockId, tips), _):
		case _:
	}
}

function queryFlow(ctx:Context, playerId:PlayerId):Array<Flow> {
	// 是否有玩家牌生命歸0，遊戲結束
	switch hasSomeoneLiveIsZero(ctx) {
		case Some(playerId):
			return [Default(FlowWaitPlayer, "遊戲結束")];
		case _:
	}
	// 有玩家在支付卡片
	switch getActiveBlockId(ctx) {
		case Some(activeBlockId):
			final runtime = getBlockRuntime(ctx, activeBlockId);
			final controller = runtime.getResponsePlayerId();
			final isPass = ctx.flowMemory.hasPlayerPassPayCost[playerId];
			final isOpponentPass = ctx.flowMemory.hasPlayerPassPayCost[~(playerId)];
			if (isPass && isOpponentPass) {
				// 雙方都已支付
				if (controller != playerId) {
					// 非控制者等待
					return [Default(FlowObserveEffect, "")];
				}
				// 控制者可解決效果
				return [Default(FlowDoEffect(activeBlockId), "")];
			} else if (isPass || isOpponentPass) {
				// 其中一方支付
				if (controller == playerId) {
					// 控制者
					if (isPass) {
						// 已支付
						// 等待
						return [Default(FlowObserveEffect, "")];
					}
				} else {
					// 非控制者
					if (isOpponentPass == false) {
						// 對方未支付（自己已支付）
						// 等待
						return [Default(FlowObserveEffect, "")];
					}
					// 對方已支付（自己未支付）
					// 自己宣告已支付
					return [Default(FlowPassPayCost(activeBlockId), "")];
				}
			}
			if (controller != playerId) {
				// 非控制者並雙方都支付
				// 等待控制者解決效果
				return [Default(FlowWaitPlayer, "等待對方支付ActiveEffectID")];
			}
			// 是控制者但未支付
			// 取消支付或宣告已支付
			return [
				Default(FlowCancelActiveEffect, "取消支付效果，讓其它玩家可以支付"),
				Default(FlowPassPayCost(activeBlockId), ""),
			];
		case None:
	}
	// 起動效果
	{
		final immediateEffects = getImmediateEffects(ctx);
		if (immediateEffects.length > 0) {
			final isActivePlayer = ctx.activePlayerId == playerId;
			final myEffect:Array<Block> = [];
			final opponentEffect:Array<Block> = [];
			for (effect in immediateEffects) {
				final controller = getBlockRuntime(ctx, effect.id).getResponsePlayerId();
				if (controller == playerId) {
					myEffect.push(effect);
				} else {
					opponentEffect.push(effect);
				}
			}
			// 不是主動玩家的情況，要等主動玩家先處理完起動效果才行
			if (isActivePlayer == false) {
				if (opponentEffect.length > 0) {
					return [Default(FlowWaitPlayer, "等待主動玩家處理起動效果")];
				}
			}
			// 主動玩家
			if (myEffect.length == 0) {
				return [Default(FlowWaitPlayer, "等待被動玩家處理起動效果")];
			}
			final optionEffect = myEffect.filter((v) -> v.isOption == true);
			final r1:Array<Flow> = myEffect.length == 0 ? [] : [Default(FlowSetActiveEffectId(myEffect[0].id, myEffect), "選擇一個起動效果")];
			final r2:Array<Flow> = optionEffect.length == 0 ? [] : [
				Default(FlowDeleteImmediateEffect(optionEffect[0].id, optionEffect), "你可以放棄這些效果")
			];
			return r1.concat(r2);
		}
	}
	// 一個切入結束時，由主動玩家執行處理堆疊結束的行為
	if (ctx.flowMemory.shouldTriggerStackEffectFinishedEvent) {
		final isActivePlayer = ctx.activePlayerId == playerId;
		if (isActivePlayer == false) {
			return [Default(FlowWaitPlayer, "等待主動玩家處理")];
		}
		return [Default(FlowHandleStackEffectFinished, "處理堆疊結束")];
	}
	// 切入
	{
		final myCommandList = getClientCommand(ctx, playerId);
		final blocks = getBlocks(ctx);
		// 處理堆疊效果，從最上方開始處理
		if (blocks.length > 0) {
			// 取得最上方的效果
			final effect = blocks[0];
			// 取得效果的控制者
			final controller = getBlockRuntime(ctx, effect.id).getResponsePlayerId();
			// 判斷切入流程
			final isAllPassCut = ctx.flowMemory.hasPlayerPassCut[PlayerId.A] && ctx.flowMemory.hasPlayerPassCut[PlayerId.B];
			// 如果雙方玩家還沒放棄切入
			if (isAllPassCut == false) {
				// 如果我宣告了放棄切入，回傳取消
				final isPassCut = ctx.flowMemory.hasPlayerPassCut[playerId];
				if (isPassCut) {
					return [Default(FlowCancelPassCut, "")];
				}
				// 雙方現在都可以切入，但要判斷切入的優先權在誰那
				// 如果堆疊最上方的控制者是自己，則優先權在對方。必須等對方宣告放棄切入
				if (controller == playerId) {
					final opponentPlayerID = ~(playerId);
					final isOpponentPassCut = ctx.flowMemory.hasPlayerPassCut[opponentPlayerID];
					if (isOpponentPassCut == false) {
						return [Default(FlowWaitPlayer, "現在的切入優先權在對方")];
					}
				}
				// 可以切入的指令
				final r1 = myCommandList.length == 0 ? [] : [Flow.Default(FlowSetActiveEffectId(myCommandList[0].id, myCommandList), "你可以切入")];
				// 宣告放棄切入
				final r2 = [Flow.Default(FlowPassCut, "")];
				return r1.concat(r2);
			}
			// 雙方都已放棄切入，等待堆疊中的效果控制者處理
			if (controller != playerId) {
				return [Default(FlowWaitPlayer, "等待效果控制者處理")];
			}
			return [Default(FlowSetActiveEffectId(effect.id, [effect]), "支付最上方的堆疊效果")];
		}
	}
	// 處理自由時間，必須雙方都宣告結束才能進行到下一步
	{
		final myCommandList = getClientCommand(ctx, playerId);
		switch ctx.timing {
			case Default(_, _, Free1 | Free2):
				final isAllPassPhase = ctx.flowMemory.hasPlayerPassPhase[PlayerId.A] && ctx.flowMemory.hasPlayerPassPhase[PlayerId.B];
				if (isAllPassPhase == false) {
					if (ctx.flowMemory.hasPlayerPassPhase[playerId]) {
						return [Default(FlowCancelPassPhase, '等待對方結束或是取消[${ctx.timing}]結束')];
					}
					final r1 = myCommandList.length == 0 ? [] : [
						Flow.Default(FlowSetActiveEffectId(myCommandList[0].id, myCommandList), "選擇一個指令")
					];
					final r2 = [Flow.Default(FlowPassPhase, '宣告[${ctx.timing}]結束')];
					return r1.concat(r2);
				}
				if (playerId != ctx.activePlayerId) {
					return [Default(FlowWaitPlayer, "等待伺服器處理")];
				}
				return [Default(FlowNextTiming, "")];
			case _:
		}
	}
	// 之後的都是系統事件，由主動玩家呼叫
	{
		if (playerId != ctx.activePlayerId) {
			return [Default(FlowWaitPlayer, "等待伺服器處理")];
		}
		switch ctx.timing {
			case Default(Draw, None, Rule):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [Default(FlowNextTiming, "")];
				}
			// TODO
			// addDrawRuleEffect(ctx);
			case Default(Reroll, None, Rule):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [Default(FlowNextTiming, "")];
				}
			// TODO
			// addRerollRuleEffect(ctx);
			case Default(Battle, Some(Attack), Rule):
				// TODO
				if (ctx.flowMemory.hasTriggerEvent) {
					return [Default(FlowNextTiming, "")];
				}
			case Default(Battle, Some(Defense), Rule):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [Default(FlowNextTiming, "")];
				}
			case Default(Battle, Some(DamageChecking), Rule):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [Default(FlowNextTiming, "")];
				}
			case Default(Battle, Some(Return), Rule):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [Default(FlowNextTiming, "")];
				}
			case Default(Battle, Some(End), DamageReset):
			case Default(Battle, Some(End), ResolveEffect):
			case Default(Battle, Some(End), AdjustHand):
			case Default(Battle, Some(End), TurnEnd):
				if (ctx.flowMemory.hasTriggerEvent) {
					return [Default(FlowNextTiming, "")];
				}
				return [Default(FlowTriggerTextEvent(ChangePhase), "")];
			case Default(_, _, Start | End):
				// 如果已經觸發事件
				if (ctx.flowMemory.hasTriggerEvent) {
					return [Default(FlowNextTiming, "")];
				}
				return [Default(FlowTriggerTextEvent(ChangePhase), "")];
			case _:
		}
	}
	return [];
}

function hasSomeoneLiveIsZero(ctx:Context):Option<String> {
	return None;
}

function getActiveBlockId(ctx:Context):Option<String> {
	return None;
}

function getImmediateEffects(ctx:Context):Array<Block> {
	return [];
}

function getClientCommand(ctx:Context, playerId:String):Array<Block> {
	return [];
}

function addDrawRuleEffect(ctx:Context):Void {}
function addRerollRuleEffect(ctx:Context):Void {}
function test() {}
