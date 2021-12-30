import { Context, AddPaymentAction } from "../../types";

export function applyAction_AddPaymentAction(
  ctx: Context,
  playerID: string,
  action: AddPaymentAction
): Context {
  if (ctx.gameState.paymentTable.action == null) {
    throw new Error("no payment");
  }
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      paymentTable: {
        ...ctx.gameState.paymentTable,
        currents: [...ctx.gameState.paymentTable.currents, action.payment],
      },
    },
  };
}
