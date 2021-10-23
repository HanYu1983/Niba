// ロング・ブレードライフル
//（戦闘フェイズ）：破壊されているカード１枚を廃棄する。その場合、カード２枚を引く。
import { Context, CardPosition, Action, Payment, Effect } from "../tool/types";
import { Card } from "../tool/table";

const askAction = (ctx: Context, card: Card): Action[] => {
  return [];
};

const askPlayPayment = (ctx: Context, card: Card): Payment[] => {
  return [
    {
      id: "Target1Payment",
      cardID: null,
      playerID: card.ownerID,
    } as Payment,
    {
      id: "ColorPayment",
      color: "黒",
      cardID: null,
      playerID: card.ownerID,
    } as Payment,
    {
      id: "ColorPayment",
      color: "黒",
      cardID: null,
      playerID: card.ownerID,
    } as Payment,
    {
      id: "GCountPayment",
      gCount: 3,
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
