import { always, map, pipe, sum } from "ramda"
import { Bridge } from "../../script/bridge"
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou"
import { Effect } from "../define/Effect"
import { PlayerA, PlayerID } from "../define/PlayerID"
import { addCards, createCardWithProtoIds, getCardOwner } from "./CardTableComponent"
import { createGameState, GameState } from "./GameState"
import { getItemBaSyou, getItemIds, getItemIdsByBasyou, getItemOwner, getItemPrototype } from "./ItemTableComponent"
import { loadPrototype } from "../../script"
import { getTopEffect } from "./EffectStackComponent"
import { BattlePointFn } from "../define/BattlePoint"
import { Condition } from "../define/CardText"
import { StrBaSyouPair } from "../define/Tip"
import { PhaseFn } from "../define/Timing"
import { getItemState } from "./ItemStateComponent"
import { clearGlobalEffects, getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { getCardBattlePoint, getCardRollCostLength } from "./card"
import { doEffect, getEffectTips } from "./effect"
import { triggerEvent } from "./triggerEvent"
import { CardColor, CardColorFn } from "../define/CardPrototype"


export function getPlayCardEffects(ctx: GameState, cardId: string): Effect[] {
    const prototype = getItemPrototype(ctx, cardId)
    const playerId = getItemOwner(ctx, cardId)
    const cardRollCostLength = getCardRollCostLength(ctx, cardId)
    const costConditions: { [key: string]: Condition } = (prototype.category != "グラフィック") ? {
        "合計国力〔x〕": {
            title: ["合計国力〔x〕", cardRollCostLength]
        },
    } : {}
    const characterConditions: { [key: string]: Condition } = (prototype.category == "キャラクター" || prototype.category == "オペレーション(unit)") ? {
        "unitForSet": {
            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                // TODO check character can set
                return ctx
            }.toString()
        }
    } : {}
    const commandConditions: { [key: string]: Condition } = (prototype.category == "コマンド" && prototype.commandText) ? {
        ...prototype.commandText.conditions
    } : {}
    const rollCostConditions = CardColorFn.getAll()
        .map(tc => createRollCostRequire(prototype.rollCost.filter(c => c == tc).length, tc))
        .reduce((ctx, cons) => ({ ...ctx, ...cons }))
    const playCardEffect: Effect = {
        reason: ["PlayCard", playerId, cardId],
        text: {
            id: "",
            title: [],
            conditions: {
                ...costConditions,
                ...characterConditions,
                ...commandConditions,
                ...rollCostConditions
            },
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                const prototype = GameStateFn.getItemPrototype(ctx, cardId)
                                const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                ctx = GameStateFn.moveItem(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from]) as GameState
                                if (prototype.category == "ユニット") {
                                    return GameStateFn.addStackEffect(ctx, {
                                        id: "",
                                        reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                                        text: {
                                            id: "",
                                            title: [],
                                            logicTreeActions: [
                                                {
                                                    actions: [
                                                        {
                                                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                                                const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                                                const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "配備エリア")
                                                                ctx = GameStateFn.moveItem(ctx, to, [cardId, from], GameStateFn.onMoveItem) as GameState
                                                                const shouldRoll = GameStateFn.getCardHasSpeicalEffect(ctx, ["戦闘配備"], cardId) == false
                                                                ctx = GameStateFn.setItemIsRoll(ctx, shouldRoll, [cardId, to]) as GameState
                                                                return ctx
                                                            }.toString()
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }) as GameState
                                }

                                if (prototype.category == "キャラクター" || prototype.category == "オペレーション(unit)") {
                                    return GameStateFn.addStackEffect(ctx, {
                                        reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                                        text: {
                                            id: "",
                                            title: [],
                                            logicTreeActions: [
                                                {
                                                    actions: [
                                                        {
                                                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                                                const cs = GameStateFn.getItemState(ctx, cardId)
                                                                const tip = DefineFn.ItemStateFn.getTip(cs, "unitForSet")
                                                                const tipError = DefineFn.TipFn.checkTipSatisfies(tip)
                                                                if (tipError) throw tipError
                                                                const pairs = DefineFn.TipFn.getSelection(tip) as StrBaSyouPair[]
                                                                const [targetCardId, targetBasyou] = pairs[0]
                                                                const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                                                const to = targetBasyou
                                                                ctx = GameStateFn.moveItem(ctx, to, [cardId, from], GameStateFn.onMoveItem) as GameState
                                                                ctx = GameStateFn.setSetGroupLink(ctx, targetCardId, cardId) as GameState
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
                                        reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                                        text: {
                                            id: "",
                                            title: [],
                                            logicTreeActions: [
                                                {
                                                    actions: [
                                                        {
                                                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                                                const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                                                const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "ジャンクヤード")
                                                                ctx = GameStateFn.moveItem(ctx, to, [cardId, from], GameStateFn.onMoveItem) as GameState
                                                                return ctx
                                                            }.toString()
                                                        },
                                                        ...prototype.commandText?.logicTreeActions?.[0].actions || []
                                                    ]
                                                }
                                            ]
                                        }
                                    }) as GameState
                                }

                                if (prototype.category == "グラフィック") {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "Gゾーン")
                                    return GameStateFn.moveItem(ctx, to, [cardId, from], GameStateFn.onMoveItem) as GameState
                                }

                                if (prototype.category == "オペレーション") {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "配備エリア")
                                    return GameStateFn.moveItem(ctx, to, [cardId, from], GameStateFn.onMoveItem) as GameState
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
                        title: ["合計国力〔x〕", cardRollCostLength + addedLength],
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
    return ret
}

function createRollCostRequire(
    costNum: number,
    color: CardColor | null
): { [key: string]: Condition } {
    return {
        "unitForSet": {
            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                // TODO check character can set
                return ctx
            }.toString(),
            actions: [
                {
                    title: ["(このカード)を(リロール)する", "このカード", "リロール"]
                }
            ]
        }
    };
}