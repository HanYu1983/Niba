import {
  BlockPayload
} from "../define";

export type EffectStackComponent = {
  // 指令效果
  commandEffect: BlockPayload[];
  // 立即效果。玩家必須立即一個一個進行處理
  immediateEffect: BlockPayload[];
  // 堆疊效果。每次只處理第一個代表top的block
  stackEffect: BlockPayload[];
}

export function iterateEffect(ctx: EffectStackComponent): BlockPayload[] {
  return [
    ...ctx.immediateEffect,
    ...ctx.commandEffect,
    ...ctx.stackEffect,
  ];
}

export function mapEffect(
  ctx: EffectStackComponent,
  doF: (effect: BlockPayload) => BlockPayload
): EffectStackComponent {
  return {
    ...ctx,
    immediateEffect: ctx.immediateEffect.map(doF),
    commandEffect: ctx.commandEffect.map(doF),
    stackEffect: ctx.stackEffect.map(doF),
  };
}

export function reduceEffect<T>(
  ctx: EffectStackComponent,
  doF: (init: T, effect: BlockPayload) => T,
  init: T
): T {
  return [
    ...ctx.immediateEffect,
    ...ctx.commandEffect,
    ...ctx.stackEffect,
  ].reduce(doF, init);
}

export function filterEffect(
  ctx: EffectStackComponent,
  filterF: (effect: BlockPayload) => boolean
): EffectStackComponent {
  return {
    ...ctx,
    immediateEffect: ctx.immediateEffect.filter(filterF),
    commandEffect: ctx.commandEffect.filter(filterF),
    stackEffect: ctx.stackEffect.filter(filterF)
  };
}

export function addStackEffect(ctx: EffectStackComponent, block: BlockPayload): EffectStackComponent {
  return {
    ...ctx,
    stackEffect: [block, ...ctx.stackEffect],
  };
}

export function addImmediateEffect(ctx: EffectStackComponent, block: BlockPayload): EffectStackComponent {
  return {
    ...ctx,
    immediateEffect: [block, ...ctx.immediateEffect],
  };
}