import { pipe, always, map, sum, dissoc } from "ramda"
import { Bridge } from "../../script/bridge"
import { CardColorFn, CardColor, CardPrototypeRollCost, CardPrototype } from "../define/CardPrototype"
import { CardTextFn, Condition, createRollCostRequire } from "../define/CardText"
import { Effect, EffectFn } from "../define/Effect"
import { getCardGSignProperty, getCardHasSpeicalEffect, getCardTotalCostLength } from "./card"
import { GameState } from "./GameState"
import { getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { getItemPrototype, getItemOwner, getItemBaSyou } from "./ItemTableComponent"
import { logCategory } from "../../tool/logger"
import { LogicTree } from "../../tool/logicTree"
import { getCard } from "./CardTableComponent"
import { TipFn } from "../define/Tip"

export function createRollCostConditions(ctx: GameState, proto: CardPrototype, rollCost: CardPrototypeRollCost, bonus: number): { [key: string]: Condition } {
    if (rollCost == "X") {
        if (proto.color == null) {
            throw new Error()
        }
        return {
            [TipFn.createConditionKeyOfPayColorX(proto)]: {
                title: ["RollColor", proto.color]
            }
        }
    }
    const rollCostConditions = CardColorFn.getAll()
        .map(tc => createRollCostRequire(Math.max(0, rollCost.filter(c => c == tc).length + bonus), tc))
        .reduce((ctx, cons) => ({ ...ctx, ...cons }))
    return rollCostConditions
}

export function createPlayCardEffects(ctx: GameState, cardId: string): Effect[] {
    const ret = []
    const prototype = getItemPrototype(ctx, cardId)
    const playerId = getItemOwner(ctx, cardId)
    const cardRollCostLength = getCardTotalCostLength(ctx, cardId)
    const costConditions: { [key: string]: Condition } = (prototype.category != "グラフィック") ? {
        "合計国力〔x〕": {
            actions: [
                {
                    title: ["合計国力〔x〕", cardRollCostLength]
                }
            ]
        },
    } : {}
    const rollCostConditions = createRollCostConditions(ctx, prototype, prototype.rollCost || [], 0)
    {
        // ヒイロ・ユイ特殊處理
        const text = prototype.texts?.find(text => text.description == "『恒常』：このカードは、自軍ジャンクヤードにある状態でプレイする場合、セット先として、自軍ジャンクヤードにある、このカードと同じ属性のGサインを持つユニット１枚を、自軍配備エリアにロール状態で出し、このカードをセットできる。")
        if (text && getItemBaSyou(ctx, cardId).value[1] == "ジャンクヤード") {
            const effect: Effect = {
                id: `createPlayCardEffects_${cardId}_『恒常』：このカードは、自軍ジャンクヤードにある状態でプレイする場合、セット先として、自軍ジャンクヤードにある、このカードと同じ属性のGサインを持つユニット１枚を、自軍配備エリアにロール状態で出し、このカードをセットできる。`,
                reason: ["PlayCard", playerId, cardId, { isPlayCharacter: true }],
                description: text.description,
                isOption: true,
                text: {
                    id: text.id,
                    title: ["使用型", ["自軍", "配備フェイズ"]],
                    description: text.description,
                    conditions: {
                        ...costConditions,
                        ...rollCostConditions,
                        "自軍ジャンクヤードにある、このカードと同じ属性のGサインを持つユニット１枚": {
                            title: ["Entity", {
                                side: "自軍",
                                at: ["ジャンクヤード"],
                                hasGSignProperty: [getCardGSignProperty(ctx, cardId)],
                                is: ["ユニット"],
                                count: 1
                            }]
                        }
                    },
                    logicTreeActions: [
                        {
                            actions: [
                                {
                                    title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                                        const cardId = DefineFn.EffectFn.getCardID(effect)
                                        const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                        ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from]) as GameState
                                        return GameStateFn.addStackEffect(ctx, {
                                            // 注意：id必須是唯一的，如果不使用亂數請確保你的id不會重復
                                            // 否則有可能應該在ctx.effects中的效果被同id的效果刪除
                                            id: `${effect.id}_場に出る`,
                                            reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                                            description: effect.text.description,
                                            text: {
                                                id: effect.text.id,
                                                description: effect.text.description,
                                                title: [],
                                                logicTreeActions: [
                                                    {
                                                        actions: [
                                                            {
                                                                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                                                    const cardController = GameStateFn.getItemController(ctx, cardId)
                                                                    ctx = GameStateFn.doItemSetRollState(ctx, false, GameStateFn.createStrBaSyouPair(ctx, cardId), { isSkipTargetMissing: true })
                                                                    ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "配備エリア"), GameStateFn.createStrBaSyouPair(ctx, cardId))
                                                                    const unitPairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍ジャンクヤードにある、このカードと同じ属性のGサインを持つユニット１枚", cardId)
                                                                    for (const pair of unitPairs) {
                                                                        ctx = GameStateFn.doItemSetRollState(ctx, false, pair, { isSkipTargetMissing: true })
                                                                        ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "配備エリア"), pair)
                                                                        ctx = GameStateFn.setSetGroupParent(ctx, pair[0], cardId) as GameState
                                                                        // only first one
                                                                        break
                                                                    }
                                                                    return ctx
                                                                }.toString()
                                                            },
                                                        ]
                                                    }
                                                ]
                                            }
                                        }) as GameState
                                    }.toString()
                                }
                            ]
                        }
                    ]
                }
            }
            ret.push(effect)
        }
    }
    const characterConditions: { [key: string]: Condition } = (prototype.category == "キャラクター" || prototype.category == "オペレーション(ユニット)") ? {
        "一個自軍機體": {
            title: ["Entity", {
                at: ["配備エリア"],
                isCanSetCharacter: true,
                side: "自軍",
                is: ["ユニット"],
                count: 1
            }],
        }
    } : {}
    const conditions: { [key: string]: Condition } = {
        ...costConditions,
        ...rollCostConditions,
        ...characterConditions,
    }
    const logicLeafs: LogicTree[] = Object.keys(conditions).map(k => {
        const ret: LogicTree = {
            type: "Leaf",
            value: k
        }
        return ret
    })
    const logicTree: LogicTree = {
        type: "And",
        children: prototype.commandText?.logicTreeActions?.[0] ?
            [...logicLeafs, ...CardTextFn.getLogicTreeTreeLeafs(prototype.commandText, prototype.commandText.logicTreeActions[0])] :
            logicLeafs
    }
    // 注意, 這裡的effect.id是用函數名為前綴+卡片ID, 必須是唯一的
    const description = `Play ${prototype.title}`
    const playCardEffect: Effect = {
        id: `createPlayCardEffects_${cardId}`,
        reason: ["PlayCard", playerId, cardId, {
            isPlayUnit: prototype.category == "ユニット",
            isPlayCharacter: prototype.category == "キャラクター",
            isPlayCommand: prototype.category == "コマンド",
        }],
        description: description,
        text: {
            id: prototype.commandText?.id || `createPlayCardEffects_text_${cardId}`,
            title: prototype.commandText?.title || ["使用型", ["自軍", "配備フェイズ"]],
            description: description,
            conditions: {
                ...conditions,
                ...prototype.commandText?.conditions
            },
            logicTreeActions: [
                {
                    logicTree: logicTree,
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                const prototype = GameStateFn.getItemPrototype(ctx, cardId)
                                const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from]) as GameState
                                if (prototype.category == "ユニット") {
                                    const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx, effect)
                                    return GameStateFn.addStackEffect(ctx, newE) as GameState
                                }

                                if (prototype.category == "キャラクター" || prototype.category == "オペレーション(ユニット)") {
                                    const newE = GameStateFn.createCharOpUnitGoStageEffectFromPlayEffect(ctx, effect)
                                    return GameStateFn.addStackEffect(ctx, newE) as GameState
                                }

                                if (prototype.category == "コマンド") {
                                    return GameStateFn.addStackEffect(ctx, {
                                        id: `${effect.id}_場に出る`,
                                        reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                                        description: effect.text.description,
                                        text: {
                                            id: prototype.commandText?.id || `getPlayCardEffects_commentText_${cardId}`,
                                            description: prototype.commandText?.description || "unknown",
                                            title: [],
                                            logicTreeActions: [
                                                {
                                                    actions: [
                                                        {
                                                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                                                const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                                                const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "ジャンクヤード")
                                                                ctx = GameStateFn.doItemMove(ctx, to, [cardId, from]) as GameState
                                                                ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
                                                                return ctx
                                                            }.toString()
                                                        },
                                                        ...(prototype.commandText?.logicTreeActions?.[0]?.actions || [])
                                                    ]
                                                },
                                            ]
                                        }
                                    }) as GameState
                                }

                                if (prototype.category == "グラフィック") {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "Gゾーン")
                                    ctx = GameStateFn.doItemMove(ctx, to, [cardId, from]) as GameState
                                    ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
                                    return ctx
                                }

                                if (prototype.category == "オペレーション") {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "配備エリア")
                                    ctx = GameStateFn.doItemMove(ctx, to, [cardId, from]) as GameState
                                    ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
                                    return ctx
                                }

                                if (prototype.category == "ACE") {
                                    throw new Error(`not support category: ${prototype.category}`)
                                }
                                return ctx
                            }.toString()
                        }
                    ]
                },
            ]
        }
    }
    ret.push(playCardEffect)
    const ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    {
        const morePlayEfs = ges.filter(g => (g.title[0] == "合計国力＋(１)してプレイできる" || g.title[0] == "合計国力＋_、ロールコスト＋_してプレイできる") && g.cardIds.includes(cardId))
        const hasTotolCostPlusPlay = morePlayEfs.length > 0
        if (hasTotolCostPlusPlay) {
            // 取得原始條件
            let copyOriginCondition = playCardEffect.text.conditions || {}
            // 179027_09D_C_BK063R_black這張卡特殊處理
            if (getCard(ctx, cardId).protoID == "179027_09D_C_BK063R_black") {
                const rollCostBonus = getGlobalEffects(ctx, null).map(ge => {
                    if (ge.title[0] == "合計国力＋_、ロールコスト＋_してプレイできる" && ge.cardIds.includes(cardId)) {
                        return ge.title[2]
                    }
                    return 0
                }).reduce((a, b) => a + b, 0)
                // 將原始條件的橫置費用清除
                for (const rollCostKey of Object.keys(rollCostConditions)) {
                    delete copyOriginCondition[rollCostKey]
                }
                // 重新計算加入減免橫置費用紅利
                const newRollCostConditions = createRollCostConditions(ctx, prototype, prototype.rollCost || [], rollCostBonus)
                copyOriginCondition = {
                    ...copyOriginCondition,
                    ...newRollCostConditions,
                }
            }
            // 重新計算合計國力紅利
            const addedLength = pipe(always(morePlayEfs), map(g => (g.title[0] == "合計国力＋(１)してプレイできる" || g.title[0] == "合計国力＋_、ロールコスト＋_してプレイできる") ? g.title[1] : 0), sum)()
            copyOriginCondition = {
                ...copyOriginCondition,
                "合計国力〔x〕": {
                    actions: [
                        {
                            title: ["合計国力〔x〕", cardRollCostLength + addedLength]
                        }
                    ]
                }
            }

            // 重寫條件
            let totalCostPlusPlayEffect: Effect = JSON.parse(JSON.stringify(playCardEffect))
            totalCostPlusPlayEffect = {
                ...totalCostPlusPlayEffect,
                id: `totalCostPlusPlayEffect_${cardId}`,
                description: "合計国力＋(１)してプレイできる",
                text: {
                    ...totalCostPlusPlayEffect.text,
                    id: prototype.commandText?.id || `totalCostPlusPlayEffect_text_${cardId}`,
                    description: "合計国力＋(１)してプレイできる",
                    conditions: copyOriginCondition,
                }
            }

            if (totalCostPlusPlayEffect.text.logicTreeActions?.[0] == null) {
                throw new Error(`morePlayCardEffect.text.logicTreeActions?.[0] == null`)
            }
            // 179027_09D_C_BK063R_black這張卡特殊處理
            if (getCard(ctx, cardId).protoID == "179027_09D_C_BK063R_black") {
                // 重算LogicTree
                const logicLeafs: LogicTree[] = Object.keys(copyOriginCondition).map(k => {
                    const ret: LogicTree = {
                        type: "Leaf",
                        value: k
                    }
                    return ret
                })
                const logicTree: LogicTree = {
                    type: "And",
                    children: prototype.commandText?.logicTreeActions?.[0] ?
                        [...logicLeafs, ...CardTextFn.getLogicTreeTreeLeafs(prototype.commandText, prototype.commandText.logicTreeActions[0])] :
                        logicLeafs
                }
                totalCostPlusPlayEffect.text.logicTreeActions[0].logicTree = logicTree
            }
            // 加入新的action, 用這個能力出場的要標記
            totalCostPlusPlayEffect.text.logicTreeActions[0].actions.push({
                title: function _(ctx: GameState, effect: Effect, { GameStateFn, DefineFn }: Bridge): GameState {
                    const { addedLength } = { addedLength: 0 }
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    let cs = GameStateFn.getItemState(ctx, cardId)
                    cs = DefineFn.ItemStateFn.setMoreTotalRollCostLengthPlay(cs, addedLength)
                    ctx = GameStateFn.setItemState(ctx, cardId, cs) as GameState
                    return ctx
                }.toString().replace("{ addedLength: 0 }", `{addedLength: ${addedLength}}`)
            })
            ret.push(totalCostPlusPlayEffect)
        }
    }
    if (prototype.category == "キャラクター" && getCardHasSpeicalEffect(ctx, ["【ステイ】"], cardId)) {
        let stayPlayEffect: Effect = JSON.parse(JSON.stringify(playCardEffect))
        stayPlayEffect = {
            ...stayPlayEffect,
            id: `stayPlayEffect_${cardId}`,
            description: "【ステイ】",
            text: {
                ...stayPlayEffect.text,
                id: `stayPlayEffect_text_${cardId}`,
                description: "【ステイ】",
                conditions: {
                    ...dissoc("一個自軍機體", stayPlayEffect.text.conditions || {})
                },
                logicTreeActions: [
                    {
                        actions: [
                            {
                                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from]) as GameState
                                    return GameStateFn.addStackEffect(ctx, {
                                        id: ToolFn.getUUID("getPlayCardEffects"),
                                        reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                                        description: effect.text.description,
                                        text: {
                                            id: effect.text.id,
                                            description: effect.text.description,
                                            title: [],
                                            logicTreeActions: [
                                                {
                                                    actions: [
                                                        {
                                                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                                                const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                                                const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "配備エリア")
                                                                ctx = GameStateFn.doItemMove(ctx, to, [cardId, from]) as GameState
                                                                ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
                                                                return ctx
                                                            }.toString()
                                                        },
                                                    ]
                                                }
                                            ]
                                        }
                                    }) as GameState
                                }.toString()
                            }
                        ]
                    }
                ]
            }
        }
        ret.push(stayPlayEffect)
    }
    return ret
}

