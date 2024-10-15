import { lift } from "ramda";
import { BaSyouKeyword, BaSyouKeywordFn, AbsoluteBaSyouFn } from "../define/BaSyou";
import { CardCategory, CardColor, CardPrototype } from "../define/CardPrototype";
import { EntitySearchOptions, TextSpeicalEffect } from "../define/CardText";
import { DestroyReason, Effect, EffectFn } from "../define/Effect";
import { TipError } from "../define/GameError";
import { ItemState } from "../define/ItemState";
import { PlayerID, PlayerA, PlayerB, PlayerIDFn } from "../define/PlayerID";
import { Tip, StrBaSyouPair, TipFn } from "../define/Tip";
import { getBattleGroup } from "./battleGroup";
import { getCardColor, getCardGSignProperty, getCardHasSpeicalEffect, getCardTotalCostLength, getItemCharacteristic, getItemRuntimeCategory, isCardMaster } from "./card";
import { getCoinIds, getCoin, getCoinOwner } from "./CoinTableComponent";
import { createAbsoluteBaSyouFromBaSyou, createPlayerIdFromRelated } from "./createActionTitleFn";
import { getCutInDestroyEffects, getEffect, getEffects, isStackEffect } from "./EffectStackComponent";
import { GameState } from "./GameState";
import { isBattle } from "./IsBattleComponent";
import { getItemState } from "./ItemStateComponent";
import { Item, getItemIdsByBasyou, getItem, isCard, isChip, getItemController, getItemPrototype, getItemBaSyou, isCardLike } from "./ItemTableComponent";
import { getSetGroupBattlePoint, isSetGroupHasA } from "./setGroup";
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
    destroyReason: DestroyReason | null,
    prototype: CardPrototype | null
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
                    // TODO
                    destroyReason: destroyEffect?.reason[0] == "Destroy" ? destroyEffect.reason[3] : null,
                    prototype: getItemPrototype(ctx, itemId)
                }
                rets.push(entity)
            })
        })
    })
    // TODO coin換到別的地方SEARCH好了
    // getCoinIds(ctx).map(coinId => {
    //     const coin = getCoin(ctx, coinId)
    //     const entity: Entity = {
    //         itemController: getCoinOwner(ctx, coin.id),
    //         itemId: coin.id,
    //         itemState: getItemState(ctx, coin.id),
    //         item: coin,
    //         isCard: false,
    //         isCoin: true,
    //         isChip: false,
    //         baSyouKeyword: null,
    //         destroyReason: null,
    //         prototype: null
    //     }
    //     rets.push(entity)
    // })
    return rets
}

