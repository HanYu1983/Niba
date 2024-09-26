import { BaSyouKeyword, BaSyouKeywordFn, AbsoluteBaSyouFn } from "../define/BaSyou";
import { PlayerID, PlayerA, PlayerB } from "../define/PlayerID";
import { getCoinIds, getCoin, getCoinOwner } from "./CoinTableComponent";
import { GameState } from "./GameState";
import { Item, getItemIdsByBasyou, getItem, isCard, isChip } from "./ItemTableComponent";

export type Entity = {
    itemController: PlayerID,
    itemId: string,
    item: Item,
    isChip: boolean,
    isCoin: boolean,
    isCard: boolean,
    baSyouKeyword: BaSyouKeyword | null,
}

export function createEntityIterator(ctx: GameState) {
    const rets: Entity[] = [];
    [PlayerA, PlayerB].map(playerId => {
        BaSyouKeywordFn.getAll().map(basyouKw => {
            const basyou = AbsoluteBaSyouFn.of(playerId, basyouKw)
            getItemIdsByBasyou(ctx, basyou).map(itemId => {
                const item = getItem(ctx, itemId)
                const entity: Entity = {
                    itemController: playerId,
                    itemId: itemId,
                    item: item,
                    isCard: isCard(ctx, item.id),
                    isCoin: false,
                    isChip: isChip(ctx, item.id),
                    baSyouKeyword: basyouKw
                }
                rets.push(entity)
            })
        })
    })
    getCoinIds(ctx).map(coinId => {
        const coin = getCoin(ctx, coinId)
        const entity: Entity = {
            itemController: getCoinOwner(ctx, coin.id),
            itemId: coin.id,
            item: coin,
            isCard: false,
            isCoin: true,
            isChip: false,
            baSyouKeyword: null
        }
        rets.push(entity)
    })
    return rets
}

export const EntityFn = {
    filterAtBaSyou(ctx: GameState, kw: BaSyouKeyword) {
        return (ctx: Entity) => {
            return ctx.baSyouKeyword == kw
        }
    },
    filterController(playerId: PlayerID) {
        return (ctx: Entity) => {
            return ctx.itemController == playerId
        }
    }
}