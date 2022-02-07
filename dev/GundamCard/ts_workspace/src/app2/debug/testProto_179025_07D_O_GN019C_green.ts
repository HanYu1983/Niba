import { createCard, DEFAULT_TABLE, mapCard } from "../../tool/table";
import {
  doBlockPayload,
  doFeedback,
  doRequire,
  wrapBlockRequireKey,
} from "../tool/alg/handleBlockPayload";
import { applyFlow, doEffect, queryFlow } from "../tool/alg/handleClient";
import {
  getClientCommand,
  initState,
  triggerTextEvent,
  updateCommand,
  updateEffect,
  wrapTip,
} from "../tool/alg/handleGameContext";
import { getCardCoins } from "../tool/alg/helper";
import { getPrototype } from "../tool/alg/script";
import {
  getBaShouID,
  PlayerA,
  PlayerB,
  Timing,
  TIMING_CHART,
} from "../tool/tool/basic/basic";
import { BlockPayload, wrapRequireKey } from "../tool/tool/basic/blockPayload";
import {
  DEFAULT_GAME_CONTEXT,
  GameContext,
} from "../tool/tool/basic/gameContext";

export function testProto_179025_07D_O_GN019C_green() {
  let ctx = DEFAULT_GAME_CONTEXT;
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: {
        ...ctx.gameState.table,
        cardStack: {
          ...ctx.gameState.table.cardStack,
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "配備エリア"],
          })]: [
            {
              id: "a1",
              protoID: "179025_07D_O_GN019C_green",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
          ],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "配備エリア"],
          })]: [
            {
              id: "b1",
              protoID: "179008_02A_U_WT034U_white",
              faceDown: true,
              ownerID: PlayerB,
              tap: false,
            },
          ],
        },
      },
      activePlayerID: PlayerA,
    },
  };
  ctx = initState(ctx);
  console.log("解發回合開始");
  ctx = triggerTextEvent(ctx, {
    id: "GameEventOnTiming",
    timing: [0, ["リロールフェイズ", "フェイズ開始"]],
  });
  if (ctx.gameState.immediateEffect.length != 1) {
    console.log(ctx);
    throw new Error("立即疊堆中必須有指令");
  }
  console.log("解決效果");
  ctx = doBlockPayload(ctx, ctx.gameState.immediateEffect[0]);
  if (getCardCoins(ctx, "a1").length != 1) {
    console.log(ctx);
    throw new Error("必須有1個coin");
  }
  console.log("清除立即效果");
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      immediateEffect: [],
    },
  };
  console.log("解發回合開始");
  ctx = triggerTextEvent(ctx, {
    id: "GameEventOnTiming",
    timing: [0, ["リロールフェイズ", "フェイズ開始"]],
  });
  if (ctx.gameState.immediateEffect.length != 1) {
    console.log(ctx);
    throw new Error("立即疊堆中必須有指令");
  }
  console.log("再解決一次效果");
  const cmd = ctx.gameState.immediateEffect[0];
  ctx = doBlockPayload(ctx, cmd);
  if (getCardCoins(ctx, "a1").length != 2) {
    console.log(ctx);
    throw new Error("必須有2個coin");
  }
  console.log("清除解決的效果");
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      immediateEffect: ctx.gameState.immediateEffect.filter(
        (e) => e.id != cmd.id
      ),
    },
  };
  if (ctx.gameState.immediateEffect.length != 1) {
    console.log(ctx);
    throw new Error("立即疊堆中必須有指令");
  }
  try {
    const useCmd = wrapTip(ctx, true, ctx.gameState.immediateEffect[0], "tmp");
    ctx = doBlockPayload(ctx, useCmd);
  } catch (e) {
    console.log(ctx);
    throw e;
  }
  if (
    ctx.gameState.table.cardStack[
      getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerA, "配備エリア"] })
    ].length != 0
  ) {
    throw new Error("配置區必須沒有卡");
  }
  if (
    ctx.gameState.table.cardStack[
      getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerA, "ジャンクヤード"] })
    ].length != 1
  ) {
    throw new Error("廢棄庫必須有1張卡");
  }
}
