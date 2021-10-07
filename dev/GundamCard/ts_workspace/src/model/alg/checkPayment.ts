import { mapCard, moveCard } from "../../tool/table";
import { Context, Action, Payment, Effect } from "../../tool/types";
import { askPlayerG, cardPositionID } from ".";

export function checkPayment(
  ctx: Context,
  playerID: string
): [boolean, Payment[]] {
  if (ctx.paymentTable.action == null) {
    throw new Error("要確認支付，但找不到action。請確定有呼叫");
  }
  const passed: { [key: number]: boolean } = {};
  const consumed: { [key: number]: boolean } = {};
  for (const requireID in ctx.paymentTable.requires) {
    const require = ctx.paymentTable.requires[requireID];
    if (require.id == "GCountPayment") {
      if (
        askPlayerG(ctx, ctx.paymentTable.action.playerID).length <
        require.gCount
      ) {
        break;
      }
      passed[requireID] = true;
      break;
    }
    for (const currentID in ctx.paymentTable.currents) {
      if (consumed[currentID]) {
        continue;
      }
      const current = ctx.paymentTable.currents[currentID];
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
    }
  }
  const isPass = Object.keys(passed).length == ctx.paymentTable.requires.length;
  const reasons = ctx.paymentTable.requires.filter((_, i) => passed[i] != true);
  return [isPass, reasons];
}