export function createUnitGoStageEffectFromPlayEffect(ctx: GameState, effect: Effect): Effect {
    const cardId = EffectFn.getCardID(effect)
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "ユニット") {
        return {
            id: `createUnitGoStageEffectFromPlayEffect_${cardId}`,
            reason: ["場に出る", EffectFn.getPlayerID(effect), EffectFn.getCardID(effect)],
            description: effect.text.description,
            text: {
                id: effect.text.id,
                description: effect.text.description,
                title: [],
                logicTreeActions: [
                    {
                        actions: [
                            {
                                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "配備エリア")
                                    ctx = GameStateFn.doItemMove(ctx, to, [cardId, from]) as GameState
                                    const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx, ["戦闘配備"], cardId)
                                    const hasPS = GameStateFn.getCardHasSpeicalEffect(ctx, ["【PS装甲】"], cardId)
                                    const isNoNeedRoll = (hasHigh || hasPS)
                                    const isRoll = isNoNeedRoll == false
                                    ctx = GameStateFn.doItemSetRollState(ctx, isRoll, [cardId, GameStateFn.getItemBaSyou(ctx, cardId)], { isSkipTargetMissing: true })
                                    ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
                                    return ctx
                                }.toString()
                            },
                        ]
                    }
                ]
            }
        }
    }
    throw new Error()
}

