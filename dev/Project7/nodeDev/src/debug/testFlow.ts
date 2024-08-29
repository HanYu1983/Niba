import { PlayerA, getBaSyouID, PlayerB, getTimingSeq } from "../game/define";
import { addGundamCards, createGundamCardWithProtoIds } from "../game/gameState/CardTableComponent";
import { getCardBattlePoint, getBattleGroupBattlePoint, getBattleGroup, GlobalCardState } from "../game/gameState/GameState";
import { applyFlow } from "../game/gameStateWithFlowMemory/applyFlow";
import { DEFAULT_GAME_STATE_WITH_FLOW_MEMORY, GameStateWithFlowMemory, initState } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import { queryFlow } from "../game/gameStateWithFlowMemory/queryFlow";
import { getPrototype } from "../script";

export function testFlow1() {
  let ctx = DEFAULT_GAME_STATE_WITH_FLOW_MEMORY;
  ctx = {
    ...ctx,
    flowMemory: {
      ...ctx.flowMemory,
      state: "playing",
    },
  };
  const firstTiming = ctx.timing;
  if (getTimingSeq(firstTiming) != 0) {
    throw new Error("timingSeq must 0")
  }
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowNextTiming",
  });
  const afterTime = ctx.timing;
  if (getTimingSeq(afterTime) != getTimingSeq(firstTiming) + 1) {
    throw new Error("必須進到下一時間");
  }
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowPassPhase",
  });
  if (ctx.flowMemory.hasPlayerPassPhase[PlayerA] != true) {
    throw new Error("必須變成passPhase == true");
  }
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowCancelPassPhase",
  });
  if (ctx.flowMemory.hasPlayerPassPhase[PlayerA] != false) {
    throw new Error("必須變成passPhase == false");
  }
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowPassCut",
  });
  if (ctx.flowMemory.hasPlayerPassCut[PlayerA] != true) {
    throw new Error("必須變成passCut == true");
  }
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowCancelPassCut",
  });
  if (ctx.flowMemory.hasPlayerPassCut[PlayerA] != false) {
    throw new Error("必須變成passCut == false");
  }
}

export function testFlow2() {
  let ctx = DEFAULT_GAME_STATE_WITH_FLOW_MEMORY;
  let table = ctx.table;
  ctx = createGundamCardWithProtoIds(
    ctx,
    PlayerA,
    {
      id: "AbsoluteBaSyou",
      value: [PlayerA, "本国"],
    },
    [
      "179016_04B_U_WT075C_white",
      "179030_11E_U_BL208S_blue",
      "179030_11E_U_BL215R_blue",
      "179001_01A_CH_WT007R_white",
    ]
  ) as GameStateWithFlowMemory
  ctx = {
    ...ctx,
    table: table,
    activePlayerID: PlayerA,
  };
  console.log("一開始是重置階段");
  if (
    ctx.timing[1][0] != "リロールフェイズ" ||
    ctx.timing[1][1] != "フェイズ開始"
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
  if (ctx.flowMemory.hasTriggerEvent != true) {
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
  if (ctx.flowMemory.hasTriggerEvent != false) {
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
  if (ctx.activeEffectID == null) {
    throw new Error("ctx.activeEffectID must exist");
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
  if (ctx.activeEffectID != null) {
    throw new Error("ctx.activeEffectID must null");
  }
  if (ctx.immediateEffect.length > 0) {
    throw new Error("ctx.immediateEffect.length must be 0");
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

export async function testBattleBonus() {
  await getPrototype("179016_04B_U_WT075C_white")
  await getPrototype("179001_01A_CH_WT007R_white")
  await getPrototype("testBPBonus")
  let ctx = DEFAULT_GAME_STATE_WITH_FLOW_MEMORY;
  ctx = {
    ...ctx,
    activePlayerID: PlayerA,
    setGroupLink: { a2: "a1" },
    timing: [22, ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ開始"]],
  };
  ctx = addGundamCards(
    ctx,
    {
      id: "AbsoluteBaSyou",
      value: [PlayerA, "戦闘エリア（左）"],
    },
    [
      {
        id: "a1",
        protoID: "179016_04B_U_WT075C_white",
        faceDown: false,
        ownerID: PlayerA,
        tap: false,
      },
      {
        id: "a2",
        protoID: "179001_01A_CH_WT007R_white",
        faceDown: false,
        ownerID: PlayerA,
        tap: false,
      }
    ]
  ) as GameStateWithFlowMemory
  ctx = addGundamCards(
    ctx,
    {
      id: "AbsoluteBaSyou",
      value: [PlayerB, "戦闘エリア（左）"],
    },
    [
      {
        id: "b1",
        protoID: "179016_04B_U_WT075C_white",
        faceDown: true,
        ownerID: PlayerB,
        tap: false,
      },
      {
        id: "b2",
        protoID: "179016_04B_U_WT075C_white",
        faceDown: true,
        ownerID: PlayerB,
        tap: false,
      },
    ]
  ) as GameStateWithFlowMemory
  ctx = initState(ctx);
  {
    const [x, y, z] = getCardBattlePoint(ctx, "a1");
    if (x != 5) {
      throw new Error("x != 5");
    }
    if (y != 2) {
      throw new Error("y != 2");
    }
    if (z != 4) {
      throw new Error("z != 4");
    }
  }
  {
    const bta = getBattleGroupBattlePoint(
      ctx,
      getBattleGroup(ctx, {
        id: "AbsoluteBaSyou",
        value: [PlayerA, "戦闘エリア（左）"],
      })
    );
    if (bta != 7) {
      throw new Error("must be 7");
    }
  }
  console.log("給a1獲得+3/+3/+3");
  ctx = addGundamCards(
    ctx,
    {
      id: "AbsoluteBaSyou",
      value: [PlayerA, "配備エリア"],
    },
    [
      {
        id: "a3",
        protoID: "testBPBonus",
        faceDown: false,
        ownerID: PlayerA,
        tap: false,
      }
    ]
  ) as GameStateWithFlowMemory
  {
    const [x, y, z] = getCardBattlePoint(ctx, "a1");
    if (x != 8) {
      throw new Error("x != 8");
    }
    if (y != 5) {
      throw new Error("y != 5");
    }
    if (z != 7) {
      throw new Error("z != 7");
    }
  }
  {
    const bta = getBattleGroupBattlePoint(
      ctx,
      getBattleGroup(ctx, {
        id: "AbsoluteBaSyou",
        value: [PlayerA, "戦闘エリア（左）"],
      })
    );
    if (bta != 13) {
      throw new Error("must be 10");
    }
  }
}