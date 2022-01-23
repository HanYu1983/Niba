import { log2 } from "../../../tool/logger";
import { Context, PlayCardAction, Effect } from "../../types";
import { queryPlayCardPayment } from "./queryPlayCardPayment";

export function applyAction_PlayCardAction(
  ctx: Context,
  playerID: string,
  action: PlayCardAction
): Context {
  if (ctx.gameState.paymentTable.action != null) {
    throw new Error(`${ctx.gameState.paymentTable.action.playerID}還在支付中`);
  }
  if (action.cardID == null) {
    throw new Error("你必須指定cardID");
  }
  if (action.to == null) {
    throw new Error(`沒有指定出場位置`);
  }
  // 放G的話直接進堆疊
  if (action.to.where == "G") {
    log2("applyAction_PlayCardAction", "放G的話直接進堆疊");
    if (ctx.gameState.effectStack.effects.length) {
      throw new Error(`請先處理效果。或是雙方玩家呼叫ConfirmPhaseAction`);
    }
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
  const payments = queryPlayCardPayment(ctx, playerID, action.cardID);
  // 沒有cost就直接放入堆疊
  if (payments.length == 0) {
    log2("applyAction_PlayCardAction", "沒有cost就直接放入堆疊");
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
