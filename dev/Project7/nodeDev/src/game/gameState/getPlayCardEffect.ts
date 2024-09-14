import { always, map, pipe, sum } from "ramda"
import { Bridge } from "../../script/bridge"
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou"
import { Effect } from "../define/Effect"
import { PlayerA, PlayerID } from "../define/PlayerID"
import { ToolFn } from "../tool"
import { addCards, createCardWithProtoIds } from "./CardTableComponent"
import { DEFAULT_GAME_STATE, GameState, getCardCanPayRollCost, getCardRollCost, getCardRollCostLength, getGlobalEffects } from "./GameState"
import { getItemBaSyou, getItemIds } from "./ItemTableComponent"
import { Tip } from "../define/Tip"
import { loadPrototype } from "../../script"

export function getPlayCardEffect(ctx: GameState, playerId: PlayerID, cardId: string): Effect[] {
    const cardRollCostLength = getCardRollCostLength(ctx, cardId)

    const playCardEffect: Effect = {
        id: ToolFn.getUUID("getPlayCardEffect"),
        reason: ["PlayCard", playerId, cardId],
        text: {
            id: "",
            title: [],
            conditions: {
                "合計国力〔x〕": {
                    title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip[] {
                        const rollCost = getCardRollCost(ctx, cardId)
                        return []
                    }.toString(),
                },
                "rollCost": {
                    title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip[] {
                        //const ges = GameStateFn.getSituationEffects(ctx, null)
                        const rollCost = GameStateFn.getCardRollCost(ctx, cardId)
                        const canRollCardIds = GameStateFn.getCardCanPayRollCost(ctx, playerId, null)
                        const pairs = canRollCardIds.map(cardId => {
                            return [cardId, GameStateFn.getItemBaSyou(ctx, cardId)] as [string, AbsoluteBaSyou]
                        })
                        return [{ title: ["カード", pairs, pairs] }]
                    }.toString(),
                    actions: [
                        {
                            title: ["(このカード)を(リロール)する", [], "リロール"]
                        }
                    ]
                }
            },
            logicTreeCommands: [
                {
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                ctx = GameStateFn.moveItem(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from]) as GameState
                                return GameStateFn.addStackEffect(ctx, {
                                    id: ToolFn.getUUID("場に出る"),
                                    reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                                    text: {
                                        id: "",
                                        title: [],
                                        logicTreeCommands: [
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
    await loadPrototype("179024_03B_U_WT042U_white")
    let ctx = DEFAULT_GAME_STATE
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), ["179024_03B_U_WT042U_white"]) as GameState
    const cardIds = getItemIds(ctx)
    if (cardIds.length == 0) {
        throw new Error('must has one card')
    }
    const cardId = cardIds[0]
    const playCardEffect = getPlayCardEffect(ctx, PlayerA, cardId)
    console.log(JSON.stringify(playCardEffect, null, 2))
    //ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"))
    //ctx = addCards
}