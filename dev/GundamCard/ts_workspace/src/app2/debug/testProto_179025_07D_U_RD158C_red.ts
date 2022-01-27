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
  TIMING_CHART,
} from "../tool/tool/basic/basic";
import { BlockPayload, wrapRequireKey } from "../tool/tool/basic/blockPayload";
import {
  DEFAULT_GAME_CONTEXT,
  GameContext,
} from "../tool/tool/basic/gameContext";

export function testProto_179025_07D_U_RD158C_red() {
  let ctx = DEFAULT_GAME_CONTEXT;
  let table = ctx.gameState.table;
  console.log("準備F91在手上");
  table = createCard(
    table,
    PlayerA,
    getBaShouID({
      id: "AbsoluteBaSyou",
      value: [PlayerA, "手札"],
    }),
    ["179025_07D_U_RD158C_red"]
  );
  console.log("準備2張G");
  table = createCard(
    table,
    PlayerA,
    getBaShouID({
      id: "AbsoluteBaSyou",
      value: [PlayerA, "Gゾーン"],
    }),
    ["179030_11E_G_RD021N_red", "179030_11E_G_RD021N_red"]
  );
  console.log("假設敵人play到一半");
  table = createCard(
    table,
    PlayerB,
    getBaShouID({
      id: "AbsoluteBaSyou",
      value: [PlayerB, "プレイされているカード"],
    }),
    ["179030_11E_G_RD021N_red"]
  );
  table = createCard(
    table,
    PlayerB,
    getBaShouID({
      id: "AbsoluteBaSyou",
      value: [PlayerB, "戦闘エリア（右）"],
    }),
    ["179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white"]
  );
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: table,
      activePlayerID: PlayerA,
      // @ts-ignore
      timing: TIMING_CHART.find(
        (t) =>
          t[1][0] == "戦闘フェイズ" &&
          t[1][1] == "ダメージ判定ステップ" &&
          t[1][2] == "フリータイミング"
      ),
    },
  };
  ctx = initState(ctx);
  ctx = updateEffect(ctx);
  ctx = updateCommand(ctx);
  if (ctx.gameState.commandEffect.length != 2) {
    console.log(ctx);
    throw new Error("指令池必須有指令-3合計國力後的指令");
  }
  let cmd = ctx.gameState.commandEffect[0];
  ctx = doBlockPayload(ctx, cmd);
  if (ctx.gameState.stackEffect.length == 0) {
    console.log(ctx);
    throw new Error("必須支付成功");
  }
  cmd = ctx.gameState.stackEffect[0];
  console.log("執行-3合計國力的play，出場");
  ctx = doBlockPayload(ctx, cmd);
  if (ctx.gameState.immediateEffect.length != 1) {
    console.log(ctx);
    throw new Error("必須有出場時技能");
  }
  cmd = ctx.gameState.immediateEffect[0];
  console.log("執行起動效果");
  ctx = doBlockPayload(ctx, cmd);
  console.log("模擬切入結束時");
  ctx = triggerTextEvent(ctx, {
    id: "カット終了時",
    effects: [cmd],
  });
  if (ctx.gameState.immediateEffect.length != 2) {
    console.log(ctx);
    throw new Error("必須有切入結束時技能");
  }
  cmd = ctx.gameState.immediateEffect[0];
  console.log("執行起動效果");
  ctx = doBlockPayload(ctx, cmd);
  console.log(ctx);
}
