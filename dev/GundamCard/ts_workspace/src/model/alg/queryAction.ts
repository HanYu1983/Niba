import { mapCard, moveCard } from "../../tool/table";
import { Context, Action, Payment, Effect } from "../../tool/types";
import { askPlayerG, cardPositionID } from ".";

export function queryAction(ctx: Context, playerID: string): Action[] {
  const ret: Action[] = [];
  if (ctx.paymentTable.action?.playerID == playerID) {
    // 支付狀態
    ret.push({
      id: "CancelPaymentAction",
      playerID: playerID,
    });
    ret.push({
      id: "ApplyPaymentAction",
      playerID: playerID,
    });
    return ret;
  }
  {
    // 正常狀態
    const hands =
      ctx.table.cardStack[
        cardPositionID({ playerID: playerID, where: "hand" })
      ] || [];
    const actions = hands.flatMap((card): Action => {
      return {
        id: "PlayCardAction",
        cardID: card.id,
        playerID: playerID,
        position: null,
      };
    });
    ret.push(...actions);
  }
  return ret;
}
