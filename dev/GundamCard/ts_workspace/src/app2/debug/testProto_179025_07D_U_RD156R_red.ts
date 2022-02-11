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

export function testProto_179025_07D_U_RD156R_red() {
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
              id: "a",
              protoID: "179025_07D_U_RD156R_red",
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
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "プレイされているカード"],
          })]: [
            {
              id: "b1",
              protoID: "179030_11E_O_BK012N_black",
              faceDown: true,
              ownerID: PlayerB,
              tap: false,
            },
          ],
        },
      },
    },
  };
  console.log(
    "取得內文:『恒常』：このカードは、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。"
  );
  const proto = getPrototype("179025_07D_U_RD156R_red");
  const text = proto.texts.find(
    (t) =>
      t.description ==
      "『恒常』：このカードは、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。"
  );
  if (text == null) {
    throw new Error(
      "找不到:『恒常』：このカードは、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。"
    );
  }
  if (text.id != "恒常") {
    throw new Error("must be 恒常");
  }
  if (text.texts.length == 0) {
    throw new Error("XX");
  }
  const block = wrapTip(
    ctx,
    true,
    wrapBlockRequireKey({
      ...text.texts[0].block,
      cause: {
        id: "BlockPayloadCauseUpdateCommand",
        playerID: PlayerA,
        cardID: "a",
        cardTextID: "",
        description: "",
      },
    }),
    "tmp"
  );
  console.log(block);
  console.log("支付內文");
  try {
    doBlockPayload(ctx, block);
  } catch (e) {
    console.log("必須沒有錯誤");
    throw e;
  }
}

export function testProto_179025_07D_U_RD156R_red2() {
  let ctx = DEFAULT_GAME_CONTEXT;
  let table = ctx.gameState.table;
  console.log("準備F91在手上");
  table = createCard(
    table,
    PlayerA,
    getBaSyouID({
      id: "AbsoluteBaSyou",
      value: [PlayerA, "手札"],
    }),
    ["179025_07D_U_RD156R_red"]
  );
  console.log("準備2張G");
  table = createCard(
    table,
    PlayerA,
    getBaSyouID({
      id: "AbsoluteBaSyou",
      value: [PlayerA, "Gゾーン"],
    }),
    ["179030_11E_G_RD021N_red", "179030_11E_G_RD021N_red"]
  );
  console.log("假設敵人play到一半");
  table = createCard(
    table,
    PlayerB,
    getBaSyouID({
      id: "AbsoluteBaSyou",
      value: [PlayerB, "プレイされているカード"],
    }),
    ["179030_11E_G_RD021N_red"]
  );
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: table,
      activePlayerID: PlayerA,
      // @ts-ignore
      timing: TIMING_CHART.find(
        (t) => t[1][0] == "配備フェイズ" && t[1][1] == "フリータイミング"
      ),
    },
  };
  ctx = initState(ctx);
  ctx = updateEffect(ctx);
  ctx = updateCommand(ctx);
  const cmds = getClientCommand(ctx, PlayerA);
  if (cmds.length == 0) {
    console.log(ctx);
    throw new Error("必須有指令-3合計國力後的指令");
  }
  let cmd = cmds[0];
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
