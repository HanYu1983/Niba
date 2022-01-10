import { getCard, getCardPosition } from "../../../../tool/table";
import { GameContext } from "./gameContext";
import {
  RelatedBaSyou,
  AbsoluteBaSyou,
  getBaShou,
  PlayerID,
  CardColor,
  BaSyou,
} from "./basic";

export function getAbsoluteBaSyou(
  baSyou: BaSyou,
  ctx: GameContext,
  cardID: string
): AbsoluteBaSyou {
  if (baSyou.id == "AbsoluteBaSyou") {
    return baSyou;
  }
  const _playerID = (() => {
    switch (baSyou.value[0]) {
      case "持ち主": {
        const card = getCard(ctx.gameState.table, cardID);
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
    }
  })();
  return {
    id: "AbsoluteBaSyou",
    value: [_playerID, baSyou.value[1]],
  };
}

export function getCardBaSyou(
  ctx: GameContext,
  cardID: string
): AbsoluteBaSyou {
  const [_, cardPosition] = getCardPosition(ctx.gameState.table, cardID);
  if (cardPosition == null) {
    throw new Error("[getController] cardPosition not found");
  }
  return getBaShou(cardPosition);
}

export function getCardController(ctx: GameContext, cardID: string): PlayerID {
  const baSyou = getCardBaSyou(ctx, cardID);
  return baSyou.value[0];
}

export function getCardOwner(ctx: GameContext, cardID: string): PlayerID {
  const card = getCard(ctx.gameState.table, cardID);
  if (card == null) {
    throw new Error("[getCardOwner] card not found");
  }
  if (card.ownerID == null) {
    throw new Error("[getCardOwner] card.ownerID not found");
  }
  return card.ownerID;
}

export function getCardColor(ctx: GameContext, cardID: string): CardColor {
  const cardState = ctx.gameState.cardState.find((cs) => {
    return cs.id == cardID;
  });
  if (cardState == null) {
    throw new Error("[getCardColor] cardState not found");
  }
  return cardState.prototype.color;
}
