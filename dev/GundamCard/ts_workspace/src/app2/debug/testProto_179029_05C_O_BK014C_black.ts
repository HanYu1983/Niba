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

export function testProto_179029_05C_O_BK014C_black() {
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
            value: [PlayerB, "配備エリア"],
          })]: [
            {
              id: "b1",
              protoID: "179029_05C_O_BK014C_black",
              faceDown: true,
              ownerID: PlayerB,
              tap: false,
            },
            {
              id: "b2",
              protoID: "179025_07D_U_RD156R_red",
              faceDown: true,
              ownerID: PlayerB,
              tap: false,
            },
          ],
        },
      },
      setGroupLink: { b1: "b2" },
    },
  };
  ctx = initState(ctx);
  ctx = updateCommand(ctx);
  ctx = triggerTextEvent(ctx, {
    id: "プレイした場合",
    cardID: "b2",
    cardTextID: "",
  });
  if (ctx.gameState.immediateEffect.length == 0) {
    throw new Error("b2 play text的情況下, 必須發動b1的起動技能");
  }
  const topEffect = ctx.gameState.immediateEffect[0];
  if (topEffect.cause?.id != "BlockPayloadCauseGameEvent") {
    throw new Error("必須是事件觸發的效果");
  }
  if (topEffect.cause.cardID != "b1") {
    throw new Error("必須發動b1的起動技能");
  }
  console.log("清空效果");
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      immediateEffect: [],
    },
  };
  ctx = triggerTextEvent(ctx, {
    id: "プレイした場合",
    cardID: "b1",
    cardTextID: "",
  });
  if (ctx.gameState.immediateEffect.length == 0) {
    throw new Error("b1 play text的情況下, 也必須發動b1的起動技能");
  }
  console.log("清空效果");
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      immediateEffect: [],
    },
  };
  ctx = triggerTextEvent(ctx, {
    id: "プレイした場合",
    cardID: "other",
    cardTextID: "",
  });
  if (ctx.gameState.immediateEffect.length != 0) {
    throw new Error("其它卡的play不能發動b1的起動技能");
  }
}
