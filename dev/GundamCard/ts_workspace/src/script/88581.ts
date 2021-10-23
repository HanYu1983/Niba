// ロング・ブレードライフル
//（戦闘フェイズ）：破壊されているカード１枚を廃棄する。その場合、カード２枚を引く。
import {
  Context,
  CardPosition,
  Action,
  Payment,
  Effect,
  ActionEffect,
} from "../tool/types";
import { Card, getCard, mapCard, moveCard } from "../tool/table";
import { askCardPosition, cardPositionID } from "../model/alg/tool";

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

const onEffect = (ctx: Context, card: Card, effect: ActionEffect): Context => {
  const target = effect.currents.find(
    (payment) => payment.id == "Target1Payment"
  );
  if (target == null) {
    throw new Error("沒有找到target1");
  }
  if (target.id != "Target1Payment") {
    throw new Error("必須是Target1Payment");
  }
  if (target.cardID == null) {
    throw new Error("沒有指定目標1");
  }
  const targetPosition = askCardPosition(ctx, target.cardID);
  if (targetPosition == null) {
    throw new Error(`找不到卡片位置:${target.cardID}`);
  }
  const targetCard = getCard(ctx.gameState.table, target.cardID);
  if (targetCard == null) {
    throw new Error(`找不到目標1:${target.cardID}`);
  }
  if (targetCard.ownerID == null) {
    throw new Error(`目標1沒有擁有者:${target.cardID}`);
  }
  console.log(`目標1移到墓地:${targetCard.id}`);
  let nextTable = moveCard(
    ctx.gameState.table,
    cardPositionID(targetPosition),
    cardPositionID({ playerID: targetCard.ownerID, where: "gravyard" }),
    targetCard.id,
    null
  );
  console.log(`抽2張卡`);
  const drawPosition: CardPosition = {
    playerID: effect.action.playerID,
    where: "home",
  };
  let drawTopCard = nextTable.cardStack[cardPositionID(drawPosition)]?.[0];
  if (drawTopCard == null) {
    console.log("無卡可抽");
    return ctx;
  }
  nextTable = moveCard(
    nextTable,
    cardPositionID(drawPosition),
    cardPositionID({ playerID: targetCard.ownerID, where: "hand" }),
    drawTopCard.id,
    null
  );
  drawTopCard = nextTable.cardStack[cardPositionID(drawPosition)]?.[0];
  if (drawTopCard == null) {
    console.log("無卡可抽");
    return ctx;
  }
  nextTable = moveCard(
    nextTable,
    cardPositionID(drawPosition),
    cardPositionID({ playerID: targetCard.ownerID, where: "hand" }),
    drawTopCard.id,
    null
  );
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: nextTable,
    },
  };
};

module.exports = { askAction, askPlayPayment, onEffect };
