package model.ver1.game.define;

import haxe.ds.Option;
import model.ver1.game.define.Define;
import model.ver1.game.alg.Block;
import model.ver1.game.alg.Context;

enum FlowMemoryState {
	PrepareDeck;
	WhoFirst;
	Draw6AndConfirm;
	Playing;
}

typedef Message = Any;

typedef FlowMemory = {
	state:FlowMemoryState,
	hasTriggerEvent:Bool,
	hasPlayerPassPhase:Map<String, Bool>,
	hasPlayerPassCut:Map<String, Bool>,
	hasPlayerPassPayCost:Map<String, Bool>,
	shouldTriggerStackEffectFinishedEvent:Bool,
	msgs:Array<Message>,
}

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
}

enum Flow {
	Default(type:FlowType, description:String);
}

function queryFlow(ctx:Context, playerId:String):Array<Flow> {
	// 是否有玩家牌生命歸0，遊戲結束
	switch hasSomeoneLiveIsZero(ctx) {
		case Some(playerId):
			return [Default(FlowWaitPlayer, "遊戲結束")];
		case _:
	}
	// 支付行為
	switch getActiveBlockId(ctx) {
		case Some(activeBlockId):
			final runtime = getBlockRuntime(ctx, activeBlockId);
			final controller = runtime.getResponsePlayerId();
			final isPass = ctx.flowMemory.hasPlayerPassPayCost[playerId];
			final isOpponentPass = ctx.flowMemory.hasPlayerPassPayCost[getOpponentPlayerId(playerId)];
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
					// 自宣告已支付
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
	return [];
}

function hasSomeoneLiveIsZero(ctx:Context):Option<String> {
	return None;
}

function getActiveBlockId(ctx:Context):Option<String> {
	return None;
}

function test() {}
