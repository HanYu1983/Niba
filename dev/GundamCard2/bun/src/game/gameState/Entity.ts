import { BaSyouKeyword, BaSyouKeywordFn, AbsoluteBaSyouFn } from "../define/BaSyou";
import { CardCategory, CardColor } from "../define/CardPrototype";
import { EntitySearchOptions, TextSpeicalEffect } from "../define/CardText";
import { DestroyReason, Effect, EffectFn } from "../define/Effect";
import { ItemState } from "../define/ItemState";
import { PlayerID, PlayerA, PlayerB, PlayerIDFn } from "../define/PlayerID";
import { Tip, StrBaSyouPair } from "../define/Tip";
import { getCardColor, getCardHasSpeicalEffect, getItemCharacteristic, getItemRuntimeCategory } from "./card";
import { getCoinIds, getCoin, getCoinOwner } from "./CoinTableComponent";
import { getCutInDestroyEffects, getEffect, getEffects, isStackEffect } from "./EffectStackComponent";
import { GameState } from "./GameState";
import { isBattle } from "./IsBattleComponent";
import { getItemState } from "./ItemStateComponent";
import { Item, getItemIdsByBasyou, getItem, isCard, isChip, getItemController, getItemPrototype } from "./ItemTableComponent";
import { isSetGroupHasA } from "./setGroup";
import { getSetGroup, getSetGroupRoot } from "./SetGroupComponent";

export type Entity = {
    itemController: PlayerID,
    itemId: string,
    itemState: ItemState,
    item: Item,
    isChip: boolean,
    isCoin: boolean,
    isCard: boolean,
    baSyouKeyword: BaSyouKeyword | null,
    destroyReason: DestroyReason | null
}

export function createEntityIterator(ctx: GameState) {
    const destroyEffects = getCutInDestroyEffects(ctx)
    const rets: Entity[] = [];
    [PlayerA, PlayerB].map(playerId => {
        BaSyouKeywordFn.getAll().map(basyouKw => {
            const basyou = AbsoluteBaSyouFn.of(playerId, basyouKw)
            getItemIdsByBasyou(ctx, basyou).map(itemId => {
                const item = getItem(ctx, itemId)
                const destroyEffect = destroyEffects.find(e => EffectFn.getCardID(e) == itemId)
                const entity: Entity = {
                    itemController: playerId,
                    itemId: itemId,
                    itemState: getItemState(ctx, itemId),
                    item: item,
                    isCard: isCard(ctx, item.id),
                    isCoin: false,
                    isChip: isChip(ctx, item.id),
                    baSyouKeyword: basyouKw,
                    destroyReason: destroyEffect?.reason[0] == "Destroy" ? destroyEffect.reason[3] : null
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
            itemState: getItemState(ctx, coin.id),
            item: coin,
            isCard: false,
            isCoin: true,
            isChip: false,
            baSyouKeyword: null,
            destroyReason: null
        }
        rets.push(entity)
    })
    return rets
}

export function createTipByEntitySearch(ctx: GameState, cardId: string, options: EntitySearchOptions): Tip {
    let entityList = createEntityIterator(ctx).filter(EntityFn.filterIsBattle(ctx, null, options.isBattle || false))
    if (options.isCanSetCharacter != null) {
        entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx, true)).filter(EntityFn.filterCanSetCharacter(ctx))
    } else if (options.is?.includes("ユニット")) {
        entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx, true))
    } else if (options.isSetGroup != null) {
        entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx, options.isSetGroup))
    }
    if (options.at?.length) {
        entityList = entityList.filter(EntityFn.filterAtBaSyous(options.at))
    }
    if (options.side) {
        const cardController = getItemController(ctx, cardId)
        const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(options.side || "自軍", cardController)
        entityList = entityList.filter(EntityFn.filterController(playerId))
    }
    if (options.is?.length) {
        entityList = entityList.filter(EntityFn.filterRuntimeCategory(ctx, options.is))
    }
    if (options.cardCategory?.length) {
        entityList = entityList.filter(EntityFn.filterCategory(ctx, options.cardCategory))
    }
    if (options.color?.length) {
        entityList = entityList.filter(EntityFn.filterItemColor(ctx, options.color))
    }
    if (options.hasSetCard != null) {
        entityList = entityList.filter(EntityFn.filterHasSetCard(ctx, options.hasSetCard))
    }
    if (options.isDestroy != null) {
        entityList = entityList.filter(EntityFn.filterIsDestroy(options.isDestroy))
    }
    if (options.hasSpecialEffect != null) {
        entityList = entityList.filter(EntityFn.filterHasSpecialEffect(ctx, options.hasSpecialEffect))
    }
    if (options.hasChar != null) {
        entityList = entityList.filter(EntityFn.filterHasChar(ctx, options.hasChar))
    }
    entityList = entityList.filter(EntityFn.filterDistinct)
    const pairs = entityList.map(entity => {
        if (entity.baSyouKeyword == null) {
            throw new Error()
        }
        return [entity.itemId, AbsoluteBaSyouFn.of(entity.itemController, entity.baSyouKeyword)] as StrBaSyouPair
    })
    let tipPairs = pairs
    if (options.max != null) {
        tipPairs = tipPairs.slice(0, options.max)
    } else if (options.min != null) {
        tipPairs = tipPairs.slice(0, options.min)
    }
    const tip: Tip = {
        title: ["カード", pairs, tipPairs]
    }
    if (options.min != null) {
        tip.min = options.min
    }
    if (options.max != null) {
        tip.max = options.max
    }
    if (options.count != null) {
        tip.count = options.count
    }
    return tip
}

