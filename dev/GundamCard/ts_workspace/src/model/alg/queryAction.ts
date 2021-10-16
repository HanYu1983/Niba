import { mapCard, moveCard, Card } from "../../tool/table";
import { Context, Action, Payment, Effect } from "../../tool/types";
import { askPlayerG, cardPositionID, askCardState, askCardAction } from ".";
import { PlayerA } from "../../app/context";

export function queryAction(ctx: Context, playerID: string): Action[] {
  // TODO: 如果疊堆中有效果, 回傳確認沒事action
  // TODO: 如果疊堆中有效果, 又全部玩家都確認沒事時, 回傳系統處理疊堆action
  // 系統處理疊堆action一次只處理一個效果
  if (ctx.gameState.effectStack.effects.length) {
    return [{
      id: "SystemHandleEffectAction",
      playerID: PlayerA
    }]
  }
  // TODO: 如果破壞效果列表中有卡牌，回傳系統處理破壞效果action. 
  // 那個action會將其中一張卡的破壞效果放入堆疊
  // 這個時候就可以使用將破壞的卡廢棄獲得能力的指令卡(切入效果)
  if (ctx.gameState.destroyCardID.length) {
    return [{
      id: "SystemAddDestroyEffectAction",
      playerID: PlayerA
    }]
  }
  if (ctx.gameState.phase[1] == "effect") {
    return [{
      id: "SystemHandlePhaseEffectAction",
      playerID: PlayerA
    }]
  }
  const ret: Action[] = [];
  if (ctx.gameState.paymentTable.action?.playerID == playerID) {
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
  {
    // 正常狀態
    const myCards: Card[] = [];
    mapCard(ctx.gameState.table, (card) => {
      if (card.ownerID == playerID) {
        myCards.push(card);
      }
      return card;
    });
    const actions = myCards.flatMap((card) => {
      return askCardAction(ctx, card);
    });
    // const hands =
    //   ctx.gameState.table.cardStack[
    //     cardPositionID({ playerID: playerID, where: "hand" })
    //   ] || [];
    // const actions = hands.flatMap((card): Action => {
    //   return {
    //     id: "PlayCardAction",
    //     cardID: card.id,
    //     playerID: playerID,
    //     position: null,
    //   };
    // });
    ret.push(...actions);
  }
  return ret;
}
