import { mapCard, moveCard, Card } from "../../tool/table";
import { Context, CardBattleWhere, AttackSpeed } from "../../tool/types";
import { cardPositionID } from "./tool";
import { askCardPower } from "./askCardPower";
import { mapCardState } from "./mapCardState";

function askAttackSpeedEnable(cards: Card[], speed: AttackSpeed) {
  if (speed == 1) {
    return true;
  }
  return false;
}

export function handleAttackDamage(
  ctx: Context,
  attackPlayerID: string,
  guardPlayerID: string,
  where: CardBattleWhere,
  speed: AttackSpeed
): Context {
  const attackUnits =
    ctx.gameState.table.cardStack[
      cardPositionID({ playerID: attackPlayerID, where: where })
    ] || [];
  const attackPower =
    attackUnits
      .map((card, i): number => {
        // 破壞的單位沒有攻擊力
        let live = 0;
        mapCardState(ctx, [card.id], (cardState) => {
          live = cardState.live;
          return cardState;
        });
        if (live == 0) {
          return 0;
        }
        // 横置的單位沒有攻擊力
        if (card.tap) {
          return 0;
        }
        const [melee, range] = askCardPower(ctx, card);
        if (i == 0) {
          return melee || 0;
        }
        return range || 0;
      })
      ?.reduce((acc, c) => acc + c, 0) || 0;
  const guardUnits =
    ctx.gameState.table.cardStack[
      cardPositionID({ playerID: guardPlayerID, where: where })
    ] || [];
  const guardPower =
    guardUnits
      .map((card, i): number => {
        // 破壞的單位沒有攻擊力
        let live = 0;
        mapCardState(ctx, [card.id], (cardState) => {
          live = cardState.live;
          return cardState;
        });
        if (live == 0) {
          return 0;
        }
        // 横置的單位沒有攻擊力
        if (card.tap) {
          return 0;
        }
        const [melee, range] = askCardPower(ctx, card);
        if (i == 0) {
          return melee || 0;
        }
        return range || 0;
      })
      ?.reduce((acc, c) => acc + c, 0) || 0;
  if (askAttackSpeedEnable(attackUnits, speed)) {
    let currentAttackPower = attackPower;
    ctx = mapCardState(
      ctx,
      guardUnits.map((unit) => unit.id),
      (cardState) => {
        if (currentAttackPower <= 0) {
          return cardState;
        }
        currentAttackPower -= cardState.live;
        if (currentAttackPower >= 0) {
          return {
            ...cardState,
            live: 0,
          };
        }
        // 剩餘血量
        const live = -currentAttackPower;
        currentAttackPower = 0;
        return {
          ...cardState,
          live: live,
        };
      }
    );
  }
  if (askAttackSpeedEnable(guardUnits, speed)) {
    let currentGuardPower = guardPower;
    ctx = mapCardState(
      ctx,
      attackUnits.map((unit) => unit.id),
      (cardState) => {
        if (currentGuardPower <= 0) {
          return cardState;
        }
        currentGuardPower -= cardState.live;
        if (currentGuardPower >= 0) {
          return {
            ...cardState,
            live: 0,
          };
        }
        // 剩餘血量
        const live = -currentGuardPower;
        currentGuardPower = 0;
        return {
          ...cardState,
          live: live,
        };
      }
    );
  }
  return ctx;
}
