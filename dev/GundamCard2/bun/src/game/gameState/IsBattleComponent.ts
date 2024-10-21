import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { getItemBaSyou, getItemIdsByBasyou, ItemTableComponent } from "./ItemTableComponent";
import { getSetGroupRoot, SetGroupComponent } from "./SetGroupComponent";
import { logCategory } from "../../tool/logger";
import { getPhase, PhaseComponent } from "./PhaseComponent";
import { EventCenterFn } from "./EventCenter";

export type IsBattleComponent = {
  battleSnapshot: { [key: string]: string[] }
} & ItemTableComponent & SetGroupComponent & PhaseComponent

export function checkIsBattle(ctx: IsBattleComponent): IsBattleComponent {
  logCategory("checkIsBattle", getPhase(ctx))
  AbsoluteBaSyouFn.getBattleArea().forEach(basyou => {
    const originState = isBattleAtBasyou(ctx, basyou)
    ctx = {
      ...ctx,
      battleSnapshot: {
        ...ctx.battleSnapshot,
        [AbsoluteBaSyouFn.toString(basyou)]: getItemIdsByBasyou(ctx, basyou)
      }
    }
    const newState = isBattleAtBasyou(ctx, basyou)
    if (originState != newState) {
      ctx = EventCenterFn.onIsBattleChange(ctx, basyou, originState, newState)
    }
  })
  return ctx
}

export function isBattleAtBasyou(ctx: IsBattleComponent, basyou: AbsoluteBaSyou): boolean {
  const opponentBasyou = AbsoluteBaSyouFn.setOpponentPlayerID(basyou);
  return getBattleGroupFromSnapshot(ctx, basyou).length + getBattleGroupFromSnapshot(ctx, opponentBasyou).length > 0
}

export function getBattleGroupFromSnapshot(ctx: IsBattleComponent, basyou: AbsoluteBaSyou): string[] {
  return (ctx.battleSnapshot[AbsoluteBaSyouFn.toString(basyou)] || []).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
}

export function getItemBasyouFromSnapshot(ctx: IsBattleComponent, itemId: string): AbsoluteBaSyou | null {
  for (const basyou of AbsoluteBaSyouFn.getBattleArea()) {
    if ((ctx.battleSnapshot[AbsoluteBaSyouFn.toString(basyou)] || []).find(id => itemId == id)) {
      return basyou
    }
  }
  return null
}

export function isBattle(
  ctx: IsBattleComponent,
  cardID: string,
  cardID2: string | null
): boolean {
  const baSyou1 = getItemBaSyou(ctx, cardID);
  if (getBattleGroupFromSnapshot(ctx, baSyou1).includes(cardID) == false) {
    return false;
  }
  const baSyou2 = AbsoluteBaSyouFn.setOpponentPlayerID(baSyou1);
  const opponentAreaIds = getBattleGroupFromSnapshot(ctx, baSyou2)
  if (cardID2) {
    if (opponentAreaIds.includes(cardID2)) {
      return true
    }
  }
  if (opponentAreaIds.length) {
    return true
  }
  return false
}