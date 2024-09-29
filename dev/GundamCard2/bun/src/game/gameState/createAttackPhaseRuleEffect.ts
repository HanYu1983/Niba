import { Bridge } from "../../script/bridge";
import { BaKeyword } from "../define/BaSyou";
import { Effect } from "../define/Effect";
import { PlayerID } from "../define/PlayerID";
import { StrBaSyouPair, Tip } from "../define/Tip";
import { ToolFn } from "../tool";
import { GameState } from "./GameState";

export function createAttackPhaseRuleEffect(ctx: GameState, playerId: PlayerID): Effect {
    return {
        id: `createAttackPhaseRuleEffect_${playerId}`,
        reason: ["GameRule", playerId],
        isOption: true,
        text: {
            id: `createAttackPhaseRuleEffect_text_${playerId}`,
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
                            .filter(cardId => GameStateFn.getSetGroupRoot(ctx, cardId) == cardId)
                            .filter(cardId => GameStateFn.getCardBattleArea(ctx, cardId).includes(runtimeBattleArea))
                            .filter(cardId => GameStateFn.getCard(ctx, cardId).isRoll != true)
                        const opponentUnitIds = GameStateFn.getBattleGroup(ctx, DefineFn.AbsoluteBaSyouFn.of(opponentPlayerId, currentBaKw));
                        if (opponentUnitIds.length) {
                            if (GameStateFn.isBattleGroupHasA(ctx, ["高機動"], opponentUnitIds[0])) {
                                unitIds = unitIds.filter(id => GameStateFn.isBattleGroupHasA(ctx, ["高機動"], id))
                            }
                        }
                        const pairs = unitIds.map(id => {
                            return [id, GameStateFn.getItemBaSyou(ctx, id)] as StrBaSyouPair
                        })
                        return {
                            title: ["カード", pairs, []],
                        }
                    }.toString(),
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                const playerId = DefineFn.EffectFn.getPlayerID(effect)
                                const fackCardId = DefineFn.EffectFn.getCardID(effect)
                                const earthPairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "去地球", fackCardId)
                                for (const pair of earthPairs) {
                                    ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(playerId, "戦闘エリア1"), pair) as GameState
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
                            .filter(cardId => GameStateFn.getSetGroupRoot(ctx, cardId) == cardId)
                            .filter(cardId => GameStateFn.getCardBattleArea(ctx, cardId).includes(runtimeBattleArea))
                            .filter(cardId => GameStateFn.getCard(ctx, cardId).isRoll != true)
                        const opponentUnitIds = GameStateFn.getBattleGroup(ctx, DefineFn.AbsoluteBaSyouFn.of(opponentPlayerId, currentBaKw));
                        if (opponentUnitIds.length) {
                            if (GameStateFn.isBattleGroupHasA(ctx, ["高機動"], opponentUnitIds[0])) {
                                unitIds = unitIds.filter(id => GameStateFn.isBattleGroupHasA(ctx, ["高機動"], id))
                            }
                        }
                        const pairs = unitIds.map(id => {
                            return [id, GameStateFn.getItemBaSyou(ctx, id)] as StrBaSyouPair
                        })
                        return {
                            title: ["カード", pairs, []],
                        }
                    }.toString(),
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                const playerId = DefineFn.EffectFn.getPlayerID(effect)
                                const fackCardId = DefineFn.EffectFn.getCardID(effect)
                                const spacePairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "去宇宙", fackCardId)
                                for (const pair of spacePairs) {
                                    ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(playerId, "戦闘エリア2"), pair) as GameState
                                }
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
                                const fackCardId = DefineFn.EffectFn.getCardID(effect)
                                const phase = GameStateFn.getPhase(ctx)
                                const pairs1 = GameStateFn.getCardTipStrBaSyouPairs(ctx, "去地球", fackCardId)
                                const pairs2 = GameStateFn.getCardTipStrBaSyouPairs(ctx, "去宇宙", fackCardId)
                                if (DefineFn.PhaseFn.eq(phase, ["戦闘フェイズ", "攻撃ステップ", "規定の効果"])) {
                                    ctx = GameStateFn.doTriggerEvent(ctx, {
                                        title: ["このカードが攻撃に出撃した場合"],
                                        cardIds: [...pairs1, ...pairs2].map(p => p[0])
                                    })
                                }
                                return ctx
                            }.toString()
                        }
                    ]
                }
            ]
        }
    }
}