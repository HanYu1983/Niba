import { mapCard, moveCard } from "../../../tool/table";
import {
  Context,
  ApplyPaymentAction,
  Payment,
  Effect,
  mapPlayerState,
  isEveryConfirmPhase,
} from "../../types";
import { checkPayment } from "./checkPayment";

export function applyAction_ApplyPaymentAction(
  ctx: Context,
  playerID: string,
  action: ApplyPaymentAction
): Context {
  if (ctx.gameState.paymentTable.action == null) {
    throw new Error("no payment");
  }
  if (ctx.gameState.paymentTable.action.playerID != playerID) {
    throw new Error("your are not owner");
  }
  const [passed, reasons] = checkPayment(ctx, playerID);
  if (passed == false) {
    throw new Error(reasons.map((reason) => reason.id).join(","));
  }
  const effect: Effect = {
    id: "ActionEffect",
    action: ctx.gameState.paymentTable.action,
    currents: ctx.gameState.paymentTable.currents,
  };
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      // clear payment table
      paymentTable: {
        ...ctx.gameState.paymentTable,
        action: null,
        snapshot: null,
      },
      // add effect to stack
      effectStack: {
        effects: [effect, ...ctx.gameState.effectStack.effects],
      },
    },
  };
}
