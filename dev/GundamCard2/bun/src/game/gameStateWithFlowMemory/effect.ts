import { assoc } from "ramda";
import { log } from "../../tool/logger";
import { DestroyReason, Effect, EffectFn } from "../define/Effect";
import { doEffect, createCommandEffectTips, clearTipSelectionForUser } from "../gameState/doEffect";
import { getEffect, isStackEffect, removeEffect } from "../gameState/EffectStackComponent";
import { ToolFn } from "../tool";
import { GameStateWithFlowMemory } from "./GameStateWithFlowMemory";
import { getItemStateValues } from "../gameState/ItemStateComponent";
import { getItemController } from "../gameState/ItemTableComponent";
import { getSetGroupBattlePoint } from "../gameState/setGroup";
import { CommandEffecTipFn, CommandEffectTip } from "../define/CommandEffectTip";
import { TargetMissingError } from "../define/GameError";

export function getEffectIncludePlayerCommand(ctx: GameStateWithFlowMemory, effectId: string): Effect {
  return ctx.commandEffects.find(cmd => cmd.id == effectId) || getEffect(ctx, effectId)
}
export function setActiveEffectID(
  ctx: GameStateWithFlowMemory,
  playerID: string,
  effectID: string
): GameStateWithFlowMemory {
  const activeEffectID = getActiveEffectID(ctx)
  if (activeEffectID != null) {
    throw new Error("有人在執行其它指令");
  }
  if (activeEffectID != null) {
    const currentActiveEffect = getEffectIncludePlayerCommand(ctx, activeEffectID)
    if (currentActiveEffect != null) {
      const controller = EffectFn.getPlayerID(currentActiveEffect);
      if (controller != playerID) {
        throw new Error("[cancelCommand] 你不是控制者");
      }
      if (currentActiveEffect.requirePassed) {
        throw new Error("[cancelCommand] 已經處理需求的不能取消");
      }
    }
  }
  const effect = getEffectIncludePlayerCommand(ctx, effectID)
  if (effect == null) {
    throw new Error("effect not found");
  }

  const controller = EffectFn.getPlayerID(effect);
  if (controller != playerID) {
    throw new Error("[cancelCommand] 你不是控制者");
  }
  // error
  const cetsNoErr = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
  if (cetsNoErr.length == 0) {
    throw new Error(`cets.length must not 0`)
  }
  if (cetsNoErr.length) {
    const activeLogicID = cetsNoErr[0].logicID
    const activeLogicSubID = cetsNoErr[0].logicSubID
    ctx = {
      ...ctx,
      flowMemory: {
        ...ctx.flowMemory,
        activeLogicID: activeLogicID,
        activeLogicSubID: activeLogicSubID,
      }
    };
    for (const cet of cetsNoErr) {
      ctx = clearTipSelectionForUser(ctx, effect, cet.logicID, cet.logicSubID) as GameStateWithFlowMemory
    }
  }
  ctx = {
    ...ctx,
    flowMemory: {
      ...ctx.flowMemory,
      activeEffectID: effectID
    }
  };
  return ctx
}

export function cancelActiveEffectID(
  ctx: GameStateWithFlowMemory,
  playerID: string
): GameStateWithFlowMemory {
  const activeEffectID = getActiveEffectID(ctx)
  if (activeEffectID == null) {
    throw new Error("[cancelEffectID] activeEffectID not exist");
  }
  const effect = getEffectIncludePlayerCommand(ctx, activeEffectID)
  if (effect == null) {
    return ctx;
  }
  const controller = EffectFn.getPlayerID(effect);
  if (controller != playerID) {
    throw new Error("[cancelEffectID] 你不是控制者");
  }
  if (effect.requirePassed) {
    throw new Error("[cancelEffectID] 已經處理需求的不能取消");
  }
  return {
    ...ctx,
    flowMemory: {
      ...ctx.flowMemory,
      activeEffectID: null,
    }
  };
}

export function getActiveEffectID(ctx: GameStateWithFlowMemory): string | null {
  return ctx.flowMemory.activeEffectID
}

export function clearActiveEffectID(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
  return {
    ...ctx,
    flowMemory: {
      ...ctx.flowMemory,
      activeEffectID: null,
      activeLogicID: null,
      activeLogicSubID: null
    }
  }
}

export function getActiveLogicID(ctx: GameStateWithFlowMemory): number | null {
  return ctx.flowMemory.activeLogicID
}

export function getActiveLogicSubID(ctx: GameStateWithFlowMemory): number | null {
  return ctx.flowMemory.activeLogicSubID
}

export function setActiveLogicID(ctx: GameStateWithFlowMemory, logicID: number, logicSubID: number): GameStateWithFlowMemory {
  return {
    ...ctx,
    flowMemory: {
      ...ctx.flowMemory,
      activeLogicID: logicID,
      activeLogicSubID: logicSubID
    }
  }
}

