import { mapCard, moveCard } from "../../tool/table";
import { Context, Action, Payment, Effect } from "../../tool/types";
import { askPlayerG, cardPositionID } from ".";

export function queryPlayCardPayment(
  ctx: Context,
  playerID: string,
  cardID: string
): Payment[] {
  const payments: Payment[] = [];
  payments.push(
    ...[
      {
        id: "ColorPayment",
        color: "blue",
        cardID: "",
        playerID: playerID,
      } as Payment,
      {
        id: "GCountPayment",
        gCount: 2,
        playerID: playerID,
      } as Payment,
    ]
  );
  if (false) {
    // 私情による裏切り
    // （常時）：敵軍キャラ１枚、または敵軍オペ１枚を破壊する。その場合、敵軍は、自分の本国を５回復できる。
    payments.push(
      ...[
        {
          id: "Target1Payment",
          cardID: null,
          playerID: playerID,
        } as Payment,
        {
          id: "ColorPayment",
          color: "black",
          cardID: null,
          playerID: playerID,
        } as Payment,
        {
          id: "GCountPayment",
          gCount: 1,
          playerID: playerID,
        } as Payment,
      ]
    );
  }
  return payments;
}
