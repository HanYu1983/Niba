// 赤黒グラフィック（V）
// GRAPHIC
import { Context, CardPosition, Action, Payment, Effect } from "../tool/types";
import { opponent, askPlayerG, cardPositionID } from "../model/alg/tool";
import { Card } from "../tool/table";
import { askRowData } from "../tool/data";
import { askCardType } from "../model/alg/askCardType";

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
      from: { playerID: card.ownerID, where: "hand" },
      to: { playerID: card.ownerID, where: "G" },
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
