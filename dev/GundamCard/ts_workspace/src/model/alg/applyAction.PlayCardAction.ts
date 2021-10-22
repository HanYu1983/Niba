import { Context, PlayCardAction, Effect } from "../../tool/types";
import { queryPlayCardPayment } from "./queryPlayCardPayment";

export function PlayCardAction(
  ctx: Context,
  playerID: string,
  action: PlayCardAction & { playerID: string }
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
