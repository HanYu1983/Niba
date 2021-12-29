import { mapCard, moveCard, getCard } from "../../tool/table";
import { Context, Action, Payment, Effect } from "../../tool/types";
import { askCardPlayAbilityPayment } from "./tool";

export function queryPlayCardAbilityPayment(
  ctx: Context,
  playerID: string,
  cardID: string,
  abilityID: string
): Payment[] {
  const card = getCard(ctx.gameState.table, cardID);
  if (card == null) {
    throw new Error(`card not found: ${cardID}`);
  }
  return askCardPlayAbilityPayment(ctx, card, abilityID);
}
