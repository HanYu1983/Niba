import { mapCard, moveCard } from "../../tool/table";
import {
  Context,
  Action,
  Payment,
  Effect,
  SystemHandleEffectAction,
  mapPlayerState,
  isEveryConfirmPhase,
} from "../../tool/types";
import { cardPositionID, opponent } from "./tool";
import { PlayerA, PlayerB } from "../../tool/types";
import { onEffectCompleted } from "./onEffectCompleted";
import { onCardEntered } from "./onCardEntered";

export function SystemHandleEffectAction(
  ctx: Context,
  playerID: string,
  action: SystemHandleEffectAction
): Context {
  if (ctx.gameState.effectStack.effects.length == 0) {
    throw new Error("沒有效果要處理");
  }
  if (ctx.gameState.activePlayerID != playerID) {
    throw new Error("只有主動玩家能操作");
  }
  if (isEveryConfirmPhase(ctx, [PlayerA, PlayerB]) == false) {
    throw new Error("雙方都要確認沒事才能操作SystemHandleEffectAction");
  }
  const topEffect = ctx.gameState.effectStack.effects[0];
  console.log("處理效果...", topEffect);
  switch (topEffect.id) {
    case "ActionEffect":
      switch (topEffect.action.id) {
        case "PlayCardAction":
          {
            if (topEffect.action.cardID == null) {
              throw new Error("cardID不存在，請檢查程式");
            }
            if (topEffect.action.to == null) {
              throw new Error(`to不存在，請檢查程式`);
            }
            if (topEffect.action.from == null) {
              throw new Error(`from不存在，請檢查程式`);
            }
            const nextTable = moveCard(
              ctx.gameState.table,
              cardPositionID(topEffect.action.from),
              cardPositionID(topEffect.action.to),
              topEffect.action.cardID,
              null
            );
            ctx = onCardEntered(
              {
                ...ctx,
                gameState: {
                  ...ctx.gameState,
                  table: nextTable,
                },
              },
              topEffect.action.cardID
            );
            ctx = onEffectCompleted(ctx, topEffect);
          }
          break;
        case "PlayCardAbilityAction":
          break;
        default:
          throw new Error("unknown action");
      }
      break;
    case "DestroyEffect":
      {
      }
      break;
    default:
      throw new Error(`unknown effect: ${topEffect}`);
  }
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      effectStack: {
        ...ctx.gameState.effectStack,
        effects: ctx.gameState.effectStack.effects.slice(1),
      },
    },
  };
  if (ctx.gameState.effectStack.effects.length == 0) {
    // 重設為非確認狀態
    ctx = mapPlayerState(ctx, [PlayerA, PlayerB], (playerState) => {
      return {
        ...playerState,
        confirmPhase: false,
      };
    });
  }
  return ctx;
}
