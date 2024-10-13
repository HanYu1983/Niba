import { pipe, always, map, sum, dissoc } from "ramda"
import { Bridge } from "../../script/bridge"
import { CardColorFn, CardColor, CardPrototypeRollCost, CardPrototype } from "../define/CardPrototype"
import { Action, CardText, CardTextFn, Condition, createRollCostRequire } from "../define/CardText"
import { Effect, EffectFn } from "../define/Effect"
import { getCardGSignProperty, getCardHasSpeicalEffect, getCardTotalCostLength } from "./card"
import { GameState } from "./GameState"
import { getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { getItemPrototype, getItemOwner, getItemBaSyou } from "./ItemTableComponent"
import { logCategory } from "../../tool/logger"
import { LogicTree } from "../../tool/logicTree"
import { getCard } from "./CardTableComponent"
import { TipFn } from "../define/Tip"
import { createBridge } from "../bridge/createBridge"
import { ToolFn } from "../tool"

export function createPlayCardEffects(ctx: GameState, cardId: string): Effect[] {
    const ret: Effect[] = []
    const prototype = getItemPrototype(ctx, cardId)
    const playerId = getItemOwner(ctx, cardId)
    prototype.texts?.forEach((text, i) => {
        const effs = text.createPlayEffect?.(ctx, {
            id: ToolFn.getUUID("createPlayEffect"),
            reason: ["PlayCard", playerId, cardId, {}],
            text: text,
        }, createBridge())
        effs?.forEach(eff => {
            if (eff.text.title[0] != "使用型") {
                console.log(eff?.text.description)
                throw new Error()
            }
            ret.push(eff)
        })
    })
    const ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    const canPlayByText = ges
        .filter(ge => ge.title[0] == "自軍手札にあるかのようにプレイできる")
        .find(ge => ge.cardIds.includes(cardId))
    if (canPlayByText) {
        const playGText = createPlayGText(ctx, cardId)
        const playText = createPlayCardText(ctx, cardId)
        return [playGText, playText]
    }
    const basyou = getItemBaSyou(ctx, cardId)
    if (basyou.value[1] == "手札" || basyou.value[1] == "ハンガー") {

    } else {
        return ret
    }
    // const cardRollCostLength = getCardTotalCostLength(ctx, cardId)
    // const costConditions: { [key: string]: Condition } = (prototype.category != "グラフィック") ? {
    //     "合計国力〔x〕": {
    //         actions: [
    //             {
    //                 title: ["合計国力〔x〕", cardRollCostLength]
    //             }
    //         ]
    //     },
    // } : {}
    // const rollCostConditions = createRollCostConditions(ctx, prototype, prototype.rollCost || [], 0)
    // const characterConditions: { [key: string]: Condition } = (prototype.category == "キャラクター" || prototype.category == "オペレーション(ユニット)") ? {
    //     [TipFn.createCharacterTargetUnitKey()]: {
    //         title: ["Entity", {
    //             at: ["配備エリア"],
    //             isCanSetCharacter: true,
    //             side: "自軍",
    //             is: ["ユニット"],
    //             count: 1
    //         }],
    //     }
    // } : {}
    // const conditions: { [key: string]: Condition } = {
    //     ...costConditions,
    //     ...rollCostConditions,
    //     ...characterConditions,
    // }
    // const logicLeafs: LogicTree[] = Object.keys(conditions).map(k => {
    //     const ret: LogicTree = {
    //         type: "Leaf",
    //         value: k
    //     }
    //     return ret
    // })
    // const logicTree: LogicTree = {
    //     type: "And",
    //     children: prototype.commandText?.logicTreeActions?.[0] ?
    //         [...logicLeafs, ...CardTextFn.getLogicTreeTreeLeafs(prototype.commandText, prototype.commandText.logicTreeActions[0])] :
    //         logicLeafs
    // }
    // // 注意, 這裡的effect.id是用函數名為前綴+卡片ID, 必須是唯一的
    // const description = `Play ${prototype.title}`
    // const playCardEffect: Effect = {
    //     id: `createPlayCardEffects_${cardId}`,
    //     reason: ["PlayCard", playerId, cardId, {
    //         isPlayUnit: prototype.category == "ユニット",
    //         isPlayCharacter: prototype.category == "キャラクター",
    //         isPlayCommand: prototype.category == "コマンド",
    //     }],
    //     description: description,
    //     text: {
    //         id: prototype.commandText?.id || `createPlayCardEffects_text_${cardId}`,
    //         title: prototype.commandText?.title || ["使用型", ["自軍", "配備フェイズ"]],
    //         description: description,
    //         conditions: {
    //             ...conditions,
    //             ...prototype.commandText?.conditions
    //         },
    //         logicTreeActions: [
    //             {
    //                 logicTree: logicTree,
    //                 actions: [
    //                     {
    //                         title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
    //                             const cardId = DefineFn.EffectFn.getCardID(effect)
    //                             const prototype = GameStateFn.getItemPrototype(ctx, cardId)
    //                             const from = GameStateFn.getItemBaSyou(ctx, cardId)
    //                             ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from]) as GameState
    //                             if (prototype.category == "ユニット") {
    //                                 const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx, effect)
    //                                 return GameStateFn.addStackEffect(ctx, newE) as GameState
    //                             }

    //                             if (prototype.category == "キャラクター" || prototype.category == "オペレーション(ユニット)") {
    //                                 const newE = GameStateFn.createCharOpUnitGoStageEffectFromPlayEffect(ctx, effect)
    //                                 return GameStateFn.addStackEffect(ctx, newE) as GameState
    //                             }

    //                             if (prototype.category == "コマンド") {
    //                                 return GameStateFn.addStackEffect(ctx, {
    //                                     id: `${effect.id}_場に出る`,
    //                                     reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
    //                                     description: effect.text.description,
    //                                     text: {
    //                                         id: prototype.commandText?.id || `getPlayCardEffects_commentText_${cardId}`,
    //                                         description: prototype.commandText?.description || "unknown",
    //                                         title: [],
    //                                         logicTreeActions: [
    //                                             {
    //                                                 actions: [
    //                                                     {
    //                                                         title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
    //                                                             const cardId = DefineFn.EffectFn.getCardID(effect)
    //                                                             const from = GameStateFn.getItemBaSyou(ctx, cardId)
    //                                                             const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "ジャンクヤード")
    //                                                             ctx = GameStateFn.doItemMove(ctx, to, [cardId, from]) as GameState
    //                                                             ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
    //                                                             return ctx
    //                                                         }.toString()
    //                                                     },
    //                                                     ...(prototype.commandText?.logicTreeActions?.[0]?.actions || [])
    //                                                 ]
    //                                             },
    //                                         ]
    //                                     }
    //                                 }) as GameState
    //                             }

    //                             if (prototype.category == "グラフィック") {
    //                                 const cardId = DefineFn.EffectFn.getCardID(effect)
    //                                 const from = GameStateFn.getItemBaSyou(ctx, cardId)
    //                                 const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "Gゾーン")
    //                                 ctx = GameStateFn.doItemMove(ctx, to, [cardId, from]) as GameState
    //                                 ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
    //                                 return ctx
    //                             }

    //                             if (prototype.category == "オペレーション") {
    //                                 const cardId = DefineFn.EffectFn.getCardID(effect)
    //                                 const from = GameStateFn.getItemBaSyou(ctx, cardId)
    //                                 const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "配備エリア")
    //                                 ctx = GameStateFn.doItemMove(ctx, to, [cardId, from]) as GameState
    //                                 ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
    //                                 return ctx
    //                             }

    //                             if (prototype.category == "ACE") {
    //                                 throw new Error(`not support category: ${prototype.category}`)
    //                             }
    //                             return ctx
    //                         }.toString()
    //                     }
    //                 ]
    //             },
    //         ]
    //     }
    // }
    const playG = createPlayGText(ctx, cardId)
    ret.push(playG)
    const playCardEffect = createPlayCardText(ctx, cardId)
    ret.push(playCardEffect)
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
                const rollCostConditions = createRollCostConditions(ctx, prototype, prototype.rollCost || [], 0)
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
            const cardRollCostLength = getCardTotalCostLength(ctx, cardId)
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
                    ...dissoc(TipFn.createCharacterTargetUnitKey(), stayPlayEffect.text.conditions || {})
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

export function createPlayCardText(ctx: GameState, cardId: string): Effect {
    const prototype = getItemPrototype(ctx, cardId)
    switch (prototype.category) {
        case "コマンド":
            return createPlayCommandText(ctx, cardId)
        case "キャラクター":
        case "オペレーション(ユニット)":
            return createPlayCharacterOperationText(ctx, cardId)
        case "グラフィック":
            return createPlayGText(ctx, cardId)
        case "ユニット":
            return createPlayUnitText(ctx, cardId)
        case "オペレーション":
        case "ACE":
            return createPlayOperationText(ctx, cardId)
    }
    throw new Error()
}

export function createPlayGText(ctx: GameState, cardId: string): Effect {
    // 注意, 這裡的effect.id是用函數名為前綴+卡片ID, 必須是唯一的
    const text: CardText = {
        id: `createPlayGEffects_text_${cardId}`,
        title: ["使用型", ["自軍", "配備フェイズ"]],
        description: "PlayG",
        conditions: {
            "出G上限": {
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const cardController = GameStateFn.getItemController(ctx, cardId)
                            const ps = GameStateFn.getPlayerState(ctx, cardController)
                            if (ps.playGCount > 0) {
                                throw new DefineFn.TipError(`出G上限: ${ps.playGCount}`, { isPlayGLimit: true })
                            }
                            ctx = GameStateFn.mapPlayerState(ctx, cardController, ps => {
                                return {
                                    ...ps,
                                    playGCount: ps.playGCount + 1
                                }
                            }) as GameState
                            return ctx
                        }.toString()
                    }
                ]
            }
        },
        logicTreeActions: [
            {
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const from = GameStateFn.getItemBaSyou(ctx, cardId)
                            ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "Gゾーン"), [cardId, from]) as GameState
                            return ctx
                        }.toString()
                    },
                    {
                        title: ["triggerEvent", { title: ["プレイされて場に出た場合"] }]
                    },
                    {
                        title: ["triggerEvent", { title: ["このカードがGとして場に出た場合"] }]
                    }
                ]
            }
        ]
    }
    return {
        id: `createPlayGText_${cardId}`,
        reason: ["PlayCard", getItemOwner(ctx, cardId), cardId, { isPlayG: true }],
        description: `Play G`,
        text: text
    }
}

export function createPlayUnitText(ctx: GameState, cardId: string): Effect {
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "ユニット") {

    } else {
        throw new Error()
    }
    const conditions = createPlayCardConditions(ctx, cardId)
    const description = `Play ${prototype.title}`
    const text: CardText = {
        id: `createPlayUnitText_${cardId}`,
        title: ["使用型", ["自軍", "配備フェイズ"]],
        description: description,
        conditions: conditions,
        logicTreeActions: [
            {
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const from = GameStateFn.getItemBaSyou(ctx, cardId)
                            ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from]) as GameState
                            const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx, effect)
                            return GameStateFn.addStackEffect(ctx, newE) as GameState
                        }.toString()
                    }
                ]
            },
        ]
    }
    return {
        id: `createPlayUnitText_${cardId}`,
        reason: ["PlayCard", getItemOwner(ctx, cardId), cardId, { isPlayUnit: true }],
        description: `Play ${prototype.title}`,
        text: text
    }
}

export function createPlayOperationText(ctx: GameState, cardId: string): Effect {
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "オペレーション") {

    } else {
        throw new Error()
    }
    const conditions = createPlayCardConditions(ctx, cardId)
    const description = `Play ${prototype.title}`
    const text: CardText = {
        id: `createPlayOperationText_${cardId}`,
        title: ["使用型", ["自軍", "配備フェイズ"]],
        description: description,
        conditions: conditions,
        logicTreeActions: [
            {
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const from = GameStateFn.getItemBaSyou(ctx, cardId)
                            ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from]) as GameState
                            const newE = GameStateFn.createOperationGoStageEffectFromPlayEffect(ctx, effect)
                            return GameStateFn.addStackEffect(ctx, newE) as GameState
                        }.toString()
                    }
                ]
            },
        ]
    }
    return {
        id: `createPlayOperationText_${cardId}`,
        reason: ["PlayCard", getItemOwner(ctx, cardId), cardId, { isPlayOperation: true }],
        description: `Play ${prototype.title}`,
        text: text
    }
}

export function createPlayCharacterOperationText(ctx: GameState, cardId: string): Effect {
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "キャラクター" || prototype.category == "オペレーション(ユニット)") {

    } else {
        throw new Error()
    }
    const conditions = createPlayCardConditions(ctx, cardId)
    const description = `Play ${prototype.title}`
    const text: CardText = {
        id: `createPlayCharacterOperationText_${cardId}`,
        title: ["使用型", ["自軍", "配備フェイズ"]],
        description: description,
        conditions: conditions,
        logicTreeActions: [
            {
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const prototype = GameStateFn.getItemPrototype(ctx, cardId)
                            const from = GameStateFn.getItemBaSyou(ctx, cardId)
                            ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from]) as GameState
                            const newE = GameStateFn.createCharOpUnitGoStageEffectFromPlayEffect(ctx, effect)
                            return GameStateFn.addStackEffect(ctx, newE) as GameState
                        }.toString()
                    }
                ]
            },
        ]
    }
    return {
        id: `createPlayCharacterOperationText_${cardId}`,
        reason: ["PlayCard", getItemOwner(ctx, cardId), cardId, {
            isPlayCharacter: prototype.category == "キャラクター",
            isPlayOperation: prototype.category == "オペレーション(ユニット)",
        }],
        description: `Play ${prototype.title}`,
        text: text
    }
}

export function createPlayCommandText(ctx: GameState, cardId: string): Effect {
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "コマンド") {

    } else {
        throw new Error()
    }
    const commandText = prototype.commandText
    if (commandText == null) {
        throw new Error()
    }
    const conditions = createPlayCardConditions(ctx, cardId)
    const description = `Play ${prototype.title}`
    const logicLeafs: LogicTree[] = Object.keys(conditions).map(k => {
        const ret: LogicTree = {
            type: "Leaf",
            value: k
        }
        return ret
    })
    const logicTree: LogicTree = {
        type: "And",
        children: commandText.logicTreeActions?.[0] ?
            [...logicLeafs, ...CardTextFn.getLogicTreeTreeLeafs(commandText, commandText.logicTreeActions[0])] :
            logicLeafs
    }
    const playCardEffect: CardText = {
        id: commandText.id || `createPlayCommandEffect_${cardId}`,
        title: commandText.title || ["使用型", ["自軍", "配備フェイズ"]],
        description: description,
        conditions: {
            ...conditions,
            ...commandText?.conditions
        },
        logicTreeActions: [
            {
                logicTree: logicTree,
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                            const { commandText }: any = { commandText: null }
                            if (commandText == null) {
                                throw new Error(`commandText must replace`)
                            }
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const prototype = GameStateFn.getItemPrototype(ctx, cardId)
                            const from = GameStateFn.getItemBaSyou(ctx, cardId)
                            ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from]) as GameState
                            return GameStateFn.addStackEffect(ctx, {
                                id: `${effect.id}_場に出る`,
                                reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                                description: effect.text.description,
                                text: {
                                    id: commandText.id || `getPlayCardEffects_commentText_${cardId}`,
                                    description: commandText.description || "unknown",
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
                                                ...(commandText.logicTreeActions?.[0]?.actions || [])
                                            ]
                                        },
                                    ]
                                }
                            }) as GameState
                        }.toString().replace("{ commandText: null }", JSON.stringify({
                            commandText: commandText
                        }))
                    }
                ]
            },
        ]
    }
    return {
        id: `createPlayCommandText_${cardId}`,
        reason: ["PlayCard", getItemOwner(ctx, cardId), cardId, { isPlayCommand: true }],
        description: `Play ${prototype.title}`,
        text: playCardEffect
    }
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

export function createOperationGoStageEffectFromPlayEffect(ctx: GameState, effect: Effect): Effect {
    const cardId = EffectFn.getCardID(effect)
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "オペレーション") {
        return {
            id: `createOperationGoStageEffectFromPlayEffect_${cardId}`,
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
                                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, DefineFn.TipFn.createCharacterTargetUnitKey(), cardId)
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

export function createPlayCardConditions(ctx: GameState, cardId: string): { [key: string]: Condition } {
    const prototype = getItemPrototype(ctx, cardId)
    const cardRollCostLength = getCardTotalCostLength(ctx, cardId)
    const costConditions: { [key: string]: Condition } = (prototype.category != "グラフィック") ? {
        [TipFn.createTotalCostKey()]: {
            actions: [
                {
                    title: ["合計国力〔x〕", cardRollCostLength]
                }
            ]
        },
    } : {}
    const rollCostConditions = createRollCostConditions(ctx, prototype, prototype.rollCost || [], 0)
    const characterConditions: { [key: string]: Condition } = (prototype.category == "キャラクター" || prototype.category == "オペレーション(ユニット)") ? {
        [TipFn.createCharacterTargetUnitKey()]: {
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
    return conditions
}