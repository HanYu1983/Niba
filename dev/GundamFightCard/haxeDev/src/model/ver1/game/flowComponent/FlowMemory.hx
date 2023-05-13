package model.ver1.game.flowComponent;

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
	//hasEffectRequireActionHandled:Map<String, Bool>,
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
