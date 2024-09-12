import { Effect } from "../define/Effect";
import * as R from 'ramda'

export type EffectStackComponent = {
  // 指令效果
  commandEffect: string[];
  // 立即效果。玩家必須立即一個一個進行處理
  immediateEffect: string[];
  // 堆疊效果。每次只處理第一個代表top的block
  stackEffect: string[];

  effects: { [key: string]: Effect };
}

export function isStackEffect(ctx:EffectStackComponent, id:string):boolean{
  return ctx.stackEffect.includes(id);
}

export function isImmediateEffect(ctx:EffectStackComponent, id:string):boolean{
  return ctx.immediateEffect.includes(id);
}

export function getTopEffect(ctx: EffectStackComponent): Effect | null {
  if (ctx.stackEffect.length === 0) {
    return null;
  }
  const topEffectId = ctx.stackEffect[0];
  return ctx.effects[topEffectId];
}

export function getEffect(ctx: EffectStackComponent, id: string): Effect | null {
  return ctx.effects[id]
}

export function removeEffect(ctx: EffectStackComponent, id: string): EffectStackComponent {
  const updatedEffects: EffectStackComponent = {
    ...ctx,
    effects: {
      ...ctx.effects
    },
    stackEffect: ctx.stackEffect.filter(_id => _id != id),
    immediateEffect: ctx.immediateEffect.filter(_id => _id != id),
    commandEffect: ctx.commandEffect.filter(_id => _id != id),
  };

  delete updatedEffects.effects[id]
  return updatedEffects
}

export function addStackEffect(ctx: EffectStackComponent, block: Effect): EffectStackComponent {
  return {
    ...ctx,
    stackEffect: [block.id, ...ctx.stackEffect],
  };
}

export function addImmediateEffect(ctx: EffectStackComponent, block: Effect): EffectStackComponent {
  return {
    ...ctx,
    immediateEffect: [block.id, ...ctx.immediateEffect],
  };
}