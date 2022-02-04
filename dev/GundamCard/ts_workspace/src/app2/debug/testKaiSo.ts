import { createCard, DEFAULT_TABLE, mapCard } from "../../tool/table";
import { doFeedback, doRequire } from "../tool/alg/handleBlockPayload";
import { applyFlow, doEffect, queryFlow } from "../tool/alg/handleClient";
import {
  initState,
  updateCommand,
  wrapTip,
} from "../tool/alg/handleGameContext";
import { getBaShouID, PlayerA, TIMING_CHART } from "../tool/tool/basic/basic";
import {
  DEFAULT_GAME_CONTEXT,
  GameContext,
} from "../tool/tool/basic/gameContext";

export function testKaiSo1() {
  let ctx = DEFAULT_GAME_CONTEXT;
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: {
        ...DEFAULT_TABLE,
        cardStack: {
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "手札"],
          })]: [
            {
              id: "a",
              protoID: "179008_02A_U_WT034U_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
          ],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "配備エリア"],
          })]: [
            {
              id: "b",
              protoID: "179016_04B_U_WT075C_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
          ],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "Gゾーン"],
          })]: [
            {
              id: "g1",
              protoID: "179008_02A_U_WT034U_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
            {
              id: "g2",
              protoID: "179008_02A_U_WT034U_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
            {
              id: "g3",
              protoID: "179008_02A_U_WT034U_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
            {
              id: "g4",
              protoID: "179008_02A_U_WT034U_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
            {
              id: "g5",
              protoID: "179008_02A_U_WT034U_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
          ],
        },
      },
      // @ts-ignore
      timing: TIMING_CHART.find(
        (t) => t[1][0] == "戦闘フェイズ" && t[1][2] == "フリータイミング"
      ),
    },
  };
  ctx = initState(ctx);
  ctx = updateCommand(ctx);
  console.log("查詢改裝指令");
  let flows = queryFlow(ctx, PlayerA);
  const cmdFlow = flows.find((flow) => {
    if (flow.id != "FlowSetActiveEffectID") {
      return false;
    }
    return flow;
  });
  if (cmdFlow == null) {
    console.log(ctx);
    console.log(flows);
    throw new Error("必須有指令");
  }
  if (cmdFlow.id != "FlowSetActiveEffectID") {
    throw new Error("must FlowSetActiveEffectID");
  }
  // const kaiSoAflow = cmdFlow.tips.find(tip => {
  //     if (tip.cause?.id != "BlockPayloadCauseUpdateCommand") {
  //         return false
  //     }
  //     if (tip.cause.cardID != "a") {
  //         return false
  //     }
  //     return true
  // })
  // if (kaiSoAflow == null) {
  //     throw new Error("a必須有改裝指令")
  // }
  const kaiSoBflow = cmdFlow.tips.find((tip) => {
    if (tip.cause?.id != "BlockPayloadCauseUpdateCommand") {
      return false;
    }
    if (tip.cause.cardID != "b") {
      return false;
    }
    return true;
  });
  if (kaiSoBflow == null) {
    console.log(ctx);
    console.log(cmdFlow);
    throw new Error("b必須有改裝指令");
  }
  console.log("宣告改裝並支付");
  const varCtxID = "tmp";
  if (kaiSoBflow.require) {
    ctx = doRequire(ctx, kaiSoBflow, kaiSoBflow.require, varCtxID);
  }
  if (kaiSoBflow.feedback) {
    ctx = kaiSoBflow.feedback.reduce((ctx, feedback) => {
      return doFeedback(ctx, kaiSoBflow, feedback, varCtxID);
    }, ctx);
  }
  if (ctx.gameState.stackEffect.length == 0) {
    throw new Error("必須有一個指令在堆疊");
  }
  console.log("執行改裝效果");
  let topEffect = ctx.gameState.stackEffect[0];
  topEffect = wrapTip(ctx, true, topEffect, "tmp");
  if (topEffect.require) {
    ctx = doRequire(ctx, topEffect, topEffect.require, varCtxID);
  }
  if (topEffect.feedback) {
    ctx = topEffect.feedback.reduce((ctx, feedback) => {
      return doFeedback(ctx, topEffect, feedback, varCtxID);
    }, ctx);
  }
  if (
    ctx.gameState.table.cardStack[
      getBaShouID({
        id: "AbsoluteBaSyou",
        value: [PlayerA, "手札"],
      })
    ].length != 0
  ) {
    throw new Error("手牌必須出掉");
  }
  if (
    ctx.gameState.table.cardStack[
      getBaShouID({
        id: "AbsoluteBaSyou",
        value: [PlayerA, "捨て山"],
      })
    ].length != 1
  ) {
    throw new Error("廢棄庫必須有卡");
  }
  if (
    ctx.gameState.table.cardStack[
      getBaShouID({
        id: "AbsoluteBaSyou",
        value: [PlayerA, "配備エリア"],
      })
    ].length != 1
  ) {
    throw new Error("配置區必須有卡");
  }
  console.log(ctx);
}
