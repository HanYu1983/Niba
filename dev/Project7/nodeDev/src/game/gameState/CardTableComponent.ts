import { assoc, toPairs } from "ramda";
import { Table, TableFns } from "../../tool/table";
import { AbsoluteBaSyou, BaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { getOpponentPlayerID, PlayerID } from "../define/PlayerID";

// card
export type Card = {
  id: string
  ownerID?: string
  protoID?: string
  isRoll?: boolean
  isFaceDown?: boolean
}

export const DEFAULT_CARD: Card = {
  id: "",
}

export const CardFn = {
  setIsRoll(ctx: Card, isRoll: boolean): Card {
    return {
      ...ctx,
      isRoll: isRoll
    }
  }
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

export function setCard(ctx: CardTableComponent, id: string, card: Card): CardTableComponent {
  return {
    ...ctx,
    cards: {
      ...ctx.cards,
      [id]: card
    }
  }
}

export function getCardIds(ctx: CardTableComponent): string[] {
  return Object.keys(ctx.cards);
}

export function getCards(ctx: CardTableComponent): Card[] {
  return Object.values(ctx.cards)
}

export function getCardIdsByBasyou(ctx: CardTableComponent, basyou: AbsoluteBaSyou): string[] {
  return TableFns.getCardsByPosition(ctx.table, AbsoluteBaSyouFn.toString(basyou))
}

export function mapCardsWithBasyou(ctx: CardTableComponent, f: (key: AbsoluteBaSyou, card: Card) => Card): CardTableComponent {
  return toPairs(ctx.table.cardStack).map(([k, cardIds]) => {
    const basyou = AbsoluteBaSyouFn.fromString(k)
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
    const table = TableFns.addCard(ctx.table, AbsoluteBaSyouFn.toString(basyou), newCard.id)
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
  return AbsoluteBaSyouFn.fromString(cardPosition);
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


