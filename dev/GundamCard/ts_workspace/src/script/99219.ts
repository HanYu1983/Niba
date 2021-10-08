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
  if (cardType == "COMMAND") {
    actions.push({
      id: "PlayCardAction",
      playerID: card.ownerID,
      cardID: card.id,
      position: { playerID: card.ownerID, where: "gravyard" },
    });
  }
  return actions;
};

const askPlayPayment = (ctx: Context, card: Card): Payment[] => {
  // 私情による裏切り
  //（常時）：敵軍キャラ１枚、または敵軍オペ１枚を破壊する。その場合、敵軍は、自分の本国を５回復できる。
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
