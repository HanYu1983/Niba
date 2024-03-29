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
  TIMING_CHART,
} from "../tool/tool/basic/basic";
import { BlockPayload, wrapRequireKey } from "../tool/tool/basic/blockPayload";
import {
  DEFAULT_GAME_CONTEXT,
  GameContext,
} from "../tool/tool/basic/gameContext";

export function testProto_179022_06C_CH_WT057R_white() {
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
            value: [PlayerA, "手札"],
          })]: [
            {
              id: "h1",
              protoID: "179025_07D_U_RD156R_red",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
          ],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "配備エリア"],
          })]: [
            {
              id: "a1",
              protoID: "179022_06C_CH_WT057R_white",
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
      setGroupLink: { a1: "a2" },
    },
  };
  ctx = initState(ctx);
  ctx = updateEffect(ctx);
  ctx = updateEffect(ctx);
  ctx = updateEffect(ctx);
  console.log(ctx);
  if (ctx.gameState.globalCardState.length != 1) {
    throw new Error("必須有專用機成立的效果，並只有1個");
  }
  console.log("移除駕駛");
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      setGroupLink: {},
    },
  };
  ctx = updateEffect(ctx);
  if (ctx.gameState.globalCardState.length != 0) {
    throw new Error("專用機成立的效果必須解除");
  }
}
