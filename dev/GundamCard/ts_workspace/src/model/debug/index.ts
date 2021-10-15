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

function testPlayCard() {
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

function testScript() {
  const ctx = onEffectCompleted(defaultContext, {
    action: {
      id: "PlayCardAction",
      playerID: "",
      cardID: null,
      from: null,
      to: null,
    },
    currents: [],
  });
  console.log(ctx);
}

function testPlayG() {
  let ctx: Context = {
    ...defaultContext,
    gameState: {
      ...defaultContext.gameState,
      table: createCard(
        defaultContext.gameState.table,
        PlayerA,
        cardPositionID({ playerID: PlayerA, where: "hand" }),
        ["179030_11E_G_RD021N_red"]
      ),
    },
  };
  const actions = queryAction(ctx, PlayerA);
  if (actions.length == 0) {
    throw new Error("必須有出牌動作");
  }
  if (actions[0].id != "PlayCardAction") {
    throw new Error("動作必須是PlayCardAction");
  }
  console.log("A出G");
  ctx = applyAction(ctx, PlayerA, actions[0]);
  console.log("A放棄切入");
  ctx = applyAction(ctx, PlayerA, {
    id: "ConfirmPhaseAction",
    playerID: PlayerA,
  });
  console.log("B放棄切入");
  ctx = applyAction(ctx, PlayerB, {
    id: "ConfirmPhaseAction",
    playerID: PlayerB,
  });
  if (
    (
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: PlayerA, where: "G" })
      ] || []
    ).length != 1
  ) {
    throw new Error("G必須在場上");
  }
  if (
    (
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: PlayerA, where: "hand" })
      ] || []
    ).length != 0
  ) {
    throw new Error("手牌必須為0");
  }
}

function testPhase() {
  let ctx: Context = {
    ...defaultContext,
    gameState: {
      ...defaultContext.gameState,
      phase: ["draw", "before"],
      activePlayerID: PlayerA,
    },
  };
  console.log("A宣告到下一步");
  ctx = applyAction(ctx, PlayerA, {
    id: "ConfirmPhaseAction",
    playerID: PlayerA,
  });
  if ((ctx.gameState.playerState[PlayerA]?.confirmPhase || false) != true) {
    throw new Error("PlayerA必須確認結束");
  }
  if ((ctx.gameState.playerState[PlayerB]?.confirmPhase || false) != false) {
    throw new Error("PlayerB必須沒有結束");
  }
  console.log("B宣告到下一步");
  ctx = applyAction(ctx, PlayerB, {
    id: "ConfirmPhaseAction",
    playerID: PlayerB,
  });
  if (ctx.gameState.phase[1] != "effect") {
    throw new Error("必須到規定效果");
  }
  if ((ctx.gameState.playerState[PlayerA]?.confirmPhase || false) != false) {
    throw new Error("PlayerA的確認狀態必須被清空");
  }
  if ((ctx.gameState.playerState[PlayerB]?.confirmPhase || false) != false) {
    throw new Error("PlayerB的確認狀態必須被清空");
  }
  if (ctx.gameState.phase[1] != "effect") {
    throw new Error("必須到規定效果");
  }
  console.log("A完成規定效果");
  ctx = applyAction(ctx, PlayerA, {
    id: "ConfirmPhaseAction",
    playerID: PlayerA,
  });
  if (ctx.gameState.phase[1] != "after") {
    throw new Error("必須到after");
  }
  console.log("現在到了抽牌階段規定效果後的自由時間");
  console.log("A宣告到下一步");
  ctx = applyAction(ctx, PlayerA, {
    id: "ConfirmPhaseAction",
    playerID: PlayerA,
  });
  console.log("B宣告到下一步");
  ctx = applyAction(ctx, PlayerB, {
    id: "ConfirmPhaseAction",
    playerID: PlayerB,
  });
  if (ctx.gameState.phase[0] != "set") {
    throw new Error("必須到設置階段");
  }
  if (ctx.gameState.phase[1] != "before") {
    throw new Error("必須到設置階段的自由時間");
  }
}

export function test() {
  const testFns = [testScript, testPlayG, testPhase, testPlayCard];
  testFns.forEach((f) => {
    console.log(`=========${f.name}=========`);
    f();
  });
}
