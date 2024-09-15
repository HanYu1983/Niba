import { always, map, pipe, sum } from "ramda"
import { Bridge } from "../../script/bridge"
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou"
import { Effect } from "../define/Effect"
import { PlayerA, PlayerID } from "../define/PlayerID"
import { ToolFn } from "../tool"
import { addCards, createCardWithProtoIds } from "./CardTableComponent"
import { clearGlobalEffects, createGameState, doEffect, GameState, getCardIdsCanPayRollCost, getCardRollCost, getCardRollCostLength, getEffectTips, getGlobalEffects } from "./GameState"
import { getItemBaSyou, getItemIds, getItemIdsByBasyou } from "./ItemTableComponent"
import { Tip } from "../define/Tip"
import { loadPrototype } from "../../script"
import { getTopEffect } from "./EffectStackComponent"

export function getPlayCardEffects(ctx: GameState, playerId: PlayerID, cardId: string): Effect[] {
    const cardRollCostLength = getCardRollCostLength(ctx, cardId)
    const playCardEffect: Effect = {
        reason: ["PlayCard", playerId, cardId],
        text: {
            id: "",
            title: [],
            conditions: {
                "合計国力〔x〕": {
                    title: ["合計国力〔x〕", cardRollCostLength]
                },
                // "rollCost": {
                //     title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip[] {
                //         const rollCost = GameStateFn.getCardRollCost(ctx, cardId)
                //         const canRollCardIds = GameStateFn.getCardIdsCanPayRollCost(ctx, playerId, null)
                //         const pairs = canRollCardIds.map(cardId => {
                //             return [cardId, GameStateFn.getItemBaSyou(ctx, cardId)] as [string, AbsoluteBaSyou]
                //         })
                //         return [{ title: ["カード", pairs, pairs] }]
                //     }.toString(),
                //     actions: [
                //         {
                //             title: ["(このカード)を(リロール)する", [], "リロール"]
                //         }
                //     ]
                // }
            },
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                ctx = GameStateFn.moveItem(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from]) as GameState
                                return GameStateFn.addStackEffect(ctx, {
                                    reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                                    text: {
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
                                                            ctx = GameStateFn.setItemIsRoll(ctx, true, [cardId, to]) as GameState
                                                            return ctx
                                                        }.toString()
                                                    }
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
    let ret = [playCardEffect]
    const ges = getGlobalEffects(ctx, null)
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
                }
            }
        }
        ret = [...ret, morePlayCardEffect]
    }
    return ret
}

export async function testGetPlayCardEffect() {
    await loadPrototype("179028_10D_U_WT181N_white")
    let ctx = createGameState()
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), ["179028_10D_U_WT181N_white"]) as GameState
    const cardIds = getItemIds(ctx)
    if (cardIds.length == 0) {
        throw new Error('must has one card')
    }
    const cardId = cardIds[0]
    const playCardEffects = getPlayCardEffects(ctx, PlayerA, cardId)
    if (playCardEffects.length != 2) {
        throw new Error(`playCardEffects.length != 2`)
    }
    const useEffect = playCardEffects[1]
    const tips = getEffectTips(ctx, useEffect, 0, 0)
    if (tips[0]?.title[0] == "合計国力〔x〕" && tips[0]?.min == 5) {
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "プレイされているカード")).length != 0) {
            throw new Error(`getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "プレイされているカード")).length != 0`)
        }
        ctx = doEffect(ctx, useEffect, 0, 0)
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "プレイされているカード")).length != 1) {
            throw new Error(`getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "プレイされているカード")).length != 1`)
        }
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error(`effect == null`)
        }
        if (effect.reason[0] != "場に出る") {
            throw new Error(`effect.reason[0]!="場に出る`)
        }
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア")).length != 0) {
            throw new Error(`getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア")).length != 0`)
        }
        ctx = doEffect(ctx, effect, 0, 0)
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア")).length != 1) {
            throw new Error(`getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア")).length != 1`)
        }
    } else {
        throw new Error(`tips[0]?.title[0]=="合計国力〔x〕" && tips[0]?.min ==5`)
    }
}