export const EntityFn = {
    filterAtBaSyous(kws: BaSyouKeyword[]) {
        return (entity: Entity) => {
            if (entity.baSyouKeyword == null) {
                return false
            }
            return kws.includes(entity.baSyouKeyword)
        }
    },
    filterAtBattleArea(v: boolean) {
        return (entity: Entity) => {
            return (entity.baSyouKeyword == "戦闘エリア1" || entity.baSyouKeyword == "戦闘エリア2") == v
        }
    },
    filterAtBa(v: boolean) {
        return (entity: Entity) => {
            if (entity.baSyouKeyword == null) {
                return false
            }
            return BaSyouKeywordFn.isBa(entity.baSyouKeyword) == v
        }
    },
    filterController(playerId: PlayerID) {
        return (entity: Entity) => {
            return entity.itemController == playerId
        }
    },
    filterIsDestroy(v: boolean) {
        return (entity: Entity) => {
            return (entity.destroyReason != null) == v
        }
    },
    filterIsBattle(ctx: GameState, targetId: string | null, v: boolean) {
        return (entity: Entity) => {
            return isBattle(ctx, entity.itemId, targetId) == v
        }
    },
    filterRuntimeCategory(ctx: GameState, category: CardCategory[]) {
        return (entity: Entity) => {
            return category.includes(getItemRuntimeCategory(ctx, entity.itemId))
        }
    },
    filterCategory(ctx: GameState, category: CardCategory[]) {
        return (entity: Entity) => {
            const targetCate = getItemPrototype(ctx, entity.itemId).category
            if (targetCate == null) {
                return false
            }
            return category.includes(targetCate)
        }
    },
    filterItemController(ctx: GameState, playerId: string) {
        return (entity: Entity) => {
            return getItemController(ctx, entity.itemId) == playerId
        }
    },
    filterItemColor(ctx: GameState, color: CardColor[]) {
        return (entity: Entity) => {
            return color.includes(getCardColor(ctx, entity.itemId))
        }
    },
    filterIsSetGroupRoot(ctx: GameState, v: boolean) {
        return (entity: Entity) => {
            return (getSetGroupRoot(ctx, entity.itemId) == entity.itemId) == v
        }
    },
    filterCanSetCharacter(ctx: GameState) {
        return (entity: Entity) => {
            // 有些機體可以設置2個駕駛
            const charLen = getSetGroup(ctx, entity.itemId).filter(itemId => getItemRuntimeCategory(ctx, itemId) == "キャラクター").length
            return charLen == 0
        }
    },
    filterHasSetCard(ctx: GameState, v: boolean) {
        return (entity: Entity) => {
            return (getSetGroup(ctx, entity.itemId).length == 1) == v
        }
    },
    filterHasSpecialEffect(ctx: GameState, vs: TextSpeicalEffect[]) {
        return (entity: Entity) => {
            return vs.some(v => isSetGroupHasA(ctx, v, entity.itemId))
        }
    },
    filterHasChar(ctx: GameState, vs: string[]) {
        return (entity: Entity) => {
            return vs.some(v => getItemCharacteristic(ctx, entity.itemId).indexOf(v) != -1)
        }
    },
    filterDistinct(cet: Entity, index: number, self: Entity[]): boolean {
        return index === self.findIndex(c => c.itemId === cet.itemId)
    },
}