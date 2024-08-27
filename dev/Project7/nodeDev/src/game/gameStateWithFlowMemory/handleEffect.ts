import { log2 } from "../../tool/logger";
import { filterEffect, iterateEffect, reduceEffect } from "../gameState/EffectStackComponent";
import { doBlockPayload, getBlockOwner } from "../gameState/GameState";
import { GameStateWithFlowMemory } from "./GameStateWithFlowMemory";

export function setActiveEffectID(
  ctx: GameStateWithFlowMemory,
  playerID: string,
  effectID: string
): GameStateWithFlowMemory {
  if (ctx.activeEffectID != null) {
    throw new Error("有人在執行其它指令");
  }
  if (ctx.activeEffectID != null) {
    const currentActiveEffect = iterateEffect(ctx).find(
      (e) => e.id == ctx.activeEffectID
    );
    if (currentActiveEffect != null) {
      const controller = getBlockOwner(currentActiveEffect);
      if (controller != playerID) {
        throw new Error("[cancelCommand] 你不是控制者");
      }
      if (currentActiveEffect.requirePassed) {
        throw new Error("[cancelCommand] 已經處理需求的不能取消");
      }
    }
  }
  const effect = iterateEffect(ctx).find((e) => e.id == effectID);
  if (effect == null) {
    throw new Error("effect not found");
  }
  const controller = getBlockOwner(effect);
  if (controller != playerID) {
    throw new Error("[cancelCommand] 你不是控制者");
  }
  return {
    ...ctx,
    activeEffectID: effectID
  };
}

export function cancelActiveEffectID(
  ctx: GameStateWithFlowMemory,
  playerID: string
): GameStateWithFlowMemory {
  if (ctx.activeEffectID == null) {
    throw new Error("[cancelEffectID] activeEffectID not exist");
  }
  const effect = iterateEffect(ctx).find(
    (e) => e.id == ctx.activeEffectID
  );
  if (effect == null) {
    return ctx;
  }
  const controller = getBlockOwner(effect);
  if (controller != playerID) {
    throw new Error("[cancelEffectID] 你不是控制者");
  }
  if (effect.requirePassed) {
    throw new Error("[cancelEffectID] 已經處理需求的不能取消");
  }
  return {
    ...ctx,
    activeEffectID: null,
  };
}

export function getActiveEffectID(ctx: GameStateWithFlowMemory): string | null {
  return ctx.activeEffectID
}

export function clearActiveEffectID(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
  return {
    ...ctx,
    activeEffectID: null
  }
}

export function doEffect(ctx: GameStateWithFlowMemory, playerID: string, effectID: string): GameStateWithFlowMemory {
  log2("doEffect", effectID);
  // 判斷這個效果是否正在支付，不然不應該執行
  if (getActiveEffectID(ctx) != effectID) {
    throw new Error("activeEffectID != effectID");
  }
  // 暫存原本的效果, 用來發送當堆疊結束時的事件
  const stackEffect = ctx.stackEffect.find((e) => e.id == effectID);
  // 處理事件
  ctx = reduceEffect(
    ctx,
    (ctx, effect) => {
      if (effect.id != effectID) {
        return ctx;
      }
      return doBlockPayload(ctx, effect) as GameStateWithFlowMemory;
    },
    ctx
  );
  // 清除旗標，代表現在沒有正在支付的效果
  ctx = clearActiveEffectID(ctx) as GameStateWithFlowMemory;

  // 將效果移除
  ctx = filterEffect(ctx, (effect) => {
    return effect.requirePassed != true;
  }) as GameStateWithFlowMemory;
  // 如果是堆疊事件，將事件移到堆疊記憶去
  const isStackEffect = stackEffect != null;
  if (isStackEffect) {
    ctx = {
      ...ctx,
      stackEffectMemory: [...ctx.stackEffectMemory, stackEffect],
    };
  }
  // 是否堆疊結束
  // 觸發切入解決事件，並清空堆疊記憶
  const isStackFinished =
    isStackEffect && ctx.stackEffect.length == 0;
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
  return filterEffect(ctx, (effect) => {
    if (effect.id != effectID) {
      return true;
    }
    const controller = getBlockOwner(effect);
    if (controller != playerID) {
      throw new Error("you are not controller");
    }
    if (effect.isOption != true) {
      throw new Error("isOption must true");
    }
    return false;
  }) as GameStateWithFlowMemory;
}