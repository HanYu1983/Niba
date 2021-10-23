import { mapCard, moveCard } from "../../tool/table";
import { Context, TapCardToGenG } from "../../tool/types";

export function applyAction_TapCardToGenG(
  ctx: Context,
  playerID: string,
  action: TapCardToGenG
): Context {
  if (ctx.gameState.paymentTable.action == null) {
    throw new Error("現在沒有支付的必要");
  }
  if (action.color == null) {
    throw new Error("你必須指定color");
  }
  if (action.cardID == null) {
    throw new Error("你必須指定cardID");
  }
  const nextTable = mapCard(ctx.gameState.table, (card) => {
    if (card.id != action.cardID) {
      return card;
    }
    if (card.tap) {
      throw new Error(`G已經橫置，不能使用: ${card}`);
    }
    return { ...card, tap: true };
  });
  if (JSON.stringify(ctx.gameState.table) == JSON.stringify(nextTable)) {
    throw new Error(`找不到你要橫置的卡:${action.cardID}`);
  }
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: nextTable,
      paymentTable: {
        ...ctx.gameState.paymentTable,
        currents: [
          ...ctx.gameState.paymentTable.currents,
          {
            id: "ColorPayment",
            color: action.color,
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
