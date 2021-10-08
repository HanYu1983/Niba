import { mapCard, moveCard, getCard } from "../../tool/table";
import { Context, Action, Payment, Effect } from "../../tool/types";
import { askCardType, askPlayerG, cardPositionID, askCardPlayPayment } from ".";

export function queryPlayCardPayment(
  ctx: Context,
  playerID: string,
  cardID: string
): Payment[] {
  const card = getCard(ctx.gameState.table, cardID);
  if (card == null) {
    throw new Error(`card not found: ${cardID}`);
  }
  return askCardPlayPayment(ctx, card);

  // const cardType = askCardType(ctx, card);
  // switch (cardType) {
  // }

  // const payments: Payment[] = [];
  // payments.push(
  //   ...[
  //     {
  //       id: "ColorPayment",
  //       color: "青",
  //       cardID: "",
  //       playerID: playerID,
  //     } as Payment,
  //     {
  //       id: "GCountPayment",
  //       gCount: 2,
  //       playerID: playerID,
  //     } as Payment,
  //   ]
  // );
  // if (false) {
  //   // 私情による裏切り
  //   // （常時）：敵軍キャラ１枚、または敵軍オペ１枚を破壊する。その場合、敵軍は、自分の本国を５回復できる。
  //   payments.push(
  //     ...[
  //       {
  //         id: "Target1Payment",
  //         cardID: null,
  //         playerID: playerID,
  //       } as Payment,
  //       {
  //         id: "ColorPayment",
  //         color: "黒",
  //         cardID: null,
  //         playerID: playerID,
  //       } as Payment,
  //       {
  //         id: "GCountPayment",
  //         gCount: 1,
  //         playerID: playerID,
  //       } as Payment,
  //     ]
  //   );
  // }
  // return payments;
}
