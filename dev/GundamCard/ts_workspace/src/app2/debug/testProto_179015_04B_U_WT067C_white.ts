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
import { getCardCardTextState } from "../tool/alg/helper";
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

export function testProto_179015_04B_U_WT067C_white() {
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
              protoID: "179015_04B_U_WT067C_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
            {
              id: "a2",
              protoID: "179008_02A_U_WT034U_white",
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
  console.log("檢查本來a2的內文數量");
  {
    const cts = getCardCardTextState(ctx, "a2");
    if (cts.length != 4) {
      throw new Error("a2的內文原本是4個");
    }
  }
  ctx = updateCommand(ctx);
  if (ctx.gameState.commandEffect.length != 1) {
    throw new Error("必須有一個指令(交叉武器)");
  }
  {
    const cmd = ctx.gameState.commandEffect[0];
    ctx = doBlockPayload(ctx, cmd);
  }
  if (ctx.gameState.stackEffect.length != 1) {
    throw new Error("堆疊中必須有一指令");
  }
  {
    const cmd = wrapTip(ctx, true, ctx.gameState.stackEffect[0], "tmp");
    ctx = doBlockPayload(ctx, cmd);
  }
  {
    const cts = getCardCardTextState(ctx, "a2");
    if (cts.length != 6) {
      console.log(cts);
      throw new Error("a2的內文必須新增到6個");
    }
  }
  ctx = triggerTextEvent(ctx, {
    id: "GameEventOnTiming",
    timing: [34, ["戦闘フェイズ", "ターン終了時", "効果終了。ターン終了"]],
  });
  {
    const cts = getCardCardTextState(ctx, "a2");
    if (cts.length != 4) {
      console.log(cts);
      throw new Error("回合結束後，a1的內文必須回到4個");
    }
  }
}
