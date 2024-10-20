import { Table } from "../../tool/table";
import { } from "./GameState";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { PlayerA } from "../define/PlayerID";
import { getItemBaSyou, getItemIdsByBasyou, ItemTableComponent } from "./ItemTableComponent";

export type IsBattleComponent = {
  battleSnapshot: { [key: string]: string[] }
  table: Table
} & ItemTableComponent

export function checkIsBattle(ctx: IsBattleComponent): IsBattleComponent {
  AbsoluteBaSyouFn.getBattleArea().forEach(basyou => {
    ctx = {
      ...ctx,
      battleSnapshot: {
        ...ctx.battleSnapshot,
        [AbsoluteBaSyouFn.toString(basyou)]: getItemIdsByBasyou(ctx, basyou)
      }
    }
  })
  return ctx
}

export function isBattleAtBasyou(ctx: IsBattleComponent, basyou: AbsoluteBaSyou): boolean {
  return (ctx.battleSnapshot[AbsoluteBaSyouFn.toString(basyou)] || []).length > 0
}

export function getItemIdsByBattleSnapshot(ctx: IsBattleComponent, basyou: AbsoluteBaSyou): string[] {
  return ctx.battleSnapshot[AbsoluteBaSyouFn.toString(basyou)] || []
}

export function isBattle(
  ctx: IsBattleComponent,
  cardID: string,
  cardID2: string | null
): boolean {
  const baSyou1 = getItemBaSyou(ctx, cardID);
  if (getItemIdsByBattleSnapshot(ctx, baSyou1).includes(cardID) == false) {
    return false;
  }
  const baSyou2 = AbsoluteBaSyouFn.setOpponentPlayerID(baSyou1);
  const opponentAreaIds = getItemIdsByBattleSnapshot(ctx, baSyou2)
  if (cardID2) {
    if (opponentAreaIds.includes(cardID2)) {
      return true
    }
  }
  if (opponentAreaIds.length) {
    return true
  }
  return false
  // const baSyou1 = getItemBaSyou(ctx, cardID);
  // if (ctx.isBattle[AbsoluteBaSyouFn.toString(baSyou1)] != true) {
  //   return false;
  // }
  // if (cardID2 != null) {
  //   const baSyou2 = AbsoluteBaSyouFn.setOpponentPlayerID(baSyou1);
  //   const isFindCardID2 =
  //     ctx.table.cardStack[AbsoluteBaSyouFn.toString(baSyou2)].find((cardId) => {
  //       return cardId == cardID2;
  //     }) != null;
  //   if (isFindCardID2 == false) {
  //     return false;
  //   }
  // }
  // return true;
}