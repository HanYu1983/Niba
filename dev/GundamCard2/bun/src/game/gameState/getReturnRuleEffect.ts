import { Bridge } from "../../script/bridge";
import { AbsoluteBaSyouFn, BaKeyword, BaSyouKeyword } from "../define/BaSyou";
import { Effect } from "../define/Effect";
import { PlayerID } from "../define/PlayerID";
import { ToolFn } from "../tool";
import { GameState } from "./GameState";

export function getReturnRuleEffect(ctx: GameState, playerId: PlayerID): Effect {
    return {
        id: ToolFn.getUUID("getReturnRuleEffect"),
        reason: ["GameRule", playerId],
        text: {
            id: ToolFn.getUUID("getReturnRuleEffect"),
            title: [],
            description: "getReturnRuleEffect",
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                const playerId = DefineFn.EffectFn.getPlayerID(effect)
                                const opponentId = DefineFn.PlayerIDFn.getOpponent(playerId)
                                ctx = _processKw(ctx, playerId, "戦闘エリア1")
                                ctx = _processKw(ctx, playerId, "戦闘エリア2")
                                ctx = _processKw(ctx, opponentId, "戦闘エリア1")
                                ctx = _processKw(ctx, opponentId, "戦闘エリア2")
                                function _processKw(ctx: GameState, playerId: PlayerID, fromKw: BaKeyword): GameState {
                                    const runtimeArea1 = GameStateFn.getRuntimeBattleArea(ctx, fromKw)
                                    const unitIdsAtArea1 = GameStateFn.getItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.of(playerId, fromKw))
                                    for (const cardId of unitIdsAtArea1) {
                                        if (GameStateFn.getCardBattleArea(ctx, cardId).includes(runtimeArea1)) {
                                            ctx = GameStateFn.mapCard(ctx, cardId, card => ({ ...card, isRoll: true })) as GameState
                                            ctx = GameStateFn.moveItem(
                                                ctx,
                                                DefineFn.AbsoluteBaSyouFn.of(playerId, "配備エリア"),
                                                [cardId, DefineFn.AbsoluteBaSyouFn.of(playerId, fromKw)]
                                            ) as GameState
                                        } else {
                                            // Rule book p73
                                            ctx = GameStateFn.moveItem(
                                                ctx,
                                                DefineFn.AbsoluteBaSyouFn.of(playerId, "ジャンクヤード"),
                                                [cardId, DefineFn.AbsoluteBaSyouFn.of(playerId, fromKw)]
                                            ) as GameState
                                        }
                                    }
                                    return ctx
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