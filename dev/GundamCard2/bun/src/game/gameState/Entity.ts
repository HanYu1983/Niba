import { lift } from "ramda";
import { BaSyouKeyword, BaSyouKeywordFn, AbsoluteBaSyouFn } from "../define/BaSyou";
import { CardCategory, CardColor, CardPrototype, GSignFn } from "../define/CardPrototype";
import { EntitySearchOptions, TextSpeicalEffect } from "../define/CardText";
import { DestroyReason, Effect, EffectFn } from "../define/Effect";
import { TipError } from "../define/GameError";
import { ItemState } from "../define/ItemState";
import { PlayerID, PlayerA, PlayerB, PlayerIDFn } from "../define/PlayerID";
import { Tip, StrBaSyouPair, TipFn } from "../define/Tip";
import { getBattleGroup } from "./battleGroup";
import { getCardColor, getItemGSign, getCardGSignProperty, getCardHasSpeicalEffect, getCardTotalCostLength, getItemCharacteristic, getItemRuntimeCategory, isCardMaster } from "./card";
import { getCoinIds, getCoin, getCoinOwner } from "./CoinTableComponent";
import { createAbsoluteBaSyouFromBaSyou, createPlayerIdFromRelated } from "./createActionTitleFn";
import { getCutInDestroyEffects, getEffect, getEffects, isStackEffect } from "./EffectStackComponent";
import { GameState } from "./GameState";
import { isBattle } from "./IsBattleComponent";
import { getItemState } from "./ItemStateComponent";
import { Item, getItemIdsByBasyou, getItem, isCard, isChip, getItemController, getItemPrototype, getItemBaSyou, isCardLike } from "./ItemTableComponent";
import { getSetGroupBattlePoint, isSetGroupHasA } from "./setGroup";
import { getSetGroup, getSetGroupRoot } from "./SetGroupComponent";
import { getCard } from "./CardTableComponent";
import { getChip } from "./ChipTableComponent";
import { getGlobalEffects } from "./globalEffects";
import { GlobalEffect } from "../define/GlobalEffect";
import { getPrototype } from "../../script";

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

