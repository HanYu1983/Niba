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
import { getCardBaSyou } from "../tool/tool/basic/handleCard";

export function testReturnStep() {
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
            value: [PlayerA, "戦闘エリア（右）"],
          })]: [
            {
              id: "a1",
              protoID: "179004_01A_CH_WT009R_white",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
            {
              id: "a2",
              protoID: "179003_01A_U_BK008U_black",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
          ],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "戦闘エリア（右）"],
          })]: [
            {
              id: "b1",
              protoID: "179003_01A_U_BK008U_black",
              faceDown: true,
              ownerID: PlayerB,
              tap: false,
            },
          ],
        },
      },
      activePlayerID: PlayerA,
      timing: [0, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]],
    },
  };
  if (
    ["a1", "a2"]
      .map((cardID) => {
        return getCard(ctx.gameState.table, cardID)?.tap || false;
      })
      .includes(true)
  ) {
    throw new Error("我控制的卡必須全部重置");
  }
  console.log("處理歸還效果");
  ctx = applyFlow(ctx, PlayerA, {
    id: "FlowHandleReturnStepRule",
    description: "",
  });
  if (
    ["a1", "a2"].filter((cardID) => {
      const baSyou = getCardBaSyou(ctx, cardID);
      if (baSyou.value[0] != PlayerA) {
        return false;
      }
      if (baSyou.value[1] != "配備エリア") {
        return false;
      }
      return true;
    }).length != 2
  ) {
    throw new Error("我戰區的卡必須回配置區");
  }
  if (
    ["a1", "a2"]
      .map((cardID) => {
        return getCard(ctx.gameState.table, cardID)?.tap || false;
      })
      .includes(false)
  ) {
    throw new Error("移回去的卡必須横置");
  }
  if (
    ["b1"].filter((cardID) => {
      const baSyou = getCardBaSyou(ctx, cardID);
      if (baSyou.value[0] != PlayerB) {
        return false;
      }
      if (baSyou.value[1] != "配備エリア") {
        return false;
      }
      return true;
    }).length != 1
  ) {
    throw new Error("敵戰區的卡必須回敵配置區");
  }
  if (
    ["b1"]
      .map((cardID) => {
        return getCard(ctx.gameState.table, cardID)?.tap || false;
      })
      .includes(false)
  ) {
    throw new Error("移回去的敵人卡必須横置");
  }
}
