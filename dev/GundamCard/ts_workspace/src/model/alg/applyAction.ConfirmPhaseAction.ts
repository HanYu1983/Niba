import { mapCard, moveCard } from "../../tool/table";
import {
  Context,
  Action,
  Payment,
  Effect,
  ConfirmPhaseAction,
  mapPlayerState,
  isEveryConfirmPhase,
} from "../../tool/types";
import { PlayerA, PlayerB } from "../../tool/types";

export function applyAction_ConfirmPhaseAction(
  ctx: Context,
  playerID: string,
  action: ConfirmPhaseAction
): Context {
  if (ctx.gameState.phase[1] == "effect") {
    throw new Error("請先處理規定效果");
  }
  if (ctx.gameState.paymentTable.action != null) {
    throw new Error("請先處理支付");
  }
  // 玩家宣告沒事
  ctx = mapPlayerState(ctx, [playerID], (playerState) => {
    return {
      ...playerState,
      confirmPhase: true,
    };
  });
  // 如果還有玩家有事要做，就回傳
  if (isEveryConfirmPhase(ctx, [PlayerA, PlayerB]) == false) {
    return ctx;
  }
  // 所有玩家都宣告沒事
  // 如果堆疊存在，先解決效果，回傳
  if (ctx.gameState.effectStack.effects.length) {
    console.log("先攻玩家準備呼叫SystemHandleEffectAction");
    return ctx;
  }
  return ctx;
}
