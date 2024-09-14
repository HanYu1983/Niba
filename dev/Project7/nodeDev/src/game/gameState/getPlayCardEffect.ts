import { Bridge } from "../../script/bridge"
import { Effect } from "../define/Effect"
import { PlayerID } from "../define/PlayerID"
import { GameState } from "./GameState"

export function getPlayCardEffect(ctx: GameState, playerId: PlayerID, cardId: string): Effect {
    return {
        id: "",
        reason: ["PlayCard", playerId, cardId],
        text: {
            title: [],
            conditions: {
                "1": {
                    title: ["total(x)", 3],
                    actions: [
                        {
                            title: ["(このカード)を(リロール)する", ["abc"], "リロール"]
                        }
                    ]
                },
                "2": {
                    title: ["c(x)", "白", 2],
                    actions: [
                        {
                            title: ["(このカード)を(リロール)する", ["abc"], "リロール"]
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
                                const from = GameStateFn.getCardBaSyou(ctx, cardId)
                                ctx = GameStateFn.moveCard(ctx, from, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId]) as GameState
                                return GameStateFn.addStackEffect(ctx, {
                                    id: "",
                                    reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                                    text: {
                                        title: [],
                                        logicTreeCommands: [
                                            {
                                                actions: [
                                                    {
                                                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                                            const cardId = DefineFn.EffectFn.getCardID(effect)
                                                            const from = GameStateFn.getCardBaSyou(ctx, cardId)
                                                            ctx = GameStateFn.moveCard(ctx, from, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "配備エリア"), [cardId]) as GameState
                                                            return ctx
                                                        }.toString()
                                                    },
                                                    {
                                                        title: ["(このカード)を(リロール)する", [DefineFn.EffectFn.getCardID(effect)], "ロール"]
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
}