import { assoc, toPairs } from "ramda";
import { Table, TableFns } from "../../tool/table";
import { AbsoluteBaSyou, BaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { PlayerID } from "../define/PlayerID";
import { Card } from "../define/Card";
import { ToolFn } from "../tool";
import { logCategory } from "../../tool/logger";
import { EventCenterFn } from "./EventCenter";

export type CardTableComponent = {
  table: Table
  cards: { [key: string]: Card }
}

export function getCard(ctx: CardTableComponent, cardId: string): Card {
  if (ctx.cards[cardId] == null) {
    throw new Error(`card not found: ${cardId}`)
  }
  return ctx.cards[cardId];
}

export function setCard(ctx: CardTableComponent, id: string, card: Card): CardTableComponent {
  const oldCard = getCard(ctx, id)
  ctx = {
    ...ctx,
    cards: {
      ...ctx.cards,
      [id]: card
    }
  }
  ctx = EventCenterFn.onCardChange(ctx, oldCard, getCard(ctx, id))
  return ctx
}

export function mapCard(ctx: CardTableComponent, id: string, f: (card: Card) => Card): CardTableComponent {
  return setCard(ctx, id, f(getCard(ctx, id)))
}

export function getCardIds(ctx: CardTableComponent): string[] {
  return Object.keys(ctx.cards);
}

export function getCards(ctx: CardTableComponent): Card[] {
  return Object.values(ctx.cards)
}

export function mapCardsWithBasyou(ctx: CardTableComponent, f: (key: AbsoluteBaSyou, card: Card) => Card): CardTableComponent {
  return toPairs(ctx.table.cardStack).map(([k, cardIds]) => {
    const basyou = AbsoluteBaSyouFn.fromString(k)
    const cards = cardIds.map(cardId => getCard(ctx, cardId))
    return [basyou, cards] as [AbsoluteBaSyou, Card[]]
  }).reduce((ctx, [basyou, cards]) => {
    return cards.map(card => f(basyou, card)).reduce((ctx, card) => setCard(ctx, card.id, card), ctx)
  }, ctx)
}

export function createCardWithProtoIds(ctx: CardTableComponent, basyou: AbsoluteBaSyou, cardProtoIds: string[]): CardTableComponent {
  const cardLen = Object.keys(ctx.cards).length
  ctx = addCards(ctx, basyou, cardProtoIds.map((protoId, i) => {
    const ownerID = AbsoluteBaSyouFn.getPlayerID(basyou)
    const cardId = `${ownerID}_${cardLen + i}`
    return {
      id: cardId,
      protoID: protoId,
      ownerID: ownerID,
    }
  }))
  return ctx;
}

export function addCards(ctx: CardTableComponent, basyou: AbsoluteBaSyou, addedCards: Card[]): CardTableComponent {
  const old = ctx.table
  ctx = addedCards.reduce((ctx, newCard) => {
    const ownerID = AbsoluteBaSyouFn.getPlayerID(basyou)
    if (newCard.id == "") {
      const cardLen = Object.keys(ctx.cards).length
      const cardId = `${ownerID}_${cardLen}`
      newCard.id = cardId
    }
    if (newCard.ownerID == null) {
      newCard.ownerID = ownerID
    }
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
  ctx = EventCenterFn.onTableChange(ctx, old, ctx.table)
  return ctx
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