export function createTipByEntitySearch(ctx: GameState, cardId: string, options: EntitySearchOptions): Tip {
    let entityList = createEntityIterator(ctx)
    if (options.isBattle != null) {
        entityList = entityList.filter(EntityFn.filterIsBattle(ctx, null, options.isBattle))
    }
    if (options.isBattleWithThis != null) {
        entityList = entityList.filter(EntityFn.filterIsBattle(ctx, cardId, options.isBattleWithThis))
    }
    const cheatCardIds: string[] = []
    if (options.isThisCard != null) {
        entityList = entityList.filter(entity => (entity.itemId == cardId) == options.isThisCard)
    }
    if (options.isBattleGroupFirst) {
        const basyou = getItemBaSyou(ctx, cardId)
        if (basyou.value[1] == "戦闘エリア1" || basyou.value[1] == "戦闘エリア2") {
            // 各戰區的第一隻
            const ids = lift(AbsoluteBaSyouFn.of)(PlayerIDFn.getAll(), ["戦闘エリア1", "戦闘エリア2"]).flatMap(basyou => {
                return getItemIdsByBasyou(ctx, basyou).slice(0, 1)
            })
            entityList = entityList.filter(entity => ids.includes(entity.itemId))
        } else {
            // 如果沒在戰區無法組成部隊
            entityList = []
        }
    }
    if (options.isThisSetGroup != null) {
        const setGroupIds = getSetGroup(ctx, cardId)
        entityList = entityList.filter(entity => setGroupIds.includes(entity.itemId) == options.isThisSetGroup)
    }
    if (options.isThisBattleGroup != null) {
        const basyou = getItemBaSyou(ctx, cardId)
        if (basyou.value[1] == "戦闘エリア1" || basyou.value[1] == "戦闘エリア2") {
            const battleGroupIds = getBattleGroup(ctx, getItemBaSyou(ctx, cardId))
            entityList = entityList.filter(entity => battleGroupIds.includes(entity.itemId) == options.isThisBattleGroup)
        } else {
            // 如果沒在戰區無法組成部隊
            entityList = []
        }
    }
    if (options.hasSelfCardId != null) {
        const absoluteBasyou = getItemBaSyou(ctx, cardId)
        entityList = entityList.filter(entity => (entity.itemController == absoluteBasyou.value[0] && entity.baSyouKeyword == absoluteBasyou.value[1]) == options.hasSelfCardId)
    }
    if (options.see) {
        const [basyou, min, max] = options.see
        const absoluteBasyou = createAbsoluteBaSyouFromBaSyou(ctx, cardId, basyou)
        entityList = entityList.filter(EntityFn.filterController(AbsoluteBaSyouFn.getPlayerID(absoluteBasyou)))
        entityList = entityList.filter(EntityFn.filterAtBaSyous([AbsoluteBaSyouFn.getBaSyouKeyword(absoluteBasyou)]))
        if (entityList.length < min) {
            // const tip: Tip = {
            //     title: ["カード", [], []],
            //     min: min
            // }
            // return tip
            throw new TipError(`must at least ${min} for see`)
        }
        cheatCardIds.push(...entityList.map(e => e.itemId).slice(0, max))
        entityList = entityList.slice(0, max)
    }
    if (options.isCanSetCharacter != null) {
        entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx, true)).filter(EntityFn.filterCanSetCharacter(ctx))
    } else if (options.isSetGroup != null) {
        entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx, options.isSetGroup))
    }
    if (options.compareBattlePoint) {
        //entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx, true))
        const [kw, op, value] = options.compareBattlePoint
        entityList = entityList.filter(entity => {
            switch (kw) {
                case "攻撃力": {
                    const [atk, range, hp] = getSetGroupBattlePoint(ctx, entity.itemId)
                    switch (op) {
                        case "<=":
                            return atk <= value
                        case ">=":
                            return atk >= value
                        case "==":
                            return atk == value
                    }
                }
                case "防御力": {
                    const [atk, range, hp] = getSetGroupBattlePoint(ctx, entity.itemId)
                    switch (op) {
                        case "<=":
                            return hp <= value
                        case ">=":
                            return hp >= value
                        case "==":
                            return hp == value
                    }
                }
                case "合計国力": {
                    const totalCost = getCardTotalCostLength(ctx, entity.itemId)
                    switch (op) {
                        case "<=":
                            return totalCost <= value
                        case ">=":
                            return totalCost >= value
                        case "==":
                            return totalCost == value
                    }
                }
            }
            return false
        })
    }
    if (options.isMaster != null) {
        entityList = entityList.filter(entity => isCardMaster(ctx, getSetGroupRoot(ctx, entity.itemId), entity.itemId))
    }
    if (options.title) {
        entityList = entityList.filter(entity => options.title?.includes(entity.prototype?.title || ""))
    }
    if (options.at?.length) {
        entityList = entityList.filter(EntityFn.filterAtBaSyous(options.at))
    }
    if (options.atBa != null) {
        entityList = entityList.filter(EntityFn.filterAtBaSyous(BaSyouKeywordFn.getBaAll()))
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
    if (options.hasGSignProperty) {
        if (options.hasGSignProperty.length == 0) {
            options.hasGSignProperty.push(getCardGSignProperty(ctx, cardId))
        }
        entityList = entityList.filter(entity => isCardLike(ctx)(entity.itemId) && options.hasGSignProperty?.includes(getCardGSignProperty(ctx, entity.itemId)))
    }
    if (options.hasDamage) {
        entityList = entityList.filter(entity => entity.itemState.damage > 0 && entity.itemState.destroyReason == null)
    }
    if (options.exceptCardIds?.length) {
        entityList = entityList.filter(entity => options.exceptCardIds?.includes(entity.itemId) != true)
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
    } else if (options.count != null) {
        tipPairs = tipPairs.slice(0, options.count)
    }
    if (options.isRepeat) {
        if (options.count == null) {
            throw new Error()
        }
        if (tipPairs.length > 0) {
            while (tipPairs.length < options.count) {
                tipPairs = [...tipPairs, ...tipPairs]
            }
            tipPairs = tipPairs.slice(0, options.count)
        }
    }
    const tip: Tip = {
        title: ["カード", pairs, tipPairs],
        isRepeat: options.isRepeat,
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
    if (cheatCardIds.length) {
        tip.cheatCardIds = cheatCardIds
    }
    if (options.asMuchAsPossible) {
        if (options.max == null) {
            throw new Error()
        }
        tip.min = Math.min(pairs.length, options.max)
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
            return (entity.destroyReason != null && entity.destroyReason.id != "マイナスの戦闘修正") == v
        }
    },
    filterIsBattle(ctx: GameState, targetId: string | null, v: boolean) {
        return (entity: Entity) => {
            if (isCardLike(ctx)(entity.itemId) == false) {
                return false
            }
            return isBattle(ctx, entity.itemId, targetId) == v
        }
    },
    filterRuntimeCategory(ctx: GameState, category: CardCategory[]) {
        return (entity: Entity) => {
            if (isCardLike(ctx)(entity.itemId) == false) {
                return false
            }
            return category.includes(getItemRuntimeCategory(ctx, entity.itemId))
        }
    },
    filterCategory(ctx: GameState, category: CardCategory[]) {
        return (entity: Entity) => {
            if (isCardLike(ctx)(entity.itemId) == false) {
                return false
            }
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
            if (isCardLike(ctx)(entity.itemId) == false) {
                return false
            }
            return color.includes(getCardColor(ctx, entity.itemId))
        }
    },
    filterIsSetGroupRoot(ctx: GameState, v: boolean) {
        return (entity: Entity) => {
            if (isCardLike(ctx)(entity.itemId) == false) {
                return false
            }
            return (getSetGroupRoot(ctx, entity.itemId) == entity.itemId) == v
        }
    },
    filterCanSetCharacter(ctx: GameState) {
        return (entity: Entity) => {
            if (isCardLike(ctx)(entity.itemId) == false) {
                return false
            }
            // 有些機體可以設置2個駕駛
            const charLen = getSetGroup(ctx, entity.itemId).filter(itemId => getItemRuntimeCategory(ctx, itemId) == "キャラクター").length
            return charLen == 0
        }
    },
    filterHasSetCard(ctx: GameState, v: boolean) {
        return (entity: Entity) => {
            if (isCardLike(ctx)(entity.itemId) == false) {
                return false
            }
            return (getSetGroup(ctx, entity.itemId).length > 1) == v
        }
    },
    filterHasSpecialEffect(ctx: GameState, vs: TextSpeicalEffect[]) {
        return (entity: Entity) => {
            if (isCardLike(ctx)(entity.itemId) == false) {
                return false
            }
            return vs.some(v => isSetGroupHasA(ctx, v, entity.itemId))
        }
    },
    filterHasChar(ctx: GameState, vs: string[]) {
        return (entity: Entity) => {
            if (isCardLike(ctx)(entity.itemId) == false) {
                return false
            }
            return vs.some(v => getItemCharacteristic(ctx, entity.itemId).indexOf(v) != -1)
        }
    },
    filterDistinct(cet: Entity, index: number, self: Entity[]): boolean {
        return index === self.findIndex(c => c.itemId === cet.itemId)
    },
}