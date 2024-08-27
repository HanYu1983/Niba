import {
  AbsoluteBaSyou,
  PlayerID,
  BaSyou,
  getOpponentPlayerID,
  getBaSyou,
} from "../define";
import { Table, getCardPosition } from "../../tool/table";

// card
export type Card = {
  id: string
  ownerID: string
  protoID: string
  tap: boolean
}

export type CardTableComponent = {
  table: Table
  cards: { [key: string]: Card }
}

export function getCard(ctx: CardTableComponent, cardId: string): Card | null {
  return ctx.cards[cardId];
}

export function mapCard(ctx: CardTableComponent, f: (Card) => Card): CardTableComponent {
  return ctx;
}

export function getCardBaSyou(
  ctx: CardTableComponent,
  cardID: string
): AbsoluteBaSyou {
  const [_, cardPosition] = getCardPosition(ctx.table, cardID);
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