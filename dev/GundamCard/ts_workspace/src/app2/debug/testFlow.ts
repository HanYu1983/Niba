import { DEFAULT_GAME_CONTEXT } from "../tool/tool/basic/gameContext";
import {
  initState,
  updateEffect,
  //updateCommand,
  triggerTextEvent,
} from "../tool/alg/handleGameContext";
import { createCard } from "../../tool/table";
import { getBaShouID, PlayerA, PlayerB } from "../tool/tool/basic/basic";
import { recurRequire } from "../tool/tool/basic/blockPayload";
import { applyFlow, queryFlow } from "../tool/alg/handleClient";

export function testFlow1() {
  let ctx = DEFAULT_GAME_CONTEXT;
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      flowMemory: {
        ...ctx.gameState.flowMemory,
        state: "playing",
      },
    },
  };
  const firstTiming = ctx.gameState.timing;
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowNextTiming",
  });
  const afterTime = ctx.gameState.timing;
  if (afterTime[0] != firstTiming[0] + 1) {
    throw new Error("必須進到下一時間");
  }
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowPassPhase",
  });
  if (ctx.gameState.flowMemory.hasPlayerPassPhase[PlayerA] != true) {
    throw new Error("必須變成passPhase == true");
  }
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowCancelPassPhase",
  });
  if (ctx.gameState.flowMemory.hasPlayerPassPhase[PlayerA] != false) {
    throw new Error("必須變成passPhase == false");
  }
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowPassCut",
  });
  if (ctx.gameState.flowMemory.hasPlayerPassCut[PlayerA] != true) {
    throw new Error("必須變成passCut == true");
  }
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowCancelPassCut",
  });
  if (ctx.gameState.flowMemory.hasPlayerPassCut[PlayerA] != false) {
    throw new Error("必須變成passCut == false");
  }
  console.log(ctx);
}

export function testFlow2() {
  let ctx = DEFAULT_GAME_CONTEXT;
  let table = ctx.gameState.table;
  table = createCard(
    table,
    PlayerA,
    getBaShouID({
      id: "AbsoluteBaSyou",
      value: [PlayerA, "本国"],
    }),
    [
      "179016_04B_U_WT075C_white",
      "179030_11E_U_BL208S_blue",
      "179030_11E_U_BL215R_blue",
      "179001_01A_CH_WT007R_white",
    ]
  );
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: table,
      activePlayerID: PlayerA,
    },
  };
  console.log("一開始是重置階段");
  if (
    ctx.gameState.timing[1][0] != "リロールフェイズ" ||
    ctx.gameState.timing[1][1] != "フェイズ開始"
  ) {
    throw new Error("一開始必須是抽牌階段開始");
  }
  console.log("非伺服器玩家只能取得等待");
  console.log("伺服器玩家可以取得系統指令");
  let flows = queryFlow(ctx, PlayerA);
  if (flows.length == 0) {
    throw new Error("必須有flow");
  }
  if (flows[0].id != "FlowTriggerTextEvent") {
    throw new Error("必須是FlowTriggerTextEvent");
  }
  {
    let flowsB = queryFlow(ctx, PlayerB);
    if (flowsB.length == 0) {
      throw new Error("必須有flow");
    }
    if (flowsB[0].id != "FlowWaitPlayer") {
      throw new Error("玩家B必須拿到等待");
    }
  }
  console.log("執行指令");
  ctx = applyFlow(ctx, PlayerA, flows[0]);
  if (ctx.gameState.flowMemory.hasTriggerEvent != true) {
    throw new Error("hasTriggerEvent must true");
  }
  console.log("執行完觸發指令後，就要取得到下一階段的指令");
  flows = queryFlow(ctx, PlayerA);
  if (flows.length == 0) {
    throw new Error("必須有flow");
  }
  if (flows[0].id != "FlowNextTiming") {
    throw new Error("必須是FlowNextTiming");
  }
  {
    let flowsB = queryFlow(ctx, PlayerB);
    if (flowsB.length == 0) {
      throw new Error("必須有flow");
    }
    if (flowsB[0].id != "FlowWaitPlayer") {
      throw new Error("玩家B必須拿到等待");
    }
    console.log(`PlayerB: ${flowsB[0].description}`);
  }
  console.log("執行指令");
  ctx = applyFlow(ctx, PlayerA, flows[0]);
  console.log("到下一階段後，流程記憶必須重設");
  if (ctx.gameState.flowMemory.hasTriggerEvent != false) {
    throw new Error("hasTriggerEvent must false");
  }
  flows = queryFlow(ctx, PlayerA);
  if (flows[0].id != "FlowAddBlock") {
    throw new Error("必須是FlowAddBlock");
  }
  {
    let flowsB = queryFlow(ctx, PlayerB);
    if (flowsB.length == 0) {
      throw new Error("必須有flow");
    }
    if (flowsB[0].id != "FlowWaitPlayer") {
      throw new Error("玩家B必須拿到等待");
    }
    console.log(`PlayerB: ${flowsB[0].description}`);
  }
  ctx = applyFlow(ctx, PlayerA, flows[0]);
  flows = queryFlow(ctx, PlayerA);
  if (flows[0].id != "FlowSetActiveEffectID") {
    throw new Error("必須是FlowSetActiveEffectID");
  }
  {
    let flowsB = queryFlow(ctx, PlayerB);
    if (flowsB.length == 0) {
      throw new Error("必須有flow");
    }
    if (flowsB[0].id != "FlowWaitPlayer") {
      throw new Error("玩家B必須拿到等待");
    }
    console.log(`PlayerB: ${flowsB[0].description}`);
  }
  ctx = applyFlow(ctx, PlayerA, flows[0]);
  if (ctx.gameState.activeEffectID == null) {
    throw new Error("ctx.gameState.activeEffectID must exist");
  }
  flows = queryFlow(ctx, PlayerA);
  const doEffectFlowA = flows.find((f) => f.id == "FlowDoEffect");
  if (doEffectFlowA == null) {
    throw new Error("必須有是FlowDoEffect");
  }
  {
    let flowsB = queryFlow(ctx, PlayerB);
    if (flowsB.length == 0) {
      throw new Error("必須有flow");
    }
    if (flowsB[0].id != "FlowWaitPlayer") {
      throw new Error("玩家B必須拿到等待");
    }
    console.log(`PlayerB: ${flowsB[0].description}`);
  }
  ctx = applyFlow(ctx, PlayerA, doEffectFlowA);
  if (ctx.gameState.activeEffectID != null) {
    throw new Error("ctx.gameState.activeEffectID must null");
  }
  if (ctx.gameState.immediateEffect.length > 0) {
    throw new Error("ctx.gameState.immediateEffect.length must be 0");
  }
  flows = queryFlow(ctx, PlayerA);
  {
    let flowsB = queryFlow(ctx, PlayerB);
    if (flowsB.length == 0) {
      throw new Error("必須有flow");
    }
    if (flowsB[0].id != "FlowWaitPlayer") {
      throw new Error("玩家B必須拿到等待");
    }
    console.log(`PlayerB: ${flowsB[0].description}`);
  }
}