export function createCharOpUnitGoStageEffectFromPlayEffect(ctx: GameState, effect: Effect): Effect {
    const cardId = EffectFn.getCardID(effect)
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "キャラクター" || prototype.category == "オペレーション(ユニット)") {
        return {
            id: `createCharOpUnitGoStageEffectFromPlayEffect_${cardId}`,
            reason: ["場に出る", EffectFn.getPlayerID(effect), EffectFn.getCardID(effect)],
            description: effect.text.description,
            text: {
                id: effect.text.id,
                description: effect.text.description,
                title: [],
                logicTreeActions: [
                    {
                        actions: [
                            {
                                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "一個自軍機體", cardId)
                                    if (pairs.length == 0) {
                                        throw new Error(`pairs must not 0: ${effect.text.description}`)
                                    }
                                    const [targetCardId, targetBasyou] = pairs[0]
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    const to = targetBasyou
                                    ctx = GameStateFn.doItemMove(ctx, to, [cardId, from]) as GameState
                                    const isRoll = GameStateFn.getCard(ctx, targetCardId).isRoll || false
                                    ctx = GameStateFn.mapCard(ctx, cardId, is => ({ ...is, isRoll: isRoll })) as GameState
                                    ctx = GameStateFn.setSetGroupParent(ctx, targetCardId, cardId) as GameState
                                    ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
                                    ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場にセットされた場合"], cardIds: [cardId] })
                                    return ctx
                                }.toString()
                            }
                        ]
                    }
                ]
            }
        }
    }
    throw new Error()
}