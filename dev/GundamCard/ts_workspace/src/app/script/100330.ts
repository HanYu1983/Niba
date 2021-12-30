// ゾロ
import { Context, CardPosition, Action, Payment, Effect } from "../types";
import { Card } from "../../tool/table";

const askPower = (
  ctx: Context,
  card: Card
): [number | null, number | null, number | null] => {
  return [1, 1, 1];
};

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
      playerID: card.ownerID || "",
      tipCardID: [],
    },
    {
      id: "GCountPayment",
      gCount: 1,
      playerID: card.ownerID || "",
      tipCardID: [],
    },
  ];
};

const onEffectCompleted = (
  ctx: Context,
  card: Card,
  effect: Effect
): Context => {
  return ctx;
};

module.exports = { askPower, askAction, askPlayPayment, onEffectCompleted };
