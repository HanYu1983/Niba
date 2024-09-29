import { always, assoc, fromPairs, map, pipe, toPairs } from "ramda";
import { CardTableComponent } from "./CardTableComponent";
import { Coin } from "../define/Coin";
import { PlayerID } from "../define/PlayerID";

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

export function getCardIdByCoinId(ctx: CoinTableComponent, id: string): string {
  if(ctx.coinId2cardId[id] == null){
    throw new Error(`coin cardId not found: ${id}`)
  }
  return ctx.coinId2cardId[id]
}

export function getCoinIdsByCardId(ctx: CoinTableComponent, cardId: string): string[] {
  return Object.keys(ctx.coinId2cardId).filter(coinId => ctx.coinId2cardId[coinId] == cardId)
}

export function getCoinOwner(ctx: CoinTableComponent, id: string): PlayerID {
  const item = getCoin(ctx, id);
  if (item.ownerID == null) {
    throw new Error("[getChipOwner] Coin.ownerID not found");
  }
  return item.ownerID;
}