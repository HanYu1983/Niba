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

export function testProto_179001_01A_CH_WT007R_white() {
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
              protoID: "179001_01A_CH_WT007R_white",
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
      timing: [0, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]],
      setGroupLink: { a1: "a2" },
    },
  };
  ctx = initState(ctx);
  const proto = getPrototype("179001_01A_CH_WT007R_white");
  const text = proto.texts.find(
    (t) =>
      t.description ==
      "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。"
  );
  if (text == null) {
    throw new Error(
      "找不到:（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。"
    );
  }
  if (text.id != "使用型") {
    throw new Error("must be 恒常");
  }
  let block = wrapTip(
    ctx,
    true,
    wrapBlockRequireKey({
      ...text.block,
      cause: {
        id: "BlockPayloadCauseUpdateCommand",
        playerID: PlayerA,
        cardID: "a1",
        cardTextID: "",
        description: "",
      },
    }),
    "tmp"
  );
  console.log("支付內文");
  ctx = doBlockPayload(ctx, block);
  if (ctx.gameState.stackEffect.length == 0) {
    throw new Error("必須有效果在堆疊");
  }
  block = ctx.gameState.stackEffect[0];
  ctx = doBlockPayload(ctx, block);
  if (ctx.gameState.globalCardState.length == 0) {
    throw new Error("必須有全域內文");
  }
  console.log("更新全域效果");
  ctx = updateEffect(ctx);
  console.log(ctx);
  if (ctx.gameState.effects.length == 0) {
    throw new Error("必須有全域效果");
  }
  console.log("觸發回合結束");
  ctx = triggerTextEvent(ctx, {
    id: "GameEventOnTiming",
    timing: [34, ["戦闘フェイズ", "ターン終了時", "効果終了。ターン終了"]],
  });
  if (ctx.gameState.globalCardState.length != 0) {
    throw new Error("全域內文必須被刪除");
  }
  console.log("更新全域效果");
  ctx = updateEffect(ctx);
  if (ctx.gameState.effects.length != 0) {
    throw new Error("全域效果必須被刪除");
  }
}
