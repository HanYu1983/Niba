import { assoc, dissoc } from "ramda";
import { Effect } from "../define/Effect";
import { ToolFn } from "../tool";

export type EffectStackComponent = {
  // 立即效果。玩家必須立即一個一個進行處理
  immediateEffect: string[];
  // 堆疊效果。每次只處理第一個代表top的block
  stackEffect: string[];
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

export function getDestroyEffects(ctx: EffectStackComponent): Effect[] {
  return Object.keys(getEffects(ctx))
    .filter(id => isStackEffect(ctx, id))
    .map(id => getEffect(ctx, id))
    .filter(e => e.reason[0] == "Destroy")
}