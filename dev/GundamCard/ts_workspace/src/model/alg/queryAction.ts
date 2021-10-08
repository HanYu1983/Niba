import { mapCard, moveCard, Card } from "../../tool/table";
import { Context, Action, Payment, Effect } from "../../tool/types";
import { askPlayerG, cardPositionID, askCardState, askCardAction } from ".";

export function queryAction(ctx: Context, playerID: string): Action[] {
  const ret: Action[] = [];
  if (ctx.gameState.paymentTable.action?.playerID == playerID) {
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
    const myCards: Card[] = [];
    mapCard(ctx.gameState.table, (card) => {
      if (card.ownerID == playerID) {
        myCards.push(card);
      }
      return card;
    });
    const actions = myCards.flatMap((card) => {
      return askCardAction(ctx, card);
    });
    // const hands =
    //   ctx.gameState.table.cardStack[
    //     cardPositionID({ playerID: playerID, where: "hand" })
    //   ] || [];
    // const actions = hands.flatMap((card): Action => {
    //   return {
    //     id: "PlayCardAction",
    //     cardID: card.id,
    //     playerID: playerID,
    //     position: null,
    //   };
    // });
    ret.push(...actions);
  }
  return ret;
}
