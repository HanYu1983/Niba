import { createCard, DEFAULT_TABLE, getCard, mapCard } from "../../tool/table";
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
import { getCardBattlePoint, getCardState } from "../tool/alg/helper";
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
  checkIsBattle,
  DEFAULT_GAME_CONTEXT,
  GameContext,
} from "../tool/tool/basic/gameContext";

export function testProto_179030_11E_C_BL076S_blue() {
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
              protoID: "179030_11E_C_BL076S_blue",
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
              protoID: "179003_01A_U_BK008U_black",
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
            value: [PlayerA, "戦闘エリア（右）"],
          })]: [
            {
              id: "ab1",
              protoID: "179003_01A_U_BK008U_black",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
          ],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "Gゾーン"],
          })]: [
            {
              id: "g1",
              protoID: "179023_06C_G_BL021C_blue",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
            {
              id: "g2",
              protoID: "179023_06C_G_BL021C_blue",
              faceDown: true,
              ownerID: PlayerA,
              tap: false,
            },
            {
              id: "g3",
              protoID: "179030_11E_C_BL076S_blue",
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
              id: "bb1",
              protoID: "179003_01A_U_BK008U_black",
              faceDown: true,
              ownerID: PlayerB,
              tap: false,
            },
          ],
        },
      },
      timing: [0, ["戦闘フェイズ", "防御ステップ", "フリータイミング"]],
    },
  };
  ctx = initState(ctx);
  {
    const bp = getCardBattlePoint(ctx, "ab1");
    if (JSON.stringify(bp) != JSON.stringify([4, 1, 4])) {
      throw new Error("一開始ab1的戰鬥力是[4,1,4]");
    }
  }
  ctx = updateCommand(ctx);
  {
    const cmds = getClientCommand(ctx, PlayerA);
    if (cmds.length != 0) {
      console.log(cmds);
      throw new Error("沒在正確回合，必須沒有指令");
    }
  }
  console.log("到敵人回合");
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      activePlayerID: PlayerB,
    },
  };
  console.log("判定交戰");
  ctx = checkIsBattle(ctx);
  if (
    ctx.gameState.isBattle[
      getBaSyouID({
        id: "AbsoluteBaSyou",
        value: [PlayerA, "戦闘エリア（右）"],
      })
    ] != true
  ) {
    throw new Error("右戰區必須是戰鬥中");
  }
  console.log("判定交戰後要更新指令");
  ctx = updateCommand(ctx);
  {
    const cmds = getClientCommand(ctx, PlayerA);
    if (cmds.length != 1) {
      console.log(cmds);
      console.log(ctx);
      throw new Error("必須有一個指令");
    }
    ctx = doBlockPayload(ctx, cmds[0]);
  }
  if (ctx.gameState.stackEffect.length == 0) {
    throw new Error("堆疊必須有一個效果");
  }
  console.log("解決卡片效果，破壞非交戰的所有卡片");
  {
    const cmd = wrapTip(ctx, true, ctx.gameState.stackEffect[0], "tmp");
    ctx = doBlockPayload(ctx, cmd);
  }
  {
    const [_, cardState] = getCardState(ctx, "a1");
    if (cardState.destroyReason == null) {
      console.log(ctx);
      throw new Error("a1必須被破壞");
    }
  }
  {
    const [_, cardState] = getCardState(ctx, "a2");
    if (cardState.destroyReason == null) {
      console.log(ctx);
      throw new Error("a2必須被破壞");
    }
  }
  console.log("doBlockPayload後必須觸發解決直後的效果");
  if (ctx.gameState.immediateEffect.length == 0) {
    throw new Error("立即必須有一個效果(解決直後可以横裝彈G)");
  }
  {
    const card = getCard(ctx.gameState.table, "g3");
    if (card?.tap != false) {
      console.log(ctx);
      throw new Error("g3一開始是直的");
    }
  }
  console.log("横置裝彈G(g3)");
  {
    const cmd = wrapTip(ctx, true, ctx.gameState.immediateEffect[0], "tmp");
    ctx = doBlockPayload(ctx, cmd);
  }
  {
    const card = getCard(ctx.gameState.table, "g3");
    if (card?.tap != true) {
      throw new Error("g3必須横置");
    }
  }
  if (ctx.gameState.table.tokens.length != 2) {
    throw new Error("場上必須有2個token");
  }
  {
    const bp = getCardBattlePoint(ctx, "ab1");
    if (JSON.stringify(bp) != JSON.stringify([6, 3, 6])) {
      console.log(ctx);
      throw new Error("最後ab1的戰鬥力是[6,3,6]");
    }
  }
}
