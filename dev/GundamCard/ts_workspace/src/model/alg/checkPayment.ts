import { mapCard, moveCard } from "../../tool/table";
import { Context, Action, Payment, Effect } from "../../tool/types";
import { askPlayerG, cardPositionID } from "./tool";

export function checkPayment(
  ctx: Context,
  playerID: string
): [boolean, Payment[]] {
  if (ctx.gameState.paymentTable.action == null) {
    throw new Error("要確認支付，但找不到action。請確定有呼叫");
  }
  const passed: { [key: number]: boolean } = {};
  const consumed: { [key: number]: boolean } = {};
  for (const requireID in ctx.gameState.paymentTable.requires) {
    const require = ctx.gameState.paymentTable.requires[requireID];
    if (require.id == "GCountPayment") {
      if (
        askPlayerG(ctx, ctx.gameState.paymentTable.action.playerID).length <
        require.gCount
      ) {
        continue;
      }
      passed[requireID] = true;
      continue;
    }
    for (const currentID in ctx.gameState.paymentTable.currents) {
      if (consumed[currentID]) {
        continue;
      }
      const current = ctx.gameState.paymentTable.currents[currentID];
      if (require.playerID != current.playerID) {
        continue;
      }
      if (
        require.id == "ColorPayment" &&
        current.id == "ColorPayment" &&
        require.color == current.color
      ) {
        passed[requireID] = true;
        consumed[currentID] = true;
        break;
      }
      if (require.id == "Target1Payment" && current.id == "Target1Payment") {
        passed[requireID] = true;
        consumed[currentID] = true;
        break;
      }
    }
  }
  const isPass =
    Object.keys(passed).length == ctx.gameState.paymentTable.requires.length;
  const reasons = ctx.gameState.paymentTable.requires.filter(
    (_, i) => passed[i] != true
  );
  return [isPass, reasons];
}
