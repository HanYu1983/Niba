import { mapCard, moveCard, Card } from "../../../tool/table";
import { Context, Action, Payment, Effect } from "../../types";
import {
  askPlayerG,
  cardPositionID,
  askCardState,
  askCardAction,
} from "./tool";
import { PlayerA, PlayerB } from "../../types";
import {
  isEveryConfirmPhase,
  SystemAddDestroyEffectAction,
  AddDestroyEffectAction,
} from "../../types";

export function queryAction(ctx: Context, playerID: string): Action[] {
  const ret: Action[] = [];
  {
    // 正常狀態
    // Example
    // 如果最上面的效果是破壞效果
    //if (ctx.gameState.effectStack.effects[0].id == "DestroyEffect") {
    // 將破壞的卡廢棄的指令可以使用
    //}

    if (
      ctx.gameState.phase[0] == "attack" ||
      ctx.gameState.phase[1] == "effect"
    ) {
      if (ctx.gameState.activePlayerID == playerID) {
        // AttackAction
      }
    }

    if (
      ctx.gameState.phase[0] == "guard" ||
      ctx.gameState.phase[1] == "effect"
    ) {
      if (ctx.gameState.activePlayerID != playerID) {
        // GuardAction
      }
    }

    // 我所有的卡
    const myCards: Card[] = [];
    mapCard(ctx.gameState.table, (card) => {
      if (card.ownerID == playerID) {
        myCards.push(card);
      }
      return card;
    });
    // 收集動作
    const actions = myCards.flatMap((card) => {
      return askCardAction(ctx, card);
    });
    ret.push(...actions);
  }
  if (ctx.gameState.effectStack.effects.length) {
    // 如果疊堆中有效果,
    if (isEveryConfirmPhase(ctx, [PlayerA, PlayerB])) {
      // 又全部玩家都確認沒事時, 回傳SystemHandleEffectAction
      // SystemHandleEffectAction一次只處理一個效果
      ret.push({
        id: "SystemHandleEffectAction",
        playerID: PlayerA,
      });
    }
  } else if (ctx.gameState.destroyEffect.length) {
    // 如果破壞效果列表中有卡牌，回傳SystemAddDestroyEffectAction
    // SystemAddDestroyEffectAction會將其中一張卡的破壞效果放入堆疊
    // 這個時候就可以使用將破壞的卡廢棄獲得能力的指令卡(切入效果)
    ret.push(
      ...ctx.gameState.destroyEffect.map((e): AddDestroyEffectAction => {
        return {
          id: "AddDestroyEffectAction",
          playerID: playerID,
          cardID: e.cardID,
        };
      })
    );
    ret.push({
      id: "SystemAddDestroyEffectAction",
      playerID: PlayerA,
    });
  } else if (ctx.gameState.phase[1] == "effect") {
    ret.push({
      id: "SystemHandlePhaseEffectAction",
      playerID: PlayerA,
    });
  } else if (ctx.gameState.paymentTable.action?.playerID == playerID) {
    // 支付狀態
    ret.push({
      id: "CancelPaymentAction",
      playerID: playerID,
    });
    ret.push({
      id: "ApplyPaymentAction",
      playerID: playerID,
    });
    return ret;
  }
  if (ctx.gameState.phase[1] != "effect") {
    // 有人沒有確認沒事
    if ((ctx.gameState.playerState[playerID]?.confirmPhase || false) == false) {
      // 如果是自己, 回傳ConfirmPhaseAction
      ret.push({
        id: "ConfirmPhaseAction",
        playerID: playerID,
      });
    } else {
      // 取消確認
      ret.push({
        id: "CancelConfirmPhaseAction",
        playerID: playerID,
      });
      if (playerID == PlayerA) {
        ret.push({
          id: "SystemNextStepAction",
          playerID: playerID,
        });
      }
    }
  }
  return ret;
}
