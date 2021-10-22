import { Context, CardState } from "../../tool/types";
import { Card, getCard, Table } from "../../tool/table";
import { askCardPower } from "./askCardPower";

export function getCardState(
  ctx: Context,
  cardIDs: string[]
): [string, Card, CardState][] {
  return cardIDs.map((cardID) => {
    const card = getCard(ctx.gameState.table, cardID);
    if (card == null) {
      throw new Error(`card not found: cardID:${cardID}`);
    }
    if (card.ownerID == null) {
      throw new Error(`card.ownerID not found: cardID:${cardID}`);
    }
    const [melee, range, live] = askCardPower(ctx, card);
    const cardState = ctx.gameState.cardState[cardID] || {
      playerID: card.ownerID,
      live: live || 0,
    };
    return [cardID, card, cardState];
  });
}
