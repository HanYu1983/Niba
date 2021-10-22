import { mapCard, moveCard } from "../../tool/table";
import {
  Context,
  Action,
  CancelConfirmPhaseAction,
  Effect,
  ApplyPaymentAction,
  mapPlayerState,
  isEveryConfirmPhase,
} from "../../tool/types";

export function CancelConfirmPhaseAction(
  ctx: Context,
  playerID: string,
  action: CancelConfirmPhaseAction
): Context {
  if (ctx.gameState.phase[1] == "effect") {
    throw new Error("請先處理規定效果");
  }
  // 取消宣告沒事
  ctx = mapPlayerState(ctx, [playerID], (playerState) => {
    return {
      ...playerState,
      confirmPhase: false,
    };
  });
  return ctx;
}
