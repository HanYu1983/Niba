// 赤黒グラフィック（V）
// GRAPHIC
import { Context, CardPosition, Action, Payment, Effect } from "../types";
import { Card } from "../../tool/table";
import { askRowData } from "../../tool/data";
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
  if (cardType == "COMMAND") {
    actions.push({
      id: "PlayCardAction",
      playerID: card.ownerID,
      cardID: card.id,
      from: { playerID: card.ownerID, where: "hand" },
      to: { playerID: card.ownerID, where: "gravyard" },
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
      playerID: card.ownerID || "",
      tipCardID: [],
    },
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

module.exports = { askAction, askPlayPayment, onEffectCompleted };
