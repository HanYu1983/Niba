import { Context, AddDestroyEffectAction } from "../../types";

export function applyAction_AddDestroyEffectAction(
  ctx: Context,
  playerID: string,
  action: AddDestroyEffectAction
): Context {
  if (ctx.gameState.destroyEffect.length == 0) {
    throw new Error("沒有破壞卡要處理");
  }
  if (ctx.gameState.effectStack.effects.length) {
    throw new Error("請先處理堆疊中的效果");
  }
  const findEffectIndex = ctx.gameState.destroyEffect.findIndex(
    (e) => e.cardID == action.cardID
  );
  if (findEffectIndex == -1) {
    throw new Error(`找不到正被破壞的卡:${action.cardID}`);
  }
  const destroyEffect = ctx.gameState.destroyEffect[findEffectIndex];
  const nextDestoryEffect = [
    ...ctx.gameState.destroyEffect.slice(0, findEffectIndex),
    ...ctx.gameState.destroyEffect.slice(findEffectIndex + 1),
  ];
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      destroyEffect: nextDestoryEffect,
      effectStack: {
        ...ctx.gameState.effectStack,
        effects: [destroyEffect, ...ctx.gameState.effectStack.effects],
      },
    },
  };
}
