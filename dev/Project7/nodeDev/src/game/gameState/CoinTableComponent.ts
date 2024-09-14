import { always, assoc, fromPairs, map, pipe, toPairs } from "ramda";
import { PlayerID } from "../define/PlayerID";
import { BattleBonus } from "../define/Text";
import { CardTableComponent, getCardBaSyou } from "./CardTableComponent";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { TargetMissingError } from "../define/GameError";
import { ToolFn } from "../tool";
import { Coin } from "../define/Coin";

export type CoinTableComponent = {
  coins: { [key: string]: Coin },
  coinId2cardId: { [key: string]: string },
} & CardTableComponent

export function getCoin(ctx: CoinTableComponent, id: string): Coin {
  if (ctx.coins[id] == null) {
    throw new Error("card not found")
  }
  return ctx.coins[id];
}

export function getCoinIds(ctx: CoinTableComponent): string[] {
  return Object.keys(ctx.coins);
}

export function getCoins(ctx: CoinTableComponent): Coin[] {
  return Object.values(ctx.coins)
}

export function addCoins(ctx: CoinTableComponent, cardId: string, added: Coin[]): CoinTableComponent {
  return {
    ...ctx,
    coins: {
      ...ctx.coins,
      ...fromPairs(added.map(v => ([v.id, v])))
    },
    coinId2cardId: {
      ...ctx.coinId2cardId,
      ...fromPairs(added.map(v => ([v.id, cardId])))
    }
  }
}

// export function getCoinController(ctx: CoinTableComponent, id: string): PlayerID {
//   return getCoin(ctx, id).ownerID
// }

// export function getCoinOwner(ctx: CoinTableComponent, id: string): PlayerID {
//   return getCoin(ctx, id).ownerID
// }