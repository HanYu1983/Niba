import { mapCard, moveCard } from "../../../tool/table";
import {
  CardPosition,
  Context,
  DestroyEffect,
  mapPlayerState,
  PlayerA,
  PlayerB,
  SystemHandlePhaseEffectAction,
} from "../../types";
import { cardPositionID, opponent } from "./tool";
import { handleAttackDamage } from "./handleAttackDamage";
import { askNextPhase } from "./askNextPhase";
import { mapCardState } from "./mapCardState";
import { getCardState } from "./getCardState";

export function applyAction_SystemHandlePhaseEffectAction(
  ctx: Context,
  playerID: string,
  action: SystemHandlePhaseEffectAction
): Context {
  if (ctx.gameState.phase[1] != "effect") {
    throw new Error("現在不是規定效果");
  }
  if (ctx.gameState.phase[0] == "attack") {
    if (ctx.gameState.activePlayerID != playerID) {
      throw new Error("攻擊階段的規定效果只有主動玩家能操作");
    }
  }
  if (ctx.gameState.phase[0] == "guard") {
    if (ctx.gameState.activePlayerID == playerID) {
      throw new Error("防禦階段的規定效果只有被動玩家能操作");
    }
  }
  switch (ctx.gameState.phase[0]) {
    case "damage": {
      if (ctx.gameState.activePlayerID == null) {
        throw new Error("現在要計算傷判卻沒有主動玩家: activePlayerID == null");
      }
      // 傷害計算並造成傷害
      const attackPlayerID = ctx.gameState.activePlayerID;
      const guardPlayerID = opponent(ctx, ctx.gameState.activePlayerID);
      // 速度1
      ctx = handleAttackDamage(ctx, attackPlayerID, guardPlayerID, "earth", 1);
      ctx = handleAttackDamage(
        ctx,
        attackPlayerID,
        guardPlayerID,
        "universe",
        1
      );
      // 速度2
      ctx = handleAttackDamage(ctx, attackPlayerID, guardPlayerID, "earth", 2);
      ctx = handleAttackDamage(
        ctx,
        attackPlayerID,
        guardPlayerID,
        "universe",
        2
      );
      // 速度3
      ctx = handleAttackDamage(ctx, attackPlayerID, guardPlayerID, "earth", 3);
      ctx = handleAttackDamage(
        ctx,
        attackPlayerID,
        guardPlayerID,
        "universe",
        3
      );
      // 取得破壞效果
      const destroyEffects = [
        { playerID: attackPlayerID, where: "earth" } as CardPosition,
        { playerID: attackPlayerID, where: "universe" } as CardPosition,
        { playerID: guardPlayerID, where: "earth" } as CardPosition,
        { playerID: guardPlayerID, where: "universe" } as CardPosition,
      ].flatMap((pos) => {
        const cards = ctx.gameState.table.cardStack[cardPositionID(pos)] || [];
        const effects: DestroyEffect[] = getCardState(
          ctx,
          cards.map((card) => card.id)
        )
          .filter(([cardID, card, cardState]) => {
            return cardState.destroy == true;
          })
          .map(([cardID, card, cardState]): DestroyEffect => {
            return {
              id: "DestroyEffect",
              cardID: cardID,
              reason: "battle",
              from: pos,
            };
          });
        return effects;
      });
      // 將破壞效果加入列表
      // 每個被破壞的卡必須存到列表, 一個一個將破壞效果放入堆疊中
      // 但每次只能放一個, 等到堆疊解決完, 再放入下一個
      // 所以必須要再多一個列表
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          destroyEffect: [...ctx.gameState.destroyEffect, ...destroyEffects],
        },
      };
    }
    case "return": {
      // TODO: 回到配置區
      return ctx;
    }
  }
  // 移到下個階段
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      phase: askNextPhase(ctx, ctx.gameState.phase),
    },
  };
  return ctx;
}
