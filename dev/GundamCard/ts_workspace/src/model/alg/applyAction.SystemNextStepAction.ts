import { mapCard, moveCard } from "../../tool/table";
import {
  Context,
  Action,
  SystemNextStepAction,
  Effect,
  ApplyPaymentAction,
  mapPlayerState,
  isEveryConfirmPhase,
} from "../../tool/types";
import { PlayerA, PlayerB } from "../../tool/types";
import { askNextPhase } from "./askNextPhase";

export function applyAction_SystemNextStepAction(
  ctx: Context,
  playerID: string,
  action: SystemNextStepAction
): Context {
  if (isEveryConfirmPhase(ctx, [PlayerA, PlayerB]) == false) {
    throw new Error("雙方都要確認沒事才能操作SystemNextStepAction");
  }
  if (ctx.gameState.phase[1] == "effect") {
    throw new Error("請先處理規定效果");
  }
  // 移到下個階段
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      phase: askNextPhase(ctx, ctx.gameState.phase),
    },
  };
  // 重設為非確認狀態
  ctx = mapPlayerState(ctx, [PlayerA, PlayerB], (playerState) => {
    return {
      ...playerState,
      confirmPhase: false,
    };
  });
  return ctx;
}
