import Table, { TTable } from "../../tool/table";
import { PlayerID, getOpponentPlayerID } from "../define";
import BaSyou, { AbsoluteBaSyou, TBaSyou } from "../define/BaSyou";

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
  table: TTable
  cards: { [key: string]: Card }
}

export function getGundamCard(ctx: CardTableComponent, cardId: string): Card | null {
  return ctx.cards[cardId];
}

export function getGundamCardIds(ctx: CardTableComponent): string[] {
  return Object.keys(ctx.cards);
}

export function mapCard(ctx: CardTableComponent, f: (Card) => Card): CardTableComponent {
  return ctx;
}

export function createGundamCardWithProtoIds(ctx: CardTableComponent, playerID: PlayerID, basyou: AbsoluteBaSyou, cardProtoIds: string[]): CardTableComponent {
  ctx = addGundamCards(ctx, basyou, cardProtoIds.map((protoId, i) => {
    return {
      ...DEFAULT_CARD,
      id: `card${i}_${protoId}_${new Date().getTime()}_${Math.round(Math.random() * 1000000)}`,
      protoID: protoId,
    }
  }))
  return ctx;
}

export function addGundamCards(ctx: CardTableComponent, basyou: AbsoluteBaSyou, addedCards: Card[]): CardTableComponent {
  ctx = addedCards.reduce((ctx, newCard) => {
    const table = Table.addCard(ctx.table, BaSyou.getBaSyouID(basyou), newCard.id)
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
  const cardPosition = Table.getCardPosition(ctx.table, cardID);
  if (cardPosition == null) {
    throw new Error("[getController] cardPosition not found");
  }
  return BaSyou.getBaSyou(cardPosition);
}

export function getCardController(ctx: CardTableComponent, cardID: string): PlayerID {
  const baSyou = getCardBaSyou(ctx, cardID);
  return baSyou.value[0];
}

export function getCardOwner(ctx: CardTableComponent, cardID: string): PlayerID {
  const card = getGundamCard(ctx, cardID);
  if (card == null) {
    throw new Error("[getCardOwner] card not found");
  }
  if (card.ownerID == null) {
    throw new Error("[getCardOwner] card.ownerID not found");
  }
  return card.ownerID;
}

export function getAbsoluteBaSyou(
  baSyou: TBaSyou,
  ctx: CardTableComponent,
  cardID: string
): AbsoluteBaSyou {
  if (baSyou.id == "AbsoluteBaSyou") {
    return baSyou;
  }
  const _playerID = (() => {
    switch (baSyou.value[0]) {
      case "持ち主": {
        const card = getGundamCard(ctx, cardID);
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