import { Context, PlayCardAbilityAction } from "../../tool/types";

export function PlayCardAbilityAction(
  ctx: Context,
  playerID: string,
  action: PlayCardAbilityAction
): Context {
  if (ctx.gameState.paymentTable.action != null) {
    throw new Error(`${ctx.gameState.paymentTable.action.playerID}還在支付中`);
  }
  // TODO: change to payment mode
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      paymentTable: {
        action: action,
        requires: [],
        currents: [],
        snapshot: ctx,
        isLock: false,
      },
    },
  };
  return ctx;
}
