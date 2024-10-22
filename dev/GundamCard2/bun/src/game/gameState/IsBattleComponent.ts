import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { getItemBaSyou, getItemIdsByBasyou, ItemTableComponent } from "./ItemTableComponent";
import { getSetGroupRoot, SetGroupComponent } from "./SetGroupComponent";
import { logCategory } from "../../tool/logger";
import { getPhase, PhaseComponent } from "./PhaseComponent";
import { EventCenterFn } from "./EventCenter";

export type IsBattleComponent = {
  hasCheck: boolean,
  battleSnapshot: { [key: string]: string[] }
} & ItemTableComponent & SetGroupComponent & PhaseComponent

export function clearHasCheck(ctx: IsBattleComponent): IsBattleComponent {
  return {
    ...ctx,
    hasCheck: false
  }
}

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
  ctx = {
    ...ctx,
    hasCheck: true
  }
  return ctx
}

export function isBattleAtBasyou(ctx: IsBattleComponent, basyou: AbsoluteBaSyou): boolean {
  const opponentBasyou = AbsoluteBaSyouFn.setOpponentPlayerID(basyou);
  const len1 = (ctx.battleSnapshot[AbsoluteBaSyouFn.toString(basyou)] || []).length
  const len2 = (ctx.battleSnapshot[AbsoluteBaSyouFn.toString(opponentBasyou)] || []).length
  return len1 > 0 && len2 > 0
}

export function getBattleGroupFromSnapshot(ctx: IsBattleComponent, basyou: AbsoluteBaSyou): string[] {
  if (ctx.hasCheck != true) {
    throw new Error("getBattleGroupFromSnapshot but not check yet")
  }
  return (ctx.battleSnapshot[AbsoluteBaSyouFn.toString(basyou)] || []).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
}

// export function getItemBasyouFromSnapshot(ctx: IsBattleComponent, itemId: string): AbsoluteBaSyou | null {
//   for (const basyou of AbsoluteBaSyouFn.getBattleArea()) {
//     if ((ctx.battleSnapshot[AbsoluteBaSyouFn.toString(basyou)] || []).find(id => itemId == id)) {
//       return basyou
//     }
//   }
//   return null
// }

export function isBattle(
  ctx: IsBattleComponent,
  cardID: string,
  cardID2: string | null
): boolean {
  const baSyou1 = getItemBaSyou(ctx, cardID);
  const baSyou1Ids = (ctx.battleSnapshot[AbsoluteBaSyouFn.toString(baSyou1)] || [])
  if (baSyou1Ids.length == 0) {
    return false
  }
  if (baSyou1Ids.includes(cardID) == false) {
    return false
  }
  const baSyou2 = AbsoluteBaSyouFn.setOpponentPlayerID(baSyou1);
  const opponentAreaIds = (ctx.battleSnapshot[AbsoluteBaSyouFn.toString(baSyou2)] || [])
  if (opponentAreaIds.length == 0) {
    return false
  }
  if (cardID2) {
    return opponentAreaIds.includes(cardID2)
  }
  return true
}