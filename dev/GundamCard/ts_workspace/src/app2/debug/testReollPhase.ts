import { DEFAULT_GAME_CONTEXT } from "../tool/tool/basic/gameContext";
import {
  initState,
  updateEffect,
  //updateCommand,
  triggerTextEvent,
} from "../tool/alg/handleGameContext";
import { createCard, getCard } from "../../tool/table";
import { getBaSyouID, PlayerA, PlayerB } from "../tool/tool/basic/basic";
import { recurRequire } from "../tool/tool/basic/blockPayload";
import { applyFlow, queryFlow } from "../tool/alg/handleClient";

export function testReollPhase() {
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
              protoID: "179004_01A_CH_WT009R_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: true,
            },
          ],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "配備エリア"],
          })]: [
            {
              id: "a1",
              protoID: "179004_01A_CH_WT009R_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: true,
            },
            {
              id: "a2",
              protoID: "179003_01A_U_BK008U_black",
              faceDown: true,
              ownerID: PlayerA,
              tap: true,
            },
          ],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "Gゾーン"],
          })]: [
            {
              id: "g1",
              protoID: "179003_01A_U_BK008U_black",
              faceDown: true,
              ownerID: PlayerA,
              tap: true,
            },
          ],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "配備エリア"],
          })]: [
            {
              id: "b1",
              protoID: "179003_01A_U_BK008U_black",
              faceDown: true,
              ownerID: PlayerB,
              tap: true,
            },
          ],
        },
      },
      activePlayerID: PlayerA,
      timing: [0, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]],
    },
  };
  if (
    ["h1", "a1", "a2", "g1", "b1"]
      .map((cardID) => {
        return getCard(ctx.gameState.table, cardID)?.tap || false;
      })
      .includes(false)
  ) {
    throw new Error("我控制的卡一開始全部横置");
  }
  console.log("處理重置階段效果");
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowHandleRerollPhaseRule",
    description: "",
  });
  if (
    ["a1", "a2", "g1"]
      .map((cardID) => {
        return getCard(ctx.gameState.table, cardID)?.tap || false;
      })
      .includes(true)
  ) {
    throw new Error("我控制的卡必須全部重置");
  }
  if (
    ["h1", "b1"]
      .map((cardID) => {
        return getCard(ctx.gameState.table, cardID)?.tap || false;
      })
      .includes(false)
  ) {
    throw new Error("非我控制的卡不能重置");
  }
}
