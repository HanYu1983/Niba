import { pipe, always, map, sum } from "ramda"
import { Bridge } from "../../script/bridge"
import { Effect, EffectFn } from "../define/Effect"
import { GameState } from "./GameState"
import { getItemPrototype, getItemOwner, getItemController } from "./ItemTableComponent"
import { TargetMissingError } from "../define/GameError"

export function getPlayGEffects(ctx: GameState, cardId: string): Effect {
    const playerId = getItemOwner(ctx, cardId)
    const effect: Effect = {
        id: `getPlayCardEffects_${cardId}`,
        reason: ["PlayCard", playerId, cardId],
        description: "PlayG",
        text: {
            id: `getPlayCardEffects_text_${cardId}`,
            title: [],
            conditions: {
                "出G上限": {
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                const cardController = GameStateFn.getItemController(ctx, cardId)
                                const ps = GameStateFn.getPlayerState(ctx, cardController)
                                if (ps.playGCount > 0) {
                                    throw new DefineFn.TargetMissingError(`出G上限: ${ps.playGCount}`)
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
                                ctx = GameStateFn.moveItem(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "Gゾーン"), [cardId, from]) as GameState
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
    }
    return effect
}