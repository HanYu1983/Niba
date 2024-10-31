import { Bridge } from "../../script/bridge";
import { Effect } from "../define/Effect";
import { PlayerID } from "../define/PlayerID";
import { GameState } from "./GameState";

export function createDamageRuleEffect(ctx: GameState, playerId: PlayerID): Effect {
    return {
        id: `createDamageRuleEffect_${playerId}`,
        reason: ["GameRule", playerId, { isDamageCheck: true }],
        text: {
            id: `createDamageRuleEffect_text_${playerId}`,
            title: [],
            description: "getDamageRuleEffect",
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                                const playerId = DefineFn.EffectFn.getPlayerID(effect)
                                // 速度1
                                ctx = GameStateFn.doPlayerAttack(ctx, playerId, "戦闘エリア1", 1, Options)
                                ctx = GameStateFn.doPlayerAttack(ctx, playerId, "戦闘エリア2", 1, Options)
                                // 速度2
                                ctx = GameStateFn.doPlayerAttack(ctx, playerId, "戦闘エリア1", 2, Options)
                                ctx = GameStateFn.doPlayerAttack(ctx, playerId, "戦闘エリア2", 2, Options)
                                return ctx
                            }.toString()
                        }
                    ]
                }
            ]
        }
    }
}