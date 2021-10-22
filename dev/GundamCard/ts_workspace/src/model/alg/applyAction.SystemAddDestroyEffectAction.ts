import { Context, SystemAddDestroyEffectAction } from "../../tool/types";

export function applyAction_SystemAddDestroyEffectAction(
  ctx: Context,
  playerID: string,
  action: SystemAddDestroyEffectAction
): Context {
  if (ctx.gameState.destroyEffect.length == 0) {
    throw new Error("沒有破壞卡要處理");
  }
  const topDestryEffect = ctx.gameState.destroyEffect[0];
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      destroyEffect: ctx.gameState.destroyEffect.slice(1),
      effectStack: {
        ...ctx.gameState.effectStack,
        effects: [topDestryEffect, ...ctx.gameState.effectStack.effects],
      },
    },
  };
}
