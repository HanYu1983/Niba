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

export function testProto_179004_01A_CH_WT010C_white() {
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
              protoID: "179004_01A_CH_WT010C_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
            {
              id: "a2",
              protoID: "179030_11E_G_RD021N_red",
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
      setGroupLink: { a1: "a2" },
    },
  };
  ctx = initState(ctx);
  ctx = triggerTextEvent(ctx, { id: "戦闘ダメージを受けた場合", cardID: "a2" });
  if (ctx.gameState.immediateEffect.length == 0) {
    throw new Error("必須有一個立即效果");
  }
  const block = ctx.gameState.immediateEffect[0];
  ctx = doBlockPayload(ctx, block);

  console.log(ctx);
}
