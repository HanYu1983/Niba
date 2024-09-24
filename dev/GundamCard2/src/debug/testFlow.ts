import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { PlayerA, PlayerB } from "../game/define/PlayerID";
import { PhaseFn } from "../game/define/Timing";
import { getBattleGroupBattlePoint, getBattleGroup } from "../game/gameState/battleGroup";
import { getCardBattlePoint } from "../game/gameState/card";
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent";
import { clearGlobalEffects } from "../game/gameState/globalEffects";
import { getPhase, setPhase } from "../game/gameState/PhaseComponent";
import { setSetGroupParent } from "../game/gameState/SetGroupComponent";
import { applyFlow } from "../game/gameStateWithFlowMemory/applyFlow";
import { createGameStateWithFlowMemory, GameStateWithFlowMemory, initState } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import { queryFlow } from "../game/gameStateWithFlowMemory/queryFlow";
import { loadPrototype } from "../script";

export function testFlow1() {
  let ctx = createGameStateWithFlowMemory();
  ctx = {
    ...ctx,
    flowMemory: {
      ...ctx.flowMemory,
      state: "playing",
    },
  };
  const firstTiming = ctx.phase;
  if (PhaseFn.getSeqId(firstTiming) != 0) {
    throw new Error("timingSeq must 0")
  }
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowNextTiming",
  });
  const afterTime = ctx.phase;
  if (PhaseFn.getSeqId(afterTime) != PhaseFn.getSeqId(firstTiming) + 1) {
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

export async function testFlow2() {
  await loadPrototype("empty")
  let ctx = createGameStateWithFlowMemory();
  ctx = createCardWithProtoIds(
    ctx,
    AbsoluteBaSyouFn.of(PlayerA, "本国"),
    [
      "empty",
      "empty",
      "empty",
      "empty",
    ]
  ) as GameStateWithFlowMemory
  ctx = createCardWithProtoIds(
    ctx,
    AbsoluteBaSyouFn.of(PlayerB, "本国"),
    [
      "empty",
    ]
  ) as GameStateWithFlowMemory
  ctx = {
    ...ctx,
    activePlayerID: PlayerA,
    flowMemory: {
      ...ctx.flowMemory,
      state: "playing"
    }
  };
  ctx = setPhase(ctx, ["ドローフェイズ", "フェイズ開始"]) as GameStateWithFlowMemory
  if (
    ctx.phase[0] != "ドローフェイズ" ||
    ctx.phase[1] != "フェイズ開始"
  ) {
    throw new Error("一開始必須是抽牌階段開始");
  }
  console.log(getPhase(ctx))
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
  console.log(`執行指令: ${flows[0].id}`);
  ctx = applyFlow(ctx, PlayerA, flows[0]);
  if (ctx.flowMemory.hasTriggerEvent != true) {
    throw new Error("hasTriggerEvent must true");
  }
  console.log(getPhase(ctx))
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
  console.log(getPhase(ctx))
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
  console.log(`執行[${flows[0].id}]`)
  ctx = applyFlow(ctx, PlayerA, flows[0]);
  if (ctx.flowMemory.activeEffectID == null) {
    throw new Error("ctx.activeEffectID must exist");
  }
  console.log(getPhase(ctx))
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
  {
    flows = queryFlow(ctx, PlayerA);
    const doFlowPassPayCost = flows.find((f) => f.id == "FlowPassPayCost");
    if (doFlowPassPayCost == null) {
      throw new Error("必須有是doFlowPassPayCost");
    }
    console.log(`執行[${doFlowPassPayCost.id}]`)
    ctx = applyFlow(ctx, PlayerA, doFlowPassPayCost);
  }
  console.log(getPhase(ctx))
  {
    let flowsB = queryFlow(ctx, PlayerB);
    if (flowsB.length == 0) {
      throw new Error("必須有flow");
    }
    const doFlowPassPayCost = flows.find((f) => f.id == "FlowPassPayCost");
    if (doFlowPassPayCost == null) {
      throw new Error("必須有是doFlowPassPayCost");
    }
    console.log(`執行[${doFlowPassPayCost.id}]`)
    ctx = applyFlow(ctx, PlayerB, doFlowPassPayCost);
  }
  console.log(getPhase(ctx))
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
    if (flowsB[0].id != "FlowObserveEffect") {
      throw new Error("玩家B必須拿到等待");
    }
    console.log(`PlayerB: ${flowsB[0].description}`);
  }
  console.log(getPhase(ctx))
  ctx = applyFlow(ctx, PlayerA, doEffectFlowA);
  if (ctx.flowMemory.activeEffectID != null) {
    throw new Error("ctx.activeEffectID must null");
  }
  if (ctx.immediateEffect.length > 0) {
    throw new Error("ctx.immediateEffect.length must be 0");
  }
  flows = queryFlow(ctx, PlayerA);
  console.log(flows)
  {
    let flowsB = queryFlow(ctx, PlayerB);
    console.log(flowsB)
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
  await loadPrototype("179016_04B_U_WT075C_white")
  await loadPrototype("179001_01A_CH_WT007R_white")
  await loadPrototype("testBPBonus")
  let ctx = createGameStateWithFlowMemory();
  ctx = {
    ...ctx,
    activePlayerID: PlayerA,
    phase: ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ開始"],
  };
  ctx = setSetGroupParent(ctx, "a1", "a2") as GameStateWithFlowMemory
  ctx = addCards(
    ctx,
    AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"),
    [
      {
        id: "a1",
        protoID: "179016_04B_U_WT075C_white",
        isFaceDown: false,
        ownerID: PlayerA,
        isRoll: false,
      },
      {
        id: "a2",
        protoID: "179001_01A_CH_WT007R_white",
        isFaceDown: false,
        ownerID: PlayerA,
        isRoll: false,
      }
    ]
  ) as GameStateWithFlowMemory
  ctx = addCards(
    ctx,
    AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"),
    [
      {
        id: "b1",
        protoID: "179016_04B_U_WT075C_white",
        isFaceDown: true,
        ownerID: PlayerB,
        isRoll: false,
      },
      {
        id: "b2",
        protoID: "179016_04B_U_WT075C_white",
        isFaceDown: true,
        ownerID: PlayerB,
        isRoll: false,
      },
    ]
  ) as GameStateWithFlowMemory
  ctx = initState(ctx, [], []);
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
      getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"))
    );
    if (bta != 7) {
      throw new Error("must be 7");
    }
  }
  console.log("給a1獲得+3/+3/+3");
  ctx = addCards(
    ctx,
    AbsoluteBaSyouFn.of(PlayerA, "配備エリア"),
    [
      {
        id: "a3",
        protoID: "testBPBonus",
        isFaceDown: false,
        ownerID: PlayerA,
        isRoll: false,
      }
    ]
  ) as GameStateWithFlowMemory
  ctx = clearGlobalEffects(ctx) as GameStateWithFlowMemory
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
      getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"))
    );
    if (bta != 13) {
      throw new Error("must be 13");
    }
  }
}