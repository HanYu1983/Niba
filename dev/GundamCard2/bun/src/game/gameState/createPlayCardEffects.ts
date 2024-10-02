import { pipe, always, map, sum, dissoc } from "ramda"
import { Bridge } from "../../script/bridge"
import { CardColorFn, CardColor, CardPrototypeRollCost, CardPrototype } from "../define/CardPrototype"
import { CardTextFn, Condition, createRollCostRequire } from "../define/CardText"
import { Effect } from "../define/Effect"
import { getCardHasSpeicalEffect, getCardRollCostLength } from "./card"
import { GameState } from "./GameState"
import { getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { getItemPrototype, getItemOwner } from "./ItemTableComponent"
import { logCategory } from "../../tool/logger"
import { LogicTree } from "../../tool/logicTree"
import { getCard } from "./CardTableComponent"
import { BaSyouKeywordFn } from "../define/BaSyou"
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
    const prototype = getItemPrototype(ctx, cardId)
    const playerId = getItemOwner(ctx, cardId)
    const cardRollCostLength = getCardRollCostLength(ctx, cardId)
    const costConditions: { [key: string]: Condition } = (prototype.category != "グラフィック") ? {
        "合計国力〔x〕": {
            actions: [
                {
                    title: ["合計国力〔x〕", cardRollCostLength]
                }
            ]
        },
    } : {}
    const characterConditions: { [key: string]: Condition } = (prototype.category == "キャラクター" || prototype.category == "オペレーション(ユニット)") ? {
        "一個自軍機體": {
            title: ["Entity", { at: ["配備エリア"], isCanSetCharacter: true, side: "自軍", is: ["ユニット"], count: 1 }],
        }
    } : {}
    const rollCostConditions = createRollCostConditions(ctx, prototype, prototype.rollCost || [], 0)
    const conditions: { [key: string]: Condition } = {
        ...costConditions,
        ...characterConditions,
        ...rollCostConditions,
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
    const playCardEffect: Effect = {
        id: `createPlayCardEffects_${cardId}`,
        reason: ["PlayCard", playerId, cardId],
        description: "Play",
        text: {
            id: `createPlayCardEffects_text_${cardId}`,
            // 以下的title只是為了log，沒有實際作用
            title: prototype.commandText?.title || ["使用型", ["自軍", "配備フェイズ"]],
            description: "Play",
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
                                                                const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx, ["戦闘配備"], cardId)
                                                                const hasPS = GameStateFn.getCardHasSpeicalEffect(ctx, ["PS装甲"], cardId)
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
                                    }) as GameState
                                }

                                if (prototype.category == "キャラクター" || prototype.category == "オペレーション(ユニット)") {
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
                                    }) as GameState
                                }

                                if (prototype.category == "コマンド") {
                                    return GameStateFn.addStackEffect(ctx, {
                                        id: ToolFn.getUUID("getPlayCardEffects"),
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
    const ret = [playCardEffect]
    const ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    {
        const morePlayEfs = ges.filter(g => (g.title[0] == "合計国力＋(１)してプレイできる" || g.title[0] == "合計国力＋_、ロールコスト＋_してプレイできる") && g.cardIds.includes(cardId))
        const hasTotolCostPlusPlay = morePlayEfs.length > 0
        if (hasTotolCostPlusPlay) {
            // 取得原始條件
            let copyOriginCondition = playCardEffect.text.conditions || {}
            logCategory("createPlayCardEffects", "copyOriginCondition start", Object.keys(copyOriginCondition))
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
                logCategory("createPlayCardEffects", "copyOriginCondition step 2", Object.keys(copyOriginCondition))
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
                    id: `totalCostPlusPlayEffect_text_${cardId}`,
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
                // logCategory("createPlayCardEffects", "totalCostPlusPlayEffect.id", totalCostPlusPlayEffect.id)
                // logCategory("createPlayCardEffects", "totalCostPlusPlayEffect.text.id", totalCostPlusPlayEffect.text.id)
                logCategory("createPlayCardEffects", "copyOriginCondition after", Object.keys(copyOriginCondition))
                //logCategory("createPlayCardEffects", "logicTree", logicTree)
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
    if (prototype.category == "キャラクター" && getCardHasSpeicalEffect(ctx, ["ステイ"], cardId)) {
        let stayPlayEffect: Effect = JSON.parse(JSON.stringify(playCardEffect))
        stayPlayEffect = {
            ...stayPlayEffect,
            id: `stayPlayEffect_${cardId}`,
            description: "ステイ",
            text: {
                ...stayPlayEffect.text,
                id: `stayPlayEffect_text_${cardId}`,
                description: "ステイ",
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
                                    return ctx
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

