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
import { getPrototype } from "../tool/alg/script";
import {
  getBaSyouID,
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

export function testProto_179007_02A_U_WT027U_white() {
  let ctx = DEFAULT_GAME_CONTEXT;
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: {
        ...ctx.gameState.table,
        cardStack: {
          ...ctx.gameState.table.cardStack,
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "Gゾーン"],
          })]: [
            {
              id: "g1",
              protoID: "179007_02A_U_WT027U_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
            {
              id: "g2",
              protoID: "179004_01A_CH_WT009R_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
          ],
        },
      },
      activePlayerID: PlayerA,
      timing: [0, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]],
    },
  };
  ctx = initState(ctx);
  console.log("更新指令，必須有1個（從G跳出機體）的指令");
  ctx = updateCommand(ctx);
  if (ctx.gameState.commandEffect.length != 1) {
    console.log(ctx);
    throw new Error("必須有指令");
  }
  console.log("執行指令內文, 效果會進入堆疊");
  ctx = doBlockPayload(ctx, ctx.gameState.commandEffect[0]);
  if (ctx.gameState.stackEffect.length != 1) {
    console.log(ctx);
    throw new Error("堆疊中必須有指令");
  }
  console.log("效果沒有解決前先判斷狀態");
  if (
    ctx.gameState.table.cardStack[
      getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerA, "Gゾーン"] })
    ].length != 2
  ) {
    console.log(ctx);
    throw new Error("G必須剩2張");
  }
  if (
    ctx.gameState.table.cardStack[
      getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerA, "配備エリア"] })
    ].length != 0
  ) {
    console.log(ctx);
    throw new Error("配備區必須有0張");
  }
  console.log("解決效果");
  ctx = doBlockPayload(ctx, ctx.gameState.stackEffect[0]);
  if (
    ctx.gameState.table.cardStack[
      getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerA, "Gゾーン"] })
    ].length != 1
  ) {
    console.log(ctx);
    throw new Error("G必須剩1張");
  }
  if (
    ctx.gameState.table.cardStack[
      getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerA, "配備エリア"] })
    ].length != 1
  ) {
    console.log(ctx);
    throw new Error("配備區必須有1張");
  }
}
