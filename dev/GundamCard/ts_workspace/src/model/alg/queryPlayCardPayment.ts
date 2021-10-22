import { mapCard, moveCard, getCard } from "../../tool/table";
import { Context, Action, Payment, Effect } from "../../tool/types";
import { askCardPlayPayment } from ".";

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
}
