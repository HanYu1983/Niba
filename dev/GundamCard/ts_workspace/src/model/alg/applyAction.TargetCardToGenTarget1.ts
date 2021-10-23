import { mapCard, moveCard } from "../../tool/table";
import { Context, TargetCardToGenTarget1 } from "../../tool/types";

export function applyAction_TargetCardToGenTarget1(
  ctx: Context,
  playerID: string,
  action: TargetCardToGenTarget1
): Context {
  if (ctx.gameState.paymentTable.action == null) {
    throw new Error("現在沒有支付的必要");
  }
  if (action.cardID == null) {
    throw new Error("你必須指定cardID");
  }
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      paymentTable: {
        ...ctx.gameState.paymentTable,
        currents: [
          ...ctx.gameState.paymentTable.currents,
          {
            id: "Target1Payment",
            cardID: action.cardID,
            playerID: action.playerID,
            tipCardID: [],
          },
        ],
      },
    },
  };
  return ctx;
}
