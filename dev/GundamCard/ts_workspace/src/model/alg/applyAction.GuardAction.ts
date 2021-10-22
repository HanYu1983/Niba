import { mapCard, moveCard } from "../../tool/table";
import { Context, GuardAction } from "../../tool/types";
import { cardPositionID, opponent } from "./tool";

export function applyAction_GuardAction(
  ctx: Context,
  playerID: string,
  action: GuardAction
): Context {
  if (ctx.gameState.phase[0] != "guard") {
    throw new Error("現在不是防禦階段");
  }
  if (ctx.gameState.phase[1] != "effect") {
    throw new Error("現在不是規定效果");
  }
  if (ctx.gameState.activePlayerID == playerID) {
    throw new Error("被動玩家才能防禦");
  }
  if (action.from == null) {
    throw new Error("你沒有指定from");
  }
  if (action.to == null) {
    throw new Error("你沒有指定to");
  }
  if (action.cardID == null) {
    throw new Error("你沒有指定cardID");
  }
  if (action.to.where != "universe" && action.to.where != "earth") {
    throw new Error("你必須指定戰鬥區域");
  }
  // 直接將卡移到戰場, 沒有切入時間
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: moveCard(
        ctx.gameState.table,
        cardPositionID(action.from),
        cardPositionID(action.to),
        action.cardID,
        action.beforeCardID
      ),
    },
  };
}
