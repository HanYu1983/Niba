import { createCard, DEFAULT_TABLE, mapCard } from "../../tool/table";
import { doFeedback, doRequire } from "../tool/alg/handleBlockPayload";
import { applyFlow, doEffect, queryFlow } from "../tool/alg/handleClient";
import {
  initState,
  updateCommand,
  updateEffect,
} from "../tool/alg/handleGameContext";
import { getBaShouID, PlayerA, TIMING_CHART } from "../tool/tool/basic/basic";
import {
  DEFAULT_GAME_CONTEXT,
  GameContext,
} from "../tool/tool/basic/gameContext";

export function testProto_179025_07D_U_RD156R_red() {
  let ctx = DEFAULT_GAME_CONTEXT;
  let table = ctx.gameState.table;
  table = createCard(
    table,
    PlayerA,
    getBaShouID({
      id: "AbsoluteBaSyou",
      value: [PlayerA, "本国"],
    }),
    ["179025_07D_U_RD156R_red"]
  );
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: table,
      activePlayerID: PlayerA,
    },
  };
  ctx = initState(ctx);
  ctx = updateEffect(ctx);
  console.log(ctx);
}
