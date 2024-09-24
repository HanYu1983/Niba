import { pipe, always, map, sum, dissoc } from "ramda"
import { Bridge } from "../../script/bridge"
import { CardColorFn, CardColor, CardPrototypeRollCost, CardPrototype } from "../define/CardPrototype"
import { Condition, createRollCostRequire } from "../define/CardText"
import { Effect } from "../define/Effect"
import { getCardHasSpeicalEffect, getCardRollCostLength } from "./card"
import { GameState } from "./GameState"
import { getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { getItemPrototype, getItemOwner } from "./ItemTableComponent"
import { log } from "../../tool/logger"

export function createConditionKeyOfPayColorX(proto: CardPrototype): string {
    if (proto.color == null) {
        throw new Error()
    }
    return `${proto.color}X`
}

export function createRollCostConditions(ctx: GameState, proto: CardPrototype, rollCost: CardPrototypeRollCost): { [key: string]: Condition } {
    if (rollCost == "X") {
        if (proto.color == null) {
            throw new Error()
        }
        return {
            [createConditionKeyOfPayColorX(proto)]: {
                title: ["RollColor", proto.color]
            }
        }
    }
    const rollCostConditions = CardColorFn.getAll()
        .map(tc => createRollCostRequire(rollCost.filter(c => c == tc).length, tc))
        .reduce((ctx, cons) => ({ ...ctx, ...cons }))
    return rollCostConditions
}

export function getPlayCardEffects(ctx: GameState, cardId: string): Effect[] {
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
            title: ["_自軍_ユニット_１枚", "自軍", "ユニット", 1],
        }
    } : {}
    const commandConditions: { [key: string]: Condition } = (prototype.category == "コマンド" && prototype.commandText) ? {
        ...prototype.commandText.conditions
    } : {}
    const rollCostConditions = createRollCostConditions(ctx, prototype, prototype.rollCost || [])
    // 注意, 這裡的effect.id是用函數名為前綴+卡片ID, 必須是唯一的
    const playCardEffect: Effect = {
        id: `getPlayCardEffects_${cardId}`,
        reason: ["PlayCard", playerId, cardId],
        description: "從手中即將出牌, 出牌後會產生場出的效果",
        text: {
            id: `getPlayCardEffects_text_${cardId}`,
            title: ["使用型", ["配備フェイズ"]],
            description: "從手中即將出牌, 出牌後會產生場出的效果",
            conditions: {
                ...costConditions,
                ...characterConditions,
                ...commandConditions,
                ...rollCostConditions,
            },
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                const prototype = GameStateFn.getItemPrototype(ctx, cardId)
                                const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                ctx = GameStateFn.moveItem(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from]) as GameState
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
                                                                ctx = GameStateFn.moveItem(ctx, to, [cardId, from]) as GameState
                                                                const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx, ["戦闘配備"], cardId)
                                                                const hasPS = GameStateFn.getCardHasSpeicalEffect(ctx, ["PS装甲"], cardId)
                                                                const isNoNeedRoll = (hasHigh || hasPS)
                                                                const isRoll = isNoNeedRoll == false
                                                                ctx = GameStateFn.setItemIsRoll(ctx, isRoll, [cardId, to]) as GameState
                                                                ctx = GameStateFn.triggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
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
                                                                const [targetCardId, targetBasyou] = pairs[0]
                                                                const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                                                const to = targetBasyou
                                                                ctx = GameStateFn.moveItem(ctx, to, [cardId, from]) as GameState
                                                                ctx = GameStateFn.setSetGroupParent(ctx, targetCardId, cardId) as GameState
                                                                ctx = GameStateFn.triggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
                                                                ctx = GameStateFn.triggerEvent(ctx, { title: ["プレイされて場にセットされた場合"], cardIds: [cardId] })
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
                                            id: prototype.commandText?.id || ToolFn.getUUID("getPlayCardEffects"),
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
                                                                ctx = GameStateFn.moveItem(ctx, to, [cardId, from]) as GameState
                                                                ctx = GameStateFn.triggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
                                                                return ctx
                                                            }.toString()
                                                        },
                                                        ...prototype.commandText?.logicTreeActions?.[0].actions || [],
                                                    ]
                                                },
                                                ...prototype.commandText?.logicTreeActions?.slice(1) || []
                                            ]
                                        }
                                    }) as GameState
                                }

                                if (prototype.category == "グラフィック") {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "Gゾーン")
                                    ctx = GameStateFn.moveItem(ctx, to, [cardId, from]) as GameState
                                    ctx = GameStateFn.triggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
                                    return ctx
                                }

                                if (prototype.category == "オペレーション") {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "配備エリア")
                                    ctx = GameStateFn.moveItem(ctx, to, [cardId, from]) as GameState
                                    ctx = GameStateFn.triggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
                                    return ctx
                                }

                                if (prototype.category == "ACE") {
                                    throw new Error(`not support category: ${prototype.category}`)
                                }
                                return ctx
                            }.toString()
                        }
                    ]
                }
            ]
        }
    }
    const ret = [playCardEffect]
    const ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    const morePlayEfs = ges.filter(g => g.title[0] == "合計国力＋(１)してプレイできる" && g.cardIds.includes(cardId))
    const hasMorePlay = morePlayEfs.length > 0
    const addedLength = pipe(always(morePlayEfs), map(g => g.title[0] == "合計国力＋(１)してプレイできる" ? g.title[1] : 0), sum)()
    if (hasMorePlay) {
        const morePlayCardEffect: Effect = {
            ...playCardEffect,
            text: {
                ...playCardEffect.text,
                conditions: {
                    ...playCardEffect.text.conditions,
                    "合計国力〔x〕": {
                        actions: [
                            {
                                title: ["合計国力〔x〕", cardRollCostLength + addedLength]
                            }
                        ]
                    }
                },
            }
        }
        morePlayCardEffect.text.logicTreeActions = JSON.parse(JSON.stringify(playCardEffect.text.logicTreeActions))
        if (morePlayCardEffect.text.logicTreeActions?.[0] == null) {
            throw new Error(`morePlayCardEffect.text.logicTreeActions?.[0] == null`)
        }
        morePlayCardEffect.text.logicTreeActions[0].actions.push({
            title: function _(ctx: GameState, effect: Effect, { GameStateFn, DefineFn }: Bridge): GameState {
                const { addedLength } = { addedLength: 0 }
                const cardId = DefineFn.EffectFn.getCardID(effect)
                let cs = GameStateFn.getItemState(ctx, cardId)
                cs = DefineFn.ItemStateFn.setMoreTotalRollCostLengthPlay(cs, addedLength)
                ctx = GameStateFn.setItemState(ctx, cardId, cs) as GameState
                return ctx
            }.toString().replace("{ addedLength: 0 }", `{addedLength: ${addedLength}}`)
        })
        ret.push(morePlayCardEffect)
    }
    if (prototype.category == "キャラクター" && getCardHasSpeicalEffect(ctx, ["ステイ"], cardId)) {
        const morePlayCardEffect: Effect = {
            ...playCardEffect,
            text: {
                ...playCardEffect.text,
                conditions: {
                    ...dissoc("一個自軍機體", playCardEffect.text.conditions || {})
                },
                logicTreeActions: [
                    {
                        actions: [
                            {
                                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "配備エリア")
                                    ctx = GameStateFn.moveItem(ctx, to, [cardId, from]) as GameState
                                    ctx = GameStateFn.triggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] })
                                    return ctx
                                }.toString()
                            }
                        ]
                    }
                ]
            }
        }
    }
    return ret
}

