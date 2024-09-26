import { Bridge } from "../../script/bridge";
import { AbsoluteBaSyouFn, BaKeyword, BaSyouKeyword } from "../define/BaSyou";
import { Effect } from "../define/Effect";
import { PlayerID } from "../define/PlayerID";
import { StrBaSyouPair } from "../define/Tip";
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
                                    const from = DefineFn.AbsoluteBaSyouFn.of(playerId, fromKw)
                                    const runtimeArea1 = GameStateFn.getRuntimeBattleArea(ctx, fromKw)
                                    const unitIdsAtArea1 = GameStateFn.getItemIdsByBasyou(ctx, from)
                                    for (const cardId of unitIdsAtArea1) {
                                        const target = [cardId, from] as StrBaSyouPair
                                        if (GameStateFn.getCardBattleArea(ctx, cardId).includes(runtimeArea1)) {
                                            ctx = GameStateFn.doSetItemRollState(ctx, true, target, { isSkipTargetMissing: true })
                                            ctx = GameStateFn.doItemMove(
                                                ctx,
                                                DefineFn.AbsoluteBaSyouFn.of(playerId, "配備エリア"),
                                                target, { isSkipTargetMissing: true }
                                            ) as GameState
                                        } else {
                                            // Rule book p73
                                            ctx = GameStateFn.doItemMove(
                                                ctx,
                                                DefineFn.AbsoluteBaSyouFn.of(playerId, "ジャンクヤード"),
                                                target, { isSkipTargetMissing: true }
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