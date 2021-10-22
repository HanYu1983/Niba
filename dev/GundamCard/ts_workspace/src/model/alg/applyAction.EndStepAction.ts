import { mapCard, moveCard } from "../../tool/table";
import { Context, EndStepAction } from "../../tool/types";
import { cardPositionID, opponent } from "./tool";

export function applyAction_EndStepAction(
  ctx: Context,
  playerID: string,
  action: EndStepAction
): Context {
  if (true) {
    // 如果雙方都endStep
    // 抽牌階段規定效果
    // 主動玩家抽牌
    const activePlayerID = playerID;
    const num = 1;
    const homeStack =
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: activePlayerID, where: "home" })
      ] || [];
    const topCards = homeStack.slice(
      Math.max(0, homeStack.length - num),
      homeStack.length
    );
    const nextTable = topCards.reduce((table, card) => {
      return moveCard(
        table,
        cardPositionID({ playerID: activePlayerID, where: "home" }),
        cardPositionID({ playerID: activePlayerID, where: "hand" }),
        card.id,
        null
      );
    }, ctx.gameState.table);
    if (
      (
        nextTable.cardStack[
          cardPositionID({ playerID: activePlayerID, where: "home" })
        ] || []
      ).length == 0
    ) {
      // 牌庫抽完了，遊戲結束
    }
    return {
      ...ctx,
      gameState: {
        ...ctx.gameState,
        table: nextTable,
      },
    };
  }
  return ctx;
}
