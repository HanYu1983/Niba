import { EffectStackComponent, iterateEffect } from "./EffectStackComponent";
import { getBlockOwner } from "./GameState";

export type ActiveEffectComponent = {
  activeEffectID: string | null;
} & EffectStackComponent

export function setActiveEffectID(
  ctx: ActiveEffectComponent,
  playerID: string,
  effectID: string
): ActiveEffectComponent {
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
  ctx: ActiveEffectComponent,
  playerID: string
): ActiveEffectComponent {
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