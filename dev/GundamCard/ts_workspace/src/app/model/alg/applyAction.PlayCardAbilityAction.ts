import { log2 } from "../../../tool/logger";
import { Context, PlayCardAbilityAction, Effect } from "../../types";
import { queryPlayCardAbilityPayment } from "./queryPlayCardAbilityPayment";

export function applyAction_PlayCardAbilityAction(
  ctx: Context,
  playerID: string,
  action: PlayCardAbilityAction
): Context {
  if (ctx.gameState.paymentTable.action != null) {
    throw new Error(`${ctx.gameState.paymentTable.action.playerID}還在支付中`);
  }
  if (action.cardID == null) {
    throw new Error("你必須指定cardID");
  }
  const payments = queryPlayCardAbilityPayment(
    ctx,
    playerID,
    action.cardID,
    action.abilityID
  );
  // 沒有cost就直接放入堆疊
  if (payments.length == 0) {
    log2("applyAction_PlayCardAbilityAction", "沒有cost就直接放入堆疊");
    const effect: Effect = {
      id: "ActionEffect",
      action: action,
      currents: [],
    };
    return {
      ...ctx,
      gameState: {
        ...ctx.gameState,
        effectStack: {
          effects: [effect, ...ctx.gameState.effectStack.effects],
        },
      },
    };
  }
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      paymentTable: {
        action: action,
        requires: payments,
        currents: [],
        snapshot: ctx,
        isLock: false,
      },
    },
  };
  return ctx;
}