export function doActiveEffect(ctx: GameStateWithFlowMemory, playerID: string, effectID: string, logicId: number, logicSubId: number): GameStateWithFlowMemory {
  log("doEffect", effectID);
  // 判斷這個效果是否正在支付，不然不應該執行
  if (getActiveEffectID(ctx) != effectID) {
    throw new Error("activeEffectID != effectID");
  }
  // 處理事件
  const effect = getEffectIncludePlayerCommand(ctx, effectID)
  if (effect == null) {
    throw new Error("effect not found")
  }
  const isStackEffect_ = isStackEffect(ctx, effectID)
  try {
    ctx = doEffect(ctx, effect, logicId, logicSubId) as GameStateWithFlowMemory;
  } catch (e) {
    if (e instanceof TargetMissingError) {
      log("doActiveEffect", `=======================`)
      log("doActiveEffect", `對象遺失: ${e.message}`)
    } else {
      throw e
    }
  }
  // 清除旗標，代表現在沒有正在支付的效果
  ctx = clearActiveEffectID(ctx) as GameStateWithFlowMemory;
  // 將效果移除
  ctx = removeEffect(ctx, effectID) as GameStateWithFlowMemory;
  // 如果是堆疊事件，將事件移到堆疊記憶去
  if (isStackEffect_) {
    ctx = {
      ...ctx,
      stackEffectMemory: [...ctx.stackEffectMemory, effect],
    };
  }
  // 是否堆疊結束
  // 觸發切入解決事件，並清空堆疊記憶
  const isStackFinished =
    isStackEffect_ && ctx.stackEffect.length == 0;
  if (isStackFinished) {
    ctx = {
      ...ctx,
      flowMemory: {
        ...ctx.flowMemory,
        shouldTriggerStackEffectFinishedEvent: true,
      },
    };
  }
  return ctx;
}

export function deleteImmediateEffect(
  ctx: GameStateWithFlowMemory,
  playerID: string,
  effectID: string): GameStateWithFlowMemory {
  const effect = getEffect(ctx, effectID)
  if (effect == null) {
    throw new Error("effect not found " + effectID)
  }
  const controller = EffectFn.getPlayerID(effect);
  if (controller != playerID) {
    throw new Error("you are not controller");
  }
  if (effect.isOption != true) {
    throw new Error("isOption must true");
  }
  return removeEffect(ctx, effectID) as GameStateWithFlowMemory
}


export function clearDestroyEffects(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
  return {
    ...ctx,
    destroyEffect: []
  }
}

export function addDestroyEffect(ctx: GameStateWithFlowMemory, block: Effect): GameStateWithFlowMemory {
  if (block.id == null) {
    block.id = ToolFn.getUUID("addDestroyEffect")
  }
  if (block.text.id == "") {
    block.text.id = ToolFn.getUUID("addDestroyEffect")
  }
  return {
    ...ctx,
    destroyEffect: [block, ...ctx.destroyEffect],
  };
}

export function getCommandEffecTips(ctx: GameStateWithFlowMemory): CommandEffectTip[] {
  return ctx.commandEffectTips
}

export function setCommandEffectTips(ctx: GameStateWithFlowMemory, effects: CommandEffectTip[]): GameStateWithFlowMemory {
  return {
    ...ctx,
    commandEffectTips: effects
  };
}

export function setCommandEffects(ctx: GameStateWithFlowMemory, effects: Effect[]): GameStateWithFlowMemory {
  return {
    ...ctx,
    commandEffects: effects
  };
}

export function updateDestroyEffect(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
  // 將所有破壞效果加入破壞用堆疊
  // 加入破壞用堆疊後，主動玩家就必須決定解決順序
  // 決定後，依順序將所有效果移到正在解決中的堆疊，並重設切入的旗標，讓玩家可以在堆疊解決中可以再次切入
  return getItemStateValues(ctx).reduce((ctx, cs) => {
    if (cs.destroyReason) {
      const effect: Effect = {
        id: ToolFn.getUUID("updateDestroyEffect"),
        reason: ["Destroy", cs.destroyReason.playerID, cs.id, cs.destroyReason],
        text: {
          id: ToolFn.getUUID("updateDestroyEffect"),
          title: [],
        }
      }
      ctx = addDestroyEffect(ctx, effect) as GameStateWithFlowMemory
      return ctx
    }
    const [_, _2, hp] = getSetGroupBattlePoint(ctx, cs.id)
    if (hp <= cs.damage) {
      const destroyReason: DestroyReason = {
        id: "マイナスの戦闘修正",
        playerID: getItemController(ctx, cs.id)
      }
      const effect: Effect = {
        id: ToolFn.getUUID("updateDestroyEffect"),
        reason: ["Destroy", destroyReason.playerID, cs.id, destroyReason],
        text: {
          id: ToolFn.getUUID("updateDestroyEffect"),
          title: [],
        }
      }
      ctx = addDestroyEffect(ctx, effect) as GameStateWithFlowMemory
      return ctx
    }
    return ctx
  }, ctx)
}