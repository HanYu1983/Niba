import { Context, CardPosition, Action, Payment, Effect } from "../tool/types";
import {
  opponent,
  askPlayerG,
  cardPositionID,
  askCardType,
} from "../model/alg";
import { Card } from "../tool/table";
import { askRowData } from "../tool/data";

const askAction = (ctx: Context, card: Card): Action[] => {
  if (card.ownerID == null) {
    throw new Error("card.ownerID not found");
  }
  const actions: Action[] = [];
  const rowData = askRowData(card.protoID);
  const cardType = askCardType(ctx, card);
  if (cardType == "GRAPHIC") {
    actions.push({
      id: "PlayCardAction",
      playerID: card.ownerID,
      cardID: card.id,
      position: { playerID: card.ownerID, where: "G" },
    });
  }
  return actions;
};

const askPlayPayment = (ctx: Context, card: Card): Payment[] => {
  return [];
};

const onEffectCompleted = (
  ctx: Context,
  card: Card,
  effect: Effect
): Context => {
  return ctx;
};

module.exports = { askAction, askPlayPayment, onEffectCompleted };
