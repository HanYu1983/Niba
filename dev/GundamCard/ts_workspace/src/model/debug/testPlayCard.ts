import { mapCard, moveCard, createCard } from "../../tool/table";
import {
  Context,
  Action,
  Payment,
  Effect,
  defaultContext,
} from "../../tool/types";
import { askPlayerG, cardPositionID, onEffectCompleted } from "../alg";
import { queryAction } from "../alg/queryAction";
import { applyAction } from "../alg/applyAction";
import { checkPayment } from "../alg/checkPayment";
import { rootApp } from "../../tool/firebase";
import { PlayerA, PlayerB } from "../../app/context";
import { askCardColor } from "../alg";

export function testPlayCard() {
  let table = defaultContext.gameState.table;
  table = createCard(
    table,
    PlayerA,
    cardPositionID({ playerID: PlayerA, where: "hand" }),
    ["179030_11E_U_BK187N_black", "179030_11E_U_BK187N_black"]
  );
  table = createCard(
    table,
    PlayerB,
    cardPositionID({ playerID: PlayerB, where: "hand" }),
    ["179030_11E_U_BK187N_black", "179030_11E_U_BK187N_black"]
  );
  let ctx: Context = {
    ...defaultContext,
    gameState: {
      ...defaultContext.gameState,
      table: table,
    },
  };
  const unit1 =
    ctx.gameState.table.cardStack[
      cardPositionID({ playerID: PlayerA, where: "hand" })
    ]?.[0] || null;
  if (unit1 == null) {
    throw new Error("unit1必須存在");
  }
  const unit2 =
    ctx.gameState.table.cardStack[
      cardPositionID({ playerID: PlayerA, where: "hand" })
    ]?.[1] || null;
  if (unit2 == null) {
    throw new Error("unit2必須存在");
  }
  console.log("A出卡效果進堆疊");
  ctx = applyAction(ctx, PlayerA, {
    id: "PlayCardAction",
    playerID: PlayerA,
    cardID: unit1.id,
    from: { playerID: PlayerA, where: "hand" },
    to: { playerID: PlayerA, where: "G" },
  });
  if (ctx.gameState.effectStack.effects.length != 1) {
    throw new Error("堆疊中必須有1個效果");
  }
  console.log("A放棄切入");
  ctx = applyAction(ctx, PlayerA, {
    id: "ConfirmPhaseAction",
    playerID: PlayerA,
  });
  console.log("B放棄切入");
  console.log("處理出卡效果");
  ctx = applyAction(ctx, PlayerB, {
    id: "ConfirmPhaseAction",
    playerID: PlayerB,
  });
  if (ctx.gameState.effectStack.effects.length != 0) {
    throw new Error("堆疊中必須有0個效果");
  }
  if (
    (ctx.gameState.table.cardStack[
      cardPositionID({ playerID: PlayerA, where: "G" })
    ]?.length || 0) != 1
  ) {
    throw new Error("場上必須有1張G");
  }
  console.log("A出機體到場上");
  ctx = applyAction(ctx, PlayerA, {
    id: "PlayCardAction",
    playerID: PlayerA,
    cardID: unit2.id,
    from: { playerID: PlayerA, where: "hand" },
    to: { playerID: PlayerA, where: "ground" },
  });
  if (ctx.gameState.paymentTable.action == null) {
    throw new Error("必須到支付模式");
  }
  if (ctx.gameState.paymentTable.currents.length != 0) {
    throw new Error("一開始沒有任何支付");
  }
  console.log("轉G支付");
  ctx = applyAction(ctx, PlayerA, {
    id: "TapCardToGenG",
    playerID: PlayerA,
    cardID: unit1.id,
    color: askCardColor(ctx, unit1),
  });
  if (ctx.gameState.paymentTable.currents.length != 1) {
    throw new Error("必須有了支付");
  }
  console.log("確認支付");
  ctx = applyAction(ctx, PlayerA, {
    id: "ApplyPaymentAction",
    playerID: PlayerA,
  });
  if (ctx.gameState.effectStack.effects.length != 1) {
    throw new Error("堆疊中必須有1個效果");
  }
  console.log("A放棄切入");
  ctx = applyAction(ctx, PlayerA, {
    id: "ConfirmPhaseAction",
    playerID: PlayerA,
  });
  console.log("B放棄切入");
  console.log("處理出卡效果");
  ctx = applyAction(ctx, PlayerB, {
    id: "ConfirmPhaseAction",
    playerID: PlayerB,
  });
  if (
    (ctx.gameState.table.cardStack[
      cardPositionID({ playerID: PlayerA, where: "ground" })
    ]?.length || 0) != 1
  ) {
    throw new Error("場上必須有1張機體在場上");
  }
}
