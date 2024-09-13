import {
  getCardBaSyou,
  CardTableComponent,
} from "./CardTableComponent"
import { Table } from "../../tool/table";
import { } from "./GameState";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { PlayerA } from "../define/PlayerID";

export type IsBattleComponent = {
  // 是否交戰中，key代表牌堆名稱的字串
  isBattle: { [key: string]: boolean }
  table: Table
} & CardTableComponent

export function checkIsBattle(ctx: IsBattleComponent): IsBattleComponent {
  const battleAreas: AbsoluteBaSyou[] = [
    AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"),
    AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"),
  ];
  return battleAreas.reduce((ctx, battleArea) => {
    const baSyouID1 = AbsoluteBaSyouFn.toString(battleArea);
    const baSyouID2 = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.setOpponentPlayerID(battleArea));
    if (
      ctx.table.cardStack[baSyouID1]?.length &&
      ctx.table.cardStack[baSyouID2]?.length
    ) {
      return {
        ...ctx,
        isBattle: {
          ...ctx.isBattle,
          [baSyouID1]: true,
          [baSyouID2]: true,
        },
      };
    }
    return {
      ...ctx,
      isBattle: {
        ...ctx.isBattle,
        [baSyouID1]: false,
        [baSyouID2]: false,
      }
    };
  }, ctx);
}

export function isBattle(
  ctx: IsBattleComponent,
  cardID: string,
  cardID2: string | null
): boolean {
  const baSyou1 = getCardBaSyou(ctx, cardID);
  if (ctx.isBattle[AbsoluteBaSyouFn.toString(baSyou1)] != true) {
    return false;
  }
  if (cardID2 != null) {
    const baSyou2 = AbsoluteBaSyouFn.setOpponentPlayerID(baSyou1);
    const isFindCardID2 =
      ctx.table.cardStack[AbsoluteBaSyouFn.toString(baSyou2)].find((cardId) => {
        return cardId == cardID2;
      }) != null;
    if (isFindCardID2 == false) {
      return false;
    }
  }
  return true;
}