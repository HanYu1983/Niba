import { assoc, mapObjIndexed, toPairs } from "ramda";
import { Table, TableFns } from "../../tool/table";
import { AbsoluteBaSyou, getBaSyou, getBaSyouID, BaSyou } from "../define/BaSyou";
import { getOpponentPlayerID, PlayerID } from "../define/PlayerID";

// card
export type Card = {
  id: string
  ownerID: string
  protoID: string
  tap: boolean
  faceDown: boolean
}

export const DEFAULT_CARD: Card = {
  id: "",
  ownerID: "",
  protoID: "",
  tap: false,
  faceDown: false
}

export type CardTableComponent = {
  table: Table
  cards: { [key: string]: Card }
}

export function getCard(ctx: CardTableComponent, cardId: string): Card {
  if (ctx.cards[cardId] == null) {
    throw new Error("card not found")
  }
  return ctx.cards[cardId];
}

export function getCardIds(ctx: CardTableComponent): string[] {
  return Object.keys(ctx.cards);
}

export function getCards(ctx: CardTableComponent): Card[] {
  return Object.values(ctx.cards)
}

export function getCardIdsByBasyou(ctx: CardTableComponent, basyou: AbsoluteBaSyou): string[] {
  return TableFns.getCardsByPosition(ctx.table, getBaSyouID(basyou))
}

export function mapCard(ctx: CardTableComponent, f: (key: AbsoluteBaSyou, card: Card) => Card): CardTableComponent {
  return toPairs(ctx.table.cardStack).map(([k, cardIds]) => {
    const basyou = getBaSyou(k)
    const cards = cardIds.map(cardId => getCard(ctx, cardId))
    return [basyou, cards] as [AbsoluteBaSyou, Card[]]
  }).reduce((ctx, [basyou, cards]) => {
    return cards.map(card => f(basyou, card)).reduce((ctx, card) => assoc(card.id, card, ctx), ctx)
  }, ctx)
}

export function createCardWithProtoIds(ctx: CardTableComponent, playerID: PlayerID, basyou: AbsoluteBaSyou, cardProtoIds: string[]): CardTableComponent {
  ctx = addCards(ctx, basyou, cardProtoIds.map((protoId, i) => {
    return {
      ...DEFAULT_CARD,
      id: `card${i}_${protoId}_${new Date().getTime()}_${Math.round(Math.random() * 1000000)}`,
      protoID: protoId,
    }
  }))
  return ctx;
}

export function addCards(ctx: CardTableComponent, basyou: AbsoluteBaSyou, addedCards: Card[]): CardTableComponent {
  ctx = addedCards.reduce((ctx, newCard) => {
    const table = TableFns.addCard(ctx.table, getBaSyouID(basyou), newCard.id)
    return {
      ...ctx,
      table: table,
      cards: {
        ...ctx.cards,
        [newCard.id]: newCard
      }
    }
  }, ctx)
  return ctx
}

export function getCardBaSyou(
  ctx: CardTableComponent,
  cardID: string
): AbsoluteBaSyou {
  const cardPosition = TableFns.getCardPosition(ctx.table, cardID);
  if (cardPosition == null) {
    throw new Error("[getController] cardPosition not found");
  }
  return getBaSyou(cardPosition);
}

export function getCardController(ctx: CardTableComponent, cardID: string): PlayerID {
  const baSyou = getCardBaSyou(ctx, cardID);
  return baSyou.value[0];
}

export function getCardOwner(ctx: CardTableComponent, cardID: string): PlayerID {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("[getCardOwner] card not found");
  }
  if (card.ownerID == null) {
    throw new Error("[getCardOwner] card.ownerID not found");
  }
  return card.ownerID;
}

export function getAbsoluteBaSyou(
  baSyou: BaSyou,
  ctx: CardTableComponent,
  cardID: string
): AbsoluteBaSyou {
  if (baSyou.id == "AbsoluteBaSyou") {
    return baSyou;
  }
  const _playerID = (() => {
    switch (baSyou.value[0]) {
      case "持ち主": {
        const card = getCard(ctx, cardID);
        if (card == null) {
          throw new Error("getAbsoluteBaSyou card not found");
        }
        if (card.ownerID == null) {
          throw new Error("getAbsoluteBaSyou ownerID must not null");
        }
        return card.ownerID;
      }
      case "自軍":
        return getCardController(ctx, cardID);
      case "敵軍":
        return getOpponentPlayerID(getCardController(ctx, cardID));
    }
  })();
  return {
    id: "AbsoluteBaSyou",
    value: [_playerID, baSyou.value[1]],
  };
}