import { assoc, dissoc } from "ramda";
import { DestroyReason, Effect, EffectFn } from "../define/Effect";
import { ToolFn } from "../tool";
import { GameState } from "./GameState";
import { createDestroyEffect } from "./createDestroyEffect";
import { getItemStateValues } from "./ItemStateComponent";
import { getItemController } from "./ItemTableComponent";
import { getSetGroupBattlePoint } from "./setGroup";

export type EffectStackComponent = {
  // 立即效果。玩家必須立即一個一個進行處理
  immediateEffect: string[];
  // 堆疊效果。每次只處理第一個代表top的block
  stackEffect: string[];
  // p71最後部隊的處理有寫到以下的內容(也可參考p50)
  // 專門給破壞效果用的用的堆疊
  // 傷害判定結束時，將所有破壞產生的廢棄效果丟到這，重設「決定解決順序」的旗標為真
  // 如果這個堆疊一有值時並「決定解決順序」為真時，就立刻讓主動玩家決定解決順序，決定完後，將旗標設為假
  // 旗標為假時，才能才能開放給玩家切入
  // 這個堆疊解決完後，才回復到本來的堆疊的解決程序
  destroyEffect: string[];
  effects: { [key: string]: Effect };
}

export function isStackEffect(ctx: EffectStackComponent, id: string): boolean {
  return ctx.stackEffect.includes(id);
}

export function isImmediateEffect(ctx: EffectStackComponent, id: string): boolean {
  return ctx.immediateEffect.includes(id);
}

export function getTopEffect(ctx: EffectStackComponent): Effect | null {
  if (ctx.stackEffect.length === 0) {
    return null;
  }
  const topEffectId = ctx.stackEffect[0];
  return ctx.effects[topEffectId];
}

export function getEffect(ctx: EffectStackComponent, id: string): Effect {
  if (ctx.effects[id] == null) {
    throw new Error(`effect not found: ${id}`)
  }
  return ctx.effects[id]
}

export function getEffects(ctx: EffectStackComponent) {
  return ctx.effects
}

export function removeEffect(ctx: EffectStackComponent, id: string): EffectStackComponent {
  return {
    ...ctx,
    effects: dissoc(id, ctx.effects),
    stackEffect: ctx.stackEffect.filter(_id => _id != id),
    immediateEffect: ctx.immediateEffect.filter(_id => _id != id),
  }
}

export function addStackEffect(ctx: EffectStackComponent, block: Effect): EffectStackComponent {
  if (block.id == "") {
    block.id = ToolFn.getUUID("addStackEffect")
  }
  if (block.text.id == "") {
    block.text.id = ToolFn.getUUID("addStackEffect")
  }
  return {
    ...ctx,
    stackEffect: [block.id, ...ctx.stackEffect],
    effects: assoc(block.id, block, ctx.effects),
  };
}

export function addImmediateEffect(ctx: EffectStackComponent, block: Effect): EffectStackComponent {
  if (block.id == "") {
    block.id = ToolFn.getUUID("addImmediateEffect")
  }
  if (block.text.id == "") {
    block.text.id = ToolFn.getUUID("addImmediateEffect")
  }
  return {
    ...ctx,
    immediateEffect: [block.id, ...ctx.immediateEffect],
    effects: assoc(block.id, block, ctx.effects),
  };
}

export function addDestroyEffect(ctx: EffectStackComponent, block: Effect): EffectStackComponent {
  if (block.id == null) {
    block.id = ToolFn.getUUID("addDestroyEffect")
  }
  if (block.text.id == "") {
    block.text.id = ToolFn.getUUID("addDestroyEffect")
  }
  return {
    ...ctx,
    destroyEffect: [block.id, ...ctx.destroyEffect],
    effects: {
      ...ctx.effects,
      [block.id]: block
    }
  };
}

export function clearDestroyEffects(ctx: EffectStackComponent): EffectStackComponent {
  return {
    ...ctx,
    destroyEffect: []
  }
}

export function getDestroyEffects(ctx: EffectStackComponent): Effect[] {
  return Object.keys(getEffects(ctx))
    .filter(id => isStackEffect(ctx, id))
    .map(id => getEffect(ctx, id))
    .filter(e => e.reason[0] == "Destroy")
}

// 移除破壞效果，全部移到堆疊
export function pushDestroyEffectsToStackAndClear(ctx: EffectStackComponent, ordered?: Effect[]): EffectStackComponent {
  if (ordered) {
    ctx = clearDestroyEffects(ctx)
    for (const effect of ordered) {
      ctx = addStackEffect(ctx, effect)
    }
    return ctx
  }
  const destryEffectIds = ctx.destroyEffect
  ctx = {
    ...ctx,
    destroyEffect: [],
    stackEffect: [...destryEffectIds, ...ctx.stackEffect]
  }
  return ctx
}

