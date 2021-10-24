import { Context, CardState, defaultCardState } from "../../tool/types";
import { Card, getCard, Table } from "../../tool/table";
import { askCardPower } from "./askCardPower";

export function mapCardState(
  ctx: Context,
  cardIDs: string[],
  mapF: (cardID: string, card: Card, cardState: CardState) => CardState
): Context {
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      cardState: cardIDs.reduce((cardState, cardID) => {
        const card = getCard(ctx.gameState.table, cardID);
        if (card == null) {
          throw new Error(`card not found: cardID:${cardID}`);
        }
        if (card.ownerID == null) {
          throw new Error(`card.ownerID not found: cardID:${cardID}`);
        }
        const [melee, range, live] = askCardPower(ctx, card);
        return {
          ...cardState,
          [cardID]: mapF(
            cardID,
            card,
            cardState[cardID] || {
              ...defaultCardState,
              playerID: card.ownerID,
              live: live || 0,
            }
          ),
        };
      }, ctx.gameState.cardState),
    },
  };
}
