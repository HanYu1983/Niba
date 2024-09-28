import { assoc, dissoc } from "ramda";
import { DestroyReason, Effect, EffectFn } from "../define/Effect";
import { ToolFn } from "../tool";
import { GameState } from "./GameState";
import { createDestroyEffect } from "./createDestroyEffect";
import { getItemStateValues } from "./ItemStateComponent";
import { getItemController } from "./ItemTableComponent";
import { getSetGroupBattlePoint } from "./setGroup";
import { CommandEffectTip } from "../define/CommandEffectTip";

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
  // 指令效果
  commandEffects: string[],
  effects: { [key: string]: Effect };
  commandEffectTips: CommandEffectTip[];
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
    destroyEffect: ctx.destroyEffect.filter(_id => _id != id),
  }
}

// 這個方法之前為先用了updateCommand確認了可支付性，所以不必檢查
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

// 和addStackEffect不一樣
// 這是內文產生的立即效果，沒有做可支付性的檢查
// 所以改用addImmediateEffectIfCanPayCost，才會先檢查效果可支付性
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

export function getStackEffects(ctx: EffectStackComponent): Effect[] {
  return ctx.stackEffect.map(id => getEffect(ctx, id))
}

export function getImmediateEffects(ctx: EffectStackComponent): Effect[] {
  return ctx.immediateEffect.map(id => getEffect(ctx, id))
}

export function addDestroyEffect(ctx: EffectStackComponent, block: Effect): EffectStackComponent {
  // 破壞效果不必重復加入
  if (ctx.effects[block.id]) {
    console.warn(`破壞效果不必重復加入: ${block.id}`)
    return ctx
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
  const effects = { ...ctx.effects }
  for (const k of ctx.destroyEffect) {
    delete effects[k]
  }
  return {
    ...ctx,
    destroyEffect: [],
    effects: effects
  }
}

export function getCutInDestroyEffects(ctx: EffectStackComponent): Effect[] {
  return Object.keys(getEffects(ctx))
    .filter(id => isStackEffect(ctx, id))
    .map(id => getEffect(ctx, id))
    .filter(e => e.reason[0] == "Destroy")
}

export function setCommandEffects(ctx: EffectStackComponent, addeds: Effect[]): EffectStackComponent {
  const effects = { ...ctx.effects }
  for (const k of ctx.commandEffects) {
    delete effects[k]
  }
  for (const added of addeds) {
    effects[added.id] = added
  }
  return {
    ...ctx,
    commandEffects: addeds.map(e => e.id),
    effects: effects
  };
}

export function setCommandEffectTips(ctx: EffectStackComponent, effects: CommandEffectTip[]): EffectStackComponent {
  return {
    ...ctx,
    commandEffectTips: effects
  };
}

export function getCommandEffecTips(ctx: GameState): CommandEffectTip[] {
  return ctx.commandEffectTips
}