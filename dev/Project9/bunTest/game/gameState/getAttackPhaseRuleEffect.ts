import { Bridge } from "../../script/bridge";
import { BaKeyword } from "../define/BaSyou";
import { Effect } from "../define/Effect";
import { PlayerID } from "../define/PlayerID";
import { StrBaSyouPair, Tip } from "../define/Tip";
import { ToolFn } from "../tool";
import { getCardBattleArea } from "./card";
import { GameState } from "./GameState";
import { getItemBaSyou } from "./ItemTableComponent";
import { isPlayerHasBattleGroup } from "./player";
import { getRuntimeBattleArea } from "./RuntimeBattleAreaComponent";

export function getAttackPhaseRuleEffect(ctx: GameState, playerId: PlayerID): Effect {
    return {
        id: ToolFn.getUUID("getAttackPhaseRuleEffect"),
        reason: ["GameRule", playerId],
        text: {
            id: ToolFn.getUUID("getAttackPhaseRuleEffect"),
            title: [],
            conditions: {
                "去地球": {
                    title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip[] {
                        const currentBaKw: BaKeyword = "戦闘エリア1"
                        const runtimeBattleArea = getRuntimeBattleArea(ctx, currentBaKw)
                        if (runtimeBattleArea == "宇宙エリア") {
                            return []
                        }
                        const playerId = DefineFn.EffectFn.getPlayerID(effect)
                        const opponentPlayerId = DefineFn.PlayerIDFn.getOpponent(playerId)
                        const cardIds = GameStateFn.getCardLikeItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.of(playerId, "配備エリア"))
                        let unitIds = cardIds
                            .filter(cardId => GameStateFn.getSetGroupRoot(ctx, cardId))
                            .filter(cardId => getCardBattleArea(ctx, cardId).includes(runtimeBattleArea))
                        if (isPlayerHasBattleGroup(ctx, opponentPlayerId)) {
                            const opponentUnitIds = GameStateFn.getBattleGroup(ctx, DefineFn.AbsoluteBaSyouFn.of(opponentPlayerId, currentBaKw));
                            if (GameStateFn.isABattleGroup(ctx, ["高機動"], opponentUnitIds[0])) {
                                unitIds = unitIds.filter(id => GameStateFn.isABattleGroup(ctx, ["高機動"], id))
                            }
                        }
                        const pairs = unitIds.map(id => {
                            return [id, getItemBaSyou(ctx, id)] as StrBaSyouPair
                        })
                        return [
                            {
                                title: ["カード", pairs, []],
                            }
                        ]
                    }.toString()
                },
                "去宇宙": {
                    title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip[] {
                        const currentBaKw: BaKeyword = "戦闘エリア2"
                        const runtimeBattleArea = getRuntimeBattleArea(ctx, currentBaKw)
                        if (runtimeBattleArea == "地球エリア") {
                            return []
                        }
                        const playerId = DefineFn.EffectFn.getPlayerID(effect)
                        const opponentPlayerId = DefineFn.PlayerIDFn.getOpponent(playerId)
                        const cardIds = GameStateFn.getCardLikeItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.of(playerId, "配備エリア"))
                        let unitIds = cardIds
                            .filter(cardId => GameStateFn.getSetGroupRoot(ctx, cardId))
                            .filter(cardId => getCardBattleArea(ctx, cardId).includes(runtimeBattleArea))
                        if (isPlayerHasBattleGroup(ctx, opponentPlayerId)) {
                            const opponentUnitIds = GameStateFn.getBattleGroup(ctx, DefineFn.AbsoluteBaSyouFn.of(opponentPlayerId, currentBaKw));
                            if (GameStateFn.isABattleGroup(ctx, ["高機動"], opponentUnitIds[0])) {
                                unitIds = unitIds.filter(id => GameStateFn.isABattleGroup(ctx, ["高機動"], id))
                            }
                        }
                        const pairs = unitIds.map(id => {
                            return [id, getItemBaSyou(ctx, id)] as StrBaSyouPair
                        })
                        return [
                            {
                                title: ["カード", pairs, []],
                            }
                        ]
                    }.toString()
                }
            },
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                
                                return ctx
                            }.toString()
                        }
                    ]
                }
            ]
        }
    }
}