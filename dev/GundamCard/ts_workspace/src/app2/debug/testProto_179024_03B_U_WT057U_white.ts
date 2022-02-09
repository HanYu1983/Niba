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
import { getCardBattlePoint } from "../tool/alg/helper";
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

export function testProto_179024_03B_U_WT057U_white() {
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
              protoID: "179024_03B_U_WT057U_white",
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
              protoID: "179030_11E_G_RD021N_red",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
            {
              id: "g2",
              protoID: "179030_11E_G_RD021N_red",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
          ],
        },
      },
      activePlayerID: PlayerA,
      timing: [0, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]],
      setGroupLink: { a1: "a2" },
    },
  };
  ctx = initState(ctx);
  ctx = updateCommand(ctx);
  if (ctx.gameState.commandEffect.length != 1) {
    throw new Error("必須要有一個指令");
  }
  ctx = doBlockPayload(ctx, ctx.gameState.commandEffect[0]);
  if (ctx.gameState.stackEffect.length != 1) {
    throw new Error("必須要有一個指令");
  }
  {
    const bp = getCardBattlePoint(ctx, "a1");
    if (JSON.stringify(bp) != JSON.stringify([5, 2, 4])) {
      console.log(bp);
      throw new Error("一開始戰鬥力是[5,2,4]");
    }
  }
  const cmd = wrapTip(ctx, true, ctx.gameState.stackEffect[0], "tmp");
  ctx = doBlockPayload(ctx, cmd);
  {
    const bp = getCardBattlePoint(ctx, "a1");
    if (JSON.stringify(bp) != JSON.stringify([9, 2, 4])) {
      console.log(bp);
      throw new Error("必須變成[9,2,4]");
    }
  }
  ctx = triggerTextEvent(ctx, {
    id: "GameEventOnTiming",
    timing: [34, ["戦闘フェイズ", "ターン終了時", "効果終了。ターン終了"]],
  });
  {
    const bp = getCardBattlePoint(ctx, "a1");
    if (JSON.stringify(bp) != JSON.stringify([5, 2, 4])) {
      console.log(bp);
      throw new Error("必須變回[5,2,4]");
    }
  }
}
