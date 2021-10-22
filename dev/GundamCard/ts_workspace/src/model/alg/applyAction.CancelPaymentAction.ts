import { Context, CancelPaymentAction } from "../../tool/types";

export function applyAction_CancelPaymentAction(
  ctx: Context,
  playerID: string,
  action: CancelPaymentAction
): Context {
  if (ctx.gameState.paymentTable.action == null) {
    return ctx;
  }
  if (ctx.gameState.paymentTable.isLock) {
    throw new Error("必須完成這個支付");
  }
  if (ctx.gameState.paymentTable.snapshot == null) {
    throw new Error("snapshot not found");
  }
  if (ctx.gameState.paymentTable.action.playerID != playerID) {
    throw new Error("your are not owner");
  }
  return ctx.gameState.paymentTable.snapshot;
}