export function createTipByEntitySearch(ctx: GameState, effect: Effect, searchOptions: EntitySearchOptions, options: { ges?: GlobalEffect[] }): Tip {
    const cardId = EffectFn.getCardID(effect)
    const prototype = getItemPrototype(ctx, cardId)
    let entityList = createEntityIterator(ctx)
    {
        const opponentEffectNotTargetIds = options?.ges?.filter(ge => ge.title[0] == "敵軍効果の対象にならない").flatMap(ge => ge.cardIds) || []
        if (opponentEffectNotTargetIds.length) {
            const effectController = EffectFn.getPlayerID(effect)
            entityList = entityList.filter(entity => {
                return getItemController(ctx, entity.itemId) == effectController
            })
        }
    }
    {
        if (getItemRuntimeCategory(ctx, cardId) == "ユニット") {
            const opponentUnitEffectNotTargetIds = options?.ges?.filter(ge => ge.title[0] == "敵軍ユニットの効果の対象にならない").flatMap(ge => ge.cardIds) || []
            if (opponentUnitEffectNotTargetIds.length) {
                const effectController = EffectFn.getPlayerID(effect)
                entityList = entityList.filter(entity => {
                    return getItemController(ctx, entity.itemId) == effectController
                })
            }
        }
    }
    if (searchOptions.isBattle != null) {
        entityList = entityList.filter(EntityFn.filterIsBattle(ctx, null, searchOptions.isBattle))
    }
    if (searchOptions.isBattleWithThis != null) {
        entityList = entityList.filter(EntityFn.filterIsBattle(ctx, cardId, searchOptions.isBattleWithThis))
    }
    const cheatCardIds: string[] = []
    if (searchOptions.isThisCard != null) {
        entityList = entityList.filter(entity => (entity.itemId == cardId) == searchOptions.isThisCard)
    }
    if (searchOptions.isBattleGroupFirst) {
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
    if (searchOptions.isThisSetGroup != null) {
        const setGroupIds = getSetGroup(ctx, cardId)
        entityList = entityList.filter(entity => setGroupIds.includes(entity.itemId) == searchOptions.isThisSetGroup)
    }
    if (searchOptions.isThisBattleGroup != null) {
        const basyou = getItemBaSyou(ctx, cardId)
        if (basyou.value[1] == "戦闘エリア1" || basyou.value[1] == "戦闘エリア2") {
            const battleGroupIds = getBattleGroup(ctx, getItemBaSyou(ctx, cardId))
            entityList = entityList.filter(entity => battleGroupIds.includes(entity.itemId) == searchOptions.isThisBattleGroup)
        } else {
            // 如果沒在戰區無法組成部隊
            entityList = []
        }
    }
    if (searchOptions.hasSelfCardId != null) {
        const absoluteBasyou = getItemBaSyou(ctx, cardId)
        entityList = entityList.filter(entity => (entity.itemController == absoluteBasyou.value[0] && entity.baSyouKeyword == absoluteBasyou.value[1]) == searchOptions.hasSelfCardId)
    }
    if (searchOptions.see) {
        const [basyou, min, max] = searchOptions.see
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
    if (searchOptions.isCanSetCharacter != null) {
        entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx, true)).filter(EntityFn.filterCanSetCharacter(ctx))
    } else if (searchOptions.isSetGroup != null) {
        entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx, searchOptions.isSetGroup))
    }
    if (searchOptions.compareBattlePoint) {
        //entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx, true))
        const [kw, op, value] = searchOptions.compareBattlePoint
        entityList = entityList.filter(entity => {
            switch (kw) {
                case "攻撃力": {
                    const [atk, range, hp] = getSetGroupBattlePoint(ctx, entity.itemId, { ges: options?.ges })
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
                    const [atk, range, hp] = getSetGroupBattlePoint(ctx, entity.itemId, { ges: options?.ges })
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
                    const totalCost = getCardTotalCostLength(ctx, entity.itemId, { ges: options?.ges })
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
    if (searchOptions.isMaster != null) {
        entityList = entityList.filter(entity => getItemRuntimeCategory(ctx, entity.itemId) == "キャラクター" && isCardMaster(ctx, getSetGroupRoot(ctx, entity.itemId), entity.itemId) == searchOptions.isMaster)
    }
    if (searchOptions.title) {
        entityList = entityList.filter(entity => searchOptions.title?.includes(entity.prototype?.title || ""))
    }
    if (searchOptions.at?.length) {
        entityList = entityList.filter(EntityFn.filterAtBaSyous(searchOptions.at))
    }
    if (searchOptions.atBa != null) {
        entityList = entityList.filter(EntityFn.filterAtBaSyous(BaSyouKeywordFn.getBaAll()))
    }
    if (searchOptions.side) {
        const cardController = getItemController(ctx, cardId)
        const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(searchOptions.side || "自軍", cardController)
        entityList = entityList.filter(EntityFn.filterController(playerId))
    }
    if (searchOptions.is?.length) {
        entityList = entityList.filter(EntityFn.filterRuntimeCategory(ctx, searchOptions.is))
    }
    if (searchOptions.cardCategory?.length) {
        entityList = entityList.filter(EntityFn.filterCategory(ctx, searchOptions.cardCategory))
    }
    if (searchOptions.color?.length) {
        entityList = entityList.filter(EntityFn.filterItemColor(ctx, searchOptions.color))
    }
    if (searchOptions.hasSetCard != null) {
        entityList = entityList.filter(EntityFn.filterHasSetCard(ctx, searchOptions.hasSetCard))
    }
    if (searchOptions.hasTitle) {
        if (searchOptions.hasTitle.length == 0) {
            searchOptions.hasTitle.push(prototype.title || "unknown")
        }
        entityList = entityList.filter(entity => searchOptions.hasTitle?.includes(getItemPrototype(ctx, entity.itemId).title || ""))
    }
    if (searchOptions.isDestroy != null) {
        entityList = entityList.filter(EntityFn.filterIsDestroy(searchOptions.isDestroy))
    }
    if (searchOptions.isRoll != null) {
        entityList = entityList.filter(entity =>
            (entity.isCard
                && !!(getCard(ctx, entity.itemId).isRoll) == searchOptions.isRoll)
            || (entity.isChip
                && !!(getChip(ctx, entity.itemId).isRoll) == searchOptions.isRoll))
    }
    if (searchOptions.hasSpecialEffect != null) {
        entityList = entityList.filter(EntityFn.filterHasSpecialEffect(ctx, searchOptions.hasSpecialEffect))
    }
    if (searchOptions.hasChar != null) {
        entityList = entityList.filter(EntityFn.filterHasChar(ctx, searchOptions.hasChar))
    }
    if (searchOptions.hasGSign) {
        if (searchOptions.hasGSign.length == 0) {
            searchOptions.hasGSign.push(getItemGSign(ctx, cardId))
        }
        entityList = entityList.filter(entity => isCardLike(ctx)(entity.itemId) && searchOptions.hasGSign?.some(v => GSignFn.eq(v, getItemGSign(ctx, entity.itemId))))
    }
    if (searchOptions.hasGSignProperty) {
        if (searchOptions.hasGSignProperty.length == 0) {
            searchOptions.hasGSignProperty.push(getCardGSignProperty(ctx, cardId))
        }
        entityList = entityList.filter(entity => isCardLike(ctx)(entity.itemId) && searchOptions.hasGSignProperty?.includes(getCardGSignProperty(ctx, entity.itemId)))
    }
    if (searchOptions.hasDamage) {
        entityList = entityList.filter(entity => entity.itemState.damage > 0 && entity.itemState.destroyReason == null)
    }
    if (searchOptions.hasRollCostColor) {
        entityList = entityList.filter(entity => {
            if (entity.prototype?.rollCost == "X") {
                return searchOptions.hasRollCostColor?.some(color => color == entity.prototype?.color)
            }
            return searchOptions.hasRollCostColor?.some(color => color == entity.prototype?.color)
        })
    }
    if (searchOptions.exceptCardIds?.length) {
        entityList = entityList.filter(entity => searchOptions.exceptCardIds?.includes(entity.itemId) != true)
    }
    entityList = entityList.filter(EntityFn.filterDistinct)
    const pairs = entityList.map(entity => {
        if (entity.baSyouKeyword == null) {
            throw new Error()
        }
        return [entity.itemId, AbsoluteBaSyouFn.of(entity.itemController, entity.baSyouKeyword)] as StrBaSyouPair
    })
    let tipPairs = pairs
    if (searchOptions.asMuchAsPossible) {
        if (searchOptions.max == null) {
            throw new Error()
        }
        tipPairs = tipPairs.slice(0, Math.min(pairs.length, searchOptions.max))
    } else if (searchOptions.max != null) {
        tipPairs = tipPairs.slice(0, searchOptions.max)
    } else if (searchOptions.min != null) {
        tipPairs = tipPairs.slice(0, searchOptions.min)
    } else if (searchOptions.count != null) {
        tipPairs = tipPairs.slice(0, searchOptions.count)
    }
    if (searchOptions.isRepeat) {
        if (searchOptions.count == null) {
            throw new Error()
        }
        if (tipPairs.length > 0) {
            while (tipPairs.length < searchOptions.count) {
                tipPairs = [...tipPairs, ...tipPairs]
            }
            tipPairs = tipPairs.slice(0, searchOptions.count)
        }
    }
    const tip: Tip = {
        title: ["カード", pairs, tipPairs],
        isRepeat: searchOptions.isRepeat,
    }
    if (searchOptions.min != null) {
        tip.min = searchOptions.min
    }
    if (searchOptions.max != null) {
        tip.max = searchOptions.max
    }
    if (searchOptions.count != null) {
        tip.count = searchOptions.count
    }
    if (cheatCardIds.length) {
        tip.cheatCardIds = cheatCardIds
    }
    if (searchOptions.asMuchAsPossible) {
        if (searchOptions.max == null) {
            throw new Error()
        }
        tip.min = Math.min(pairs.length, searchOptions.max)
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
            return vs.some(v => isSetGroupHasA(ctx, v, entity.itemId, { ges: getGlobalEffects(ctx, null) }))
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