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

export function testProto_179004_01A_CH_WT009R_white() {
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
            value: [PlayerA, "配備エリア"],
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
            value: [PlayerA, "Gゾーン"],
          })]: [],
        },
      },
      activePlayerID: PlayerA,
      timing: [0, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]],
    },
  };
  ctx = initState(ctx);
  {
    const bp = getCardBattlePoint(ctx, "a2");
    if (JSON.stringify(bp) != JSON.stringify([4, 1, 4])) {
      throw new Error("一開始a2是[4,1,4]");
    }
  }
  console.log("發一個非自軍的gain");
  ctx = triggerTextEvent(ctx, {
    id: "「ゲイン」の効果で戦闘修正を得る場合",
    cardID: "otherCard",
    battleBonus: [1, 1, 1],
  });
  if (ctx.gameState.immediateEffect.length != 0) {
    console.log(ctx);
    throw new Error("除了自己軍被gain才能有效果");
  }
  console.log("發一個自軍的[2,1,1]的gain");
  ctx = triggerTextEvent(ctx, {
    id: "「ゲイン」の効果で戦闘修正を得る場合",
    cardID: "a1",
    battleBonus: [2, 1, 1],
  });
  if (ctx.gameState.immediateEffect.length != 1) {
    console.log(ctx);
    throw new Error("必須有一個立即效果");
  }
  {
    const cmd = wrapTip(ctx, true, ctx.gameState.immediateEffect[0], "tmp");
    console.log("執行效果");
    ctx = doBlockPayload(ctx, cmd);
  }
  {
    const bp = getCardBattlePoint(ctx, "a2");
    if (JSON.stringify(bp) != JSON.stringify([6, 2, 5])) {
      throw new Error("一開始a2是[6,2,5]");
    }
  }
  console.log("回合結束");
  ctx = triggerTextEvent(ctx, {
    id: "GameEventOnTiming",
    timing: [34, ["戦闘フェイズ", "ターン終了時", "効果終了。ターン終了"]],
  });
  {
    const bp = getCardBattlePoint(ctx, "a2");
    if (JSON.stringify(bp) != JSON.stringify([4, 1, 4])) {
      throw new Error("a2必須變回[4,1,4]");
    }
  }
}
