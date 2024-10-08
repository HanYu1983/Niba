
import { lift, pair } from "ramda"
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyouKeywordFn } from "../define/BaSyou"
import { Condition, ConditionTitleFn, ConditionFn, Situation } from "../define/CardText"
import { Effect, EffectFn } from "../define/Effect"
import { TargetMissingError, TipError } from "../define/GameError"
import { PlayerIDFn } from "../define/PlayerID"
import { Tip, StrBaSyouPair, TipTitleTextRef } from "../define/Tip"
import { getItemCharacteristic, getItemRuntimeCategory, getCardTexts, getCardRollCostLength, getCardIdsCanPayRollColor } from "./card"
import { getCard } from "./CardTableComponent"
import { GameState } from "./GameState"
import { isBattle } from "./IsBattleComponent"
import { getItemController, getItemIdsByBasyou, getItemPrototype, getItemBaSyou } from "./ItemTableComponent"
import { getSetGroupBattlePoint } from "./setGroup"
import { getSetGroupRoot } from "./SetGroupComponent"
import { logCategory } from "../../tool/logger"
import { createEntityIterator, createTipByEntitySearch, EntityFn } from "./Entity"
import { getPlayerState, mapPlayerState } from "./PlayerStateComponent"

export function createConditionTitleFn(condition: Condition, options?: { isPlay?: boolean }): ConditionTitleFn {
    if (condition.title == null || typeof condition.title == "string") {
        return ConditionFn.getTitleFn(condition)
    }
    logCategory("getConditionTitleFn", condition.title)
    switch (condition.title[0]) {
        case "_敵軍_ユニットが_３枚以上いる場合": {
            const [_, side, category, count] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const cardController = getItemController(ctx, cardId);
                const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController)
                const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getBaAll()))
                const pairs = basyous
                    .flatMap(basyou => getItemIdsByBasyou(ctx, basyou))
                    .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
                if (pairs.length < count) {
                    throw new TipError("_敵軍_ユニットが_３枚以上いる場合")
                }
                return null
            }
        }
        case "_敵軍部隊がいる場合": {
            const [_, side] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const cardController = getItemController(ctx, cardId);
                const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController)
                const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([playerId], ["戦闘エリア1", "戦闘エリア2"]))
                const pairs = basyous.flatMap(basyou => getItemIdsByBasyou(ctx, basyou))
                if (pairs.length == 0) {
                    throw new TipError("_敵軍部隊がいる場合")
                }
                return null
            }
        }
        case "_自軍_ジャンクヤードにある、_黒のGサインを持つ全てのカードは": {
            const [_, side, basyouKw, color] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const cardController = getItemController(ctx, cardId);
                const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController)
                const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([playerId], [basyouKw]))
                const pairs = basyous.flatMap(basyou =>
                    getItemIdsByBasyou(ctx, basyou)
                        .filter(cardId => getItemPrototype(ctx, cardId).gsign?.[0].includes(color))
                        .map(cardId => [cardId, basyou] as StrBaSyouPair)
                )
                return {
                    title: ["カード", pairs, pairs],
                }
            }
        }
        case "_自軍_本国の上のカード_１～_４枚を見て、その中にある、「特徴：_ヘイズル系」を持つ_ユニット_１枚": {
            const [_, side, basyouKw, min, max, char, category, count] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const playerId = getItemController(ctx, cardId);
                const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId)
                const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], [basyouKw]))
                const pairs = basyous.flatMap(basyou =>
                    getItemIdsByBasyou(ctx, basyou)
                        .filter(cardId => getItemCharacteristic(ctx, cardId).includes(char))
                        .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
                        .map(cardId => [cardId, basyou] as StrBaSyouPair)
                ).slice(0, max)
                if (pairs.length < min) {
                    throw new TargetMissingError(`length is ${pairs.length}, min is ${min}: ${effect.text.description}`)
                }
                return {
                    title: ["カード", pairs, pairs.slice(0, count)],
                    count: count,
                }
            }
        }
        case "このカードの_本来のテキスト１つ": {
            const [_, isOrigin, count] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const texts = isOrigin ?
                    (getItemPrototype(ctx, cardId).texts || []) :
                    getCardTexts(ctx, cardId)
                const textRefs: TipTitleTextRef[] = texts.filter(text => (text.title[0] == "特殊型" && text.title[1][0] == "クロスウェポン") == false).map(text => {
                    return {
                        cardId: cardId,
                        textId: text.id
                    }
                })
                logCategory(`getConditionTitleFn`, textRefs)
                return {
                    title: ["テキスト", textRefs, textRefs.slice(0, count)],
                    count: count,
                }
            }
        }
        case "_本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚": {
            const [_, isOrigin, targetChar, side, category, count] = condition.title
            const exceptItemSelf = condition.exceptItemSelf
            return function (ctx: GameState, effect: Effect): Tip | null {
                const fromCardId = EffectFn.getCardID(effect)
                const playerId = getItemController(ctx, fromCardId);
                const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId)
                if (category == "グラフィック") {
                    const basyous: AbsoluteBaSyou[] = [AbsoluteBaSyouFn.of(targetPlayerId, "Gゾーン")]
                    const pairs = basyous.flatMap(basyou =>
                        getItemIdsByBasyou(ctx, basyou)
                            .filter(cardId => {
                                if (exceptItemSelf && fromCardId == cardId) {
                                    return false
                                }
                                if (getCard(ctx, cardId).isRoll) {
                                    return false
                                }
                                if (isOrigin) {
                                    return getItemPrototype(ctx, cardId).characteristic?.includes(targetChar)
                                } else {
                                    return getItemCharacteristic(ctx, cardId)
                                }
                            })
                            .map(cardId => [cardId, basyou] as StrBaSyouPair)
                    )
                    return {
                        title: ["カード", pairs, pairs.slice(0, count)],
                        count: count,
                    }

                } else {
                    const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], BaSyouKeywordFn.getBaAll()))
                    const pairs = basyous.flatMap(basyou =>
                        getItemIdsByBasyou(ctx, basyou)
                            .filter(cardId => getSetGroupRoot(ctx, cardId))
                            .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
                            .filter(cardId => {
                                if (exceptItemSelf && fromCardId == cardId) {
                                    return false
                                }
                                if (isOrigin) {
                                    return getItemPrototype(ctx, cardId).characteristic?.includes(targetChar)
                                } else {
                                    return getItemCharacteristic(ctx, cardId).includes(targetChar)
                                }
                            })
                            .map(cardId => [cardId, basyou] as StrBaSyouPair)
                    )
                    return {
                        title: ["カード", pairs, pairs.slice(0, count)],
                        count: count,
                    }

                }
            }
        }
        case "_戦闘エリアにいる_敵軍_ユニット_１～_２枚": {
            const [_, basyouKws, side, category, min, max] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const playerId = getItemController(ctx, cardId);
                const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId)
                const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], basyouKws))
                const pairs = basyous.flatMap(basyou =>
                    getItemIdsByBasyou(ctx, basyou)
                        .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
                        .map(cardId => [cardId, basyou] as StrBaSyouPair)
                )
                return {
                    title: ["カード", pairs, pairs.slice(0, max)],
                    min: min,
                    max: max,
                }

            }
        }
        case "_自軍_ユニット_１枚": {
            const [_, side, category, count] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const playerId = getItemController(ctx, cardId);
                const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId)
                const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], BaSyouKeywordFn.getBaAll()))
                const pairs = basyous.flatMap(basyou =>
                    getItemIdsByBasyou(ctx, basyou)
                        .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
                        .map(cardId => [cardId, basyou] as StrBaSyouPair)
                )
                return {
                    title: ["カード", pairs, pairs.slice(0, count)],
                    count: 1,
                }

            }
        }
        case "_自軍手札、または自軍ハンガーにある、_６以下の合計国力を持つ_ユニット_１枚を": {
            const [_, side, totalCost, category, count] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const playerId = getItemController(ctx, cardId);
                const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId)
                const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], ["手札", "ハンガー"]))
                const pairs = basyous.flatMap(basyou =>
                    getItemIdsByBasyou(ctx, basyou)
                        .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
                        .filter(cardId => getCardRollCostLength(ctx, cardId) <= totalCost)
                        .map(cardId => [cardId, basyou] as StrBaSyouPair)
                )
                return {
                    title: ["カード", pairs, pairs.slice(0, count)],
                    min: count,
                }
            }
        }
        case "打開自軍手裡或指定HANGER中特徵_A並合計國力_x以下的_1張卡":
            {
                const [_, char, x, count] = condition.title
                return function (ctx: GameState, effect: Effect): Tip | null {
                    const cardId = EffectFn.getCardID(effect)
                    const playerId = getItemController(ctx, cardId);
                    const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([playerId], ["手札", "ハンガー"]))
                    const pairs = basyous.flatMap(basyou =>
                        getItemIdsByBasyou(ctx, basyou)
                            .filter(cardId => getItemPrototype(ctx, cardId).category == "ユニット")
                            .filter(cardId => getItemCharacteristic(ctx, cardId).includes(char))
                            .filter(cardId => getCardRollCostLength(ctx, cardId) <= x)
                            .map(cardId => [cardId, basyou] as StrBaSyouPair)
                    )
                    return {
                        title: ["カード", pairs, pairs.slice(0, count)],
                        count: count,
                    }
                }
            }
        case "_自軍_本國上的_1張卡": {
            const [_, side, basyouKw, count] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const playerId = getItemController(ctx, cardId);
                const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId)
                const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], [basyouKw]))
                const pairs = basyous.flatMap(basyou =>
                    getItemIdsByBasyou(ctx, basyou).map(cardId => [cardId, basyou] as StrBaSyouPair)
                )
                return {
                    title: ["カード", pairs, pairs.slice(0, count)],
                    min: count,
                }

            }
        }
        case "這張卡交戰的防禦力_x以下的敵軍機體_1張": {
            const [_, x, count] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, cardId)) == "戦闘エリア1" || AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, cardId)) == "戦闘エリア2") {

                } else {
                    return null
                }
                const cardController = getItemController(ctx, cardId)
                const opponentId = PlayerIDFn.getOpponent(cardController)
                const from = AbsoluteBaSyouFn.setPlayerID(getItemBaSyou(ctx, cardId), opponentId)
                // TODO 去掉重復
                const targetIds = getItemIdsByBasyou(ctx, from)
                    .map(itemId => getSetGroupRoot(ctx, itemId))
                    .filter(itemId => {
                        const [_, def, _2] = getSetGroupBattlePoint(ctx, itemId)
                        return def <= x
                    })
                const pairs = targetIds.map(itemId => [itemId, from] as StrBaSyouPair)
                return {
                    title: ["カード", pairs, pairs.slice(0, count)],
                    min: count,
                }
            }
        }
        case "_自軍_本國找出特徵_A的_1張卡": {
            const [_, side, basyouKw, char, count] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const playerId = getItemController(ctx, cardId);
                const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId)
                const from = AbsoluteBaSyouFn.of(targetPlayerId, basyouKw)
                const itemIdAtBasyou = getItemIdsByBasyou(ctx, from)
                const targetIds = itemIdAtBasyou.filter(itemId => {
                    return getItemCharacteristic(ctx, itemId).indexOf(char) != -1
                })
                const pairs = targetIds.map(targetId => [targetId, from] as StrBaSyouPair)
                return {
                    title: ["カード", pairs, pairs.slice(0, count)],
                    max: count,
                    cheatCardIds: itemIdAtBasyou
                }
            }
        }
        case "RollColor": {
            const [_, color] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const cardController = getItemController(ctx, cardId)
                let situation: Situation = { title: ["ロールコストの支払いにおいて"] }
                if (effect.reason[0] == "PlayCard" && effect.reason[3].isPlayCommand) {
                    if (getItemPrototype(ctx, cardId).category?.includes("装弾")) {
                        situation = { title: ["「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合"] }
                    }
                }
                const cardIdColors = getCardIdsCanPayRollColor(ctx, situation, cardController, color)
                let colorIds = []
                if (color == null) {
                    colorIds = cardIdColors.map(gId => gId.cardId).slice(0, 1)
                } else if (color == "紫") {
                    // 單紫優先
                    colorIds = cardIdColors.filter(gId => gId.colors.length == 1 && gId.colors[0] == color).map(gId => gId.cardId).slice(0, 1)
                    // 若無單紫
                    if (colorIds.length == 0) {
                        // 非紫需要2張
                        colorIds = cardIdColors.filter(gId => gId.colors.length == 1).map(gId => gId.cardId).slice(0, 2)
                        // 若非紫小於2張
                        if (colorIds.length < 2) {
                            // 最下策則用雙色卡支付
                            colorIds = cardIdColors.filter(gId => gId.colors.length > 1).map(gId => gId.cardId).slice(0, 2)
                        }
                    }
                } else {
                    // 單色優先
                    colorIds = cardIdColors.filter(gId => gId.colors.length == 1 && gId.colors[0] == color).map(gId => gId.cardId).slice(0, 1)
                    if (colorIds.length == 0) {
                        // 最下策則用雙色卡支付
                        colorIds = cardIdColors.filter(gId => gId.colors.length > 1 && gId.colors.includes(color)).map(gId => gId.cardId).slice(0, 1)
                    }
                }
                const cardIdColorsPairs = cardIdColors.map(gId => gId.cardId).map(colorId => [colorId, getItemBaSyou(ctx, colorId)] as StrBaSyouPair)
                const pairs = colorIds.map(colorId => [colorId, getItemBaSyou(ctx, colorId)] as StrBaSyouPair)
                return {
                    title: ["カード", cardIdColorsPairs, pairs],
                    min: Math.max(1, pairs.length),
                }
            }
        }
        case "_交戦中の_自軍_ユニット_１枚": {
            const [_, battleStr, side, category, count] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const playerId = getItemController(ctx, cardId);
                const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId)
                const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], BaSyouKeywordFn.getBaAll()))
                const pairs = basyous.flatMap(basyou =>
                    getItemIdsByBasyou(ctx, basyou)
                        .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
                        .filter(cardId => isBattle(ctx, cardId, null) == (battleStr == "交戦中"))
                        .map(cardId => [cardId, basyou] as StrBaSyouPair)
                )
                return {
                    title: ["カード", pairs, pairs.slice(0, count)],
                    count: 1,
                }

            }
        }
        case "_配備エリアにいる、「特徴：_T3部隊」を持つ_自軍_ユニット_１枚": {
            const [_, basyouKw, char, side, category, count] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                const cardController = getItemController(ctx, cardId);
                const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController)
                const from = AbsoluteBaSyouFn.of(targetPlayerId, basyouKw)
                const itemIdsAtBasyou = getItemIdsByBasyou(ctx, from)
                const targetIds = itemIdsAtBasyou.filter(itemId => {
                    return getItemCharacteristic(ctx, itemId).indexOf(char) != -1
                }).filter(itemId => {
                    return getItemRuntimeCategory(ctx, itemId) == category
                })
                const pairs = targetIds.map(targetId => [targetId, from] as StrBaSyouPair)
                return {
                    title: ["カード", pairs, pairs.slice(0, count)],
                    min: count
                }
            }
        }
        case "このセットグループの_ユニットは":
            const [_, category] = condition.title
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                switch (category) {
                    case "ユニット":
                        const targetId = getSetGroupRoot(ctx, cardId)
                        const pair: StrBaSyouPair = [targetId, getItemBaSyou(ctx, targetId)]
                        return {
                            title: ["カード", [pair], [pair]],
                            min: 1
                        }
                    default:
                        throw new Error(`このセットグループの_ユニットは: not support ${category}`)
                }
            }
        case "Entity": {
            const [_, options] = condition.title
            if ([options.max, options.min, options.count].every(v => v == null)) {
                throw new Error(`Entity search must has one of min, max, count`)
            }
            return function (ctx: GameState, effect: Effect): Tip | null {
                const cardId = EffectFn.getCardID(effect)
                return createTipByEntitySearch(ctx, cardId, options)
            }
        }
    }
}
