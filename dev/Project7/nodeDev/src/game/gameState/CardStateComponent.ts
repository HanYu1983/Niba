import {
  CardState,
  DEFAULT_CARD_STATE,
} from "./GameState";

export type CardStateComponent = {
  cardStates: { [key: string]: CardState }
}

export function getCardState(ctx: CardStateComponent, cardID: string): CardState {
  return ctx.cardStates[cardID] || DEFAULT_CARD_STATE;
}

export function mapCardState(ctx: CardStateComponent, f: (key: string, cs: CardState) => CardState): CardStateComponent {
  let cardStates = ctx.cardStates;
  Object.keys(ctx.cardStates).forEach(key => {
    cardStates = {
      ...cardStates,
      [key]: f(key, cardStates[key])
    }
  })
  return {
    ...ctx,
    cardStates
  }
}

// export function getCardState(
//   ctx: GameContext,
//   cardID: string
// ): [GameContext, CardState] {
//   const cardState = ctx.gameState.cardState.find((cs) => {
//     return cs.id == cardID;
//   });
//   if (cardState != null) {
//     return [ctx, cardState];
//   }
//   const card = getCard(ctx, cardID);
//   if (card == null) {
//     throw new Error("[getCardState] card not found");
//   }
//   const [proto, isChip] = ((): [CardPrototype, boolean] => {
//     const chip = ctx.gameState.chipPool[card.protoID];
//     if (chip != null) {
//       return [chip, true];
//     }
//     return [getPrototype(card.protoID), false];
//   })();
//   const newCardState: CardState = {
//     ...DEFAULT_CARD_STATE,
//     id: card.id,
//     isChip: isChip,
//     cardTextStates: proto.texts.map((text, i): CardTextState => {
//       const cardTextStateID = text.cardTextStateID || `${card.id}_${i}`;
//       return {
//         id: cardTextStateID,
//         enabled: true,
//         cardText: {
//           ...text,
//         },
//       };
//     }),
//   };
//   return [
//     {
//       ...ctx,
//       gameState: {
//         ...ctx.gameState,
//         cardState: [...ctx.gameState.cardState, newCardState],
//       },
//     },
//     newCardState,
//   ];
// }

// export function getCardIterator(
//   ctx: GameContext
// ): [
//   GameContext,
//   { id: string; card: Card; baSyou: AbsoluteBaSyou; state: CardState }[]
// ] {
//   const cards: Card[] = [];
//   mapCard(ctx.gameState.table, (card) => {
//     cards.push(card);
//     return card;
//   });
//   const cardBaSyous = cards.map((card) => {
//     return getCardBaSyou(ctx, card.id);
//   });
//   const cardStates = cards.map((card) => {
//     const [nextCtx, cardState] = getCardState(ctx, card.id);
//     ctx = nextCtx;
//     return cardState;
//   });
//   return [
//     ctx,
//     cards.map((card, i) => {
//       return {
//         id: card.id,
//         card: card,
//         baSyou: cardBaSyous[i],
//         state: cardStates[i],
//       };
//     }),
//   ];
// }
