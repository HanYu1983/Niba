import { Bridge } from "../../script/bridge";
import { BaKeyword } from "../define/BaSyou";
import { Effect } from "../define/Effect";
import { PlayerID } from "../define/PlayerID";
import { StrBaSyouPair, Tip } from "../define/Tip";
import { ToolFn } from "../tool";
import { GameState } from "./GameState";

export function getAttackPhaseRuleEffect(ctx: GameState, playerId: PlayerID): Effect {
    return {
        id: ToolFn.getUUID("getAttackPhaseRuleEffect"),
        reason: ["GameRule", playerId],
        isOption: true,
        text: {
            id: ToolFn.getUUID("getAttackPhaseRuleEffect"),
            title: [],
            conditions: {
                "去地球": {
                    title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip | null {
                        const currentBaKw: BaKeyword = "戦闘エリア1"
                        const runtimeBattleArea = GameStateFn.getRuntimeBattleArea(ctx, currentBaKw)
                        if (runtimeBattleArea == "宇宙エリア") {
                            return null
                        }
                        const playerId = DefineFn.EffectFn.getPlayerID(effect)
                        const opponentPlayerId = DefineFn.PlayerIDFn.getOpponent(playerId)
                        const cardIds = GameStateFn.getItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.of(playerId, "配備エリア"))
                        let unitIds = cardIds
                            .filter(cardId => GameStateFn.getSetGroupRoot(ctx, cardId))
                            .filter(cardId => GameStateFn.getCardBattleArea(ctx, cardId).includes(runtimeBattleArea))
                        const opponentUnitIds = GameStateFn.getBattleGroup(ctx, DefineFn.AbsoluteBaSyouFn.of(opponentPlayerId, currentBaKw));
                        if (opponentUnitIds.length) {
                            if (GameStateFn.isABattleGroup(ctx, ["高機動"], opponentUnitIds[0])) {
                                unitIds = unitIds.filter(id => GameStateFn.isABattleGroup(ctx, ["高機動"], id))
                            }
                        }
                        const pairs = unitIds.map(id => {
                            return [id, GameStateFn.getItemBaSyou(ctx, id)] as StrBaSyouPair
                        })
                        return {
                            title: ["カード", pairs, pairs],
                        }
                    }.toString(),
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                const playerId = DefineFn.EffectFn.getPlayerID(effect)
                                const fackCardId = DefineFn.EffectFn.getCardID(effect)
                                const earthPairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "去地球", fackCardId)
                                for (const pair of earthPairs) {
                                    ctx = GameStateFn.moveItem(ctx, DefineFn.AbsoluteBaSyouFn.of(playerId, "戦闘エリア1"), pair) as GameState
                                }
                                return ctx
                            }.toString()
                        }
                    ]
                },
                "去宇宙": {
                    title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip | null {
                        const currentBaKw: BaKeyword = "戦闘エリア2"
                        const runtimeBattleArea = GameStateFn.getRuntimeBattleArea(ctx, currentBaKw)
                        if (runtimeBattleArea == "地球エリア") {
                            return null
                        }
                        const playerId = DefineFn.EffectFn.getPlayerID(effect)
                        const opponentPlayerId = DefineFn.PlayerIDFn.getOpponent(playerId)
                        const cardIds = GameStateFn.getItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.of(playerId, "配備エリア"))
                        let unitIds = cardIds
                            .filter(cardId => GameStateFn.getSetGroupRoot(ctx, cardId))
                            .filter(cardId => GameStateFn.getCardBattleArea(ctx, cardId).includes(runtimeBattleArea))
                        const opponentUnitIds = GameStateFn.getBattleGroup(ctx, DefineFn.AbsoluteBaSyouFn.of(opponentPlayerId, currentBaKw));
                        if (opponentUnitIds.length) {
                            if (GameStateFn.isABattleGroup(ctx, ["高機動"], opponentUnitIds[0])) {
                                unitIds = unitIds.filter(id => GameStateFn.isABattleGroup(ctx, ["高機動"], id))
                            }
                        }
                        const pairs = unitIds.map(id => {
                            return [id, GameStateFn.getItemBaSyou(ctx, id)] as StrBaSyouPair
                        })
                        return {
                            title: ["カード", pairs, pairs],
                        }
                    }.toString(),
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                const playerId = DefineFn.EffectFn.getPlayerID(effect)
                                const fackCardId = DefineFn.EffectFn.getCardID(effect)
                                const spacePairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "去宇宙", fackCardId)
                                for (const pair of spacePairs) {
                                    ctx = GameStateFn.moveItem(ctx, DefineFn.AbsoluteBaSyouFn.of(playerId, "戦闘エリア2"), pair) as GameState
                                }
                                ctx = GameStateFn.setNextPhase(ctx) as GameState
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
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                //ctx = GameStateFn.setNextPhase(ctx) as GameState
                                return ctx
                            }.toString()
                        }
                    ]
                }
            ]
        }
    }
}