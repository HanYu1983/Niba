// 赤黒グラフィック（V）
// GRAPHIC
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
  return actions;
};

const askPlayPayment = (ctx: Context, card: Card): Payment[] => {
  return [
    {
      id: "ColorPayment",
      color: "黒",
      cardID: null,
      playerID: card.ownerID,
    } as Payment,
    {
      id: "GCountPayment",
      gCount: 1,
      playerID: card.ownerID,
    } as Payment,
  ];
};

const onEffectCompleted = (
  ctx: Context,
  card: Card,
  effect: Effect
): Context => {
  return ctx;
};

module.exports = { askAction, askPlayPayment, onEffectCompleted };
