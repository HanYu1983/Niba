import { Bridge } from "../../script/bridge";
import { AbsoluteBaSyouFn, BaSyouKeyword } from "../define/BaSyou";
import { Effect } from "../define/Effect";
import { PlayerID } from "../define/PlayerID";
import { StrBaSyouPair } from "../define/Tip";
import { ToolFn } from "../tool";
import { GameState } from "./GameState";

export function createDamageRuleEffect(ctx: GameState, playerId: PlayerID): Effect {
    return {
        id: `createDamageRuleEffect_${playerId}`,
        reason: ["GameRule", playerId],
        text: {
            id: `createDamageRuleEffect_text_${playerId}`,
            title: [],
            description: "getDamageRuleEffect",
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                const playerId = DefineFn.EffectFn.getPlayerID(effect)
                                // 速度1
                                ctx = GameStateFn.doPlayerAttack(ctx, playerId, "戦闘エリア1", 1)
                                ctx = GameStateFn.doPlayerAttack(ctx, playerId, "戦闘エリア2", 1)
                                // 速度2
                                ctx = GameStateFn.doPlayerAttack(ctx, playerId, "戦闘エリア1", 2)
                                ctx = GameStateFn.doPlayerAttack(ctx, playerId, "戦闘エリア2", 2)
                                return ctx
                            }.toString()
                        }
                    ]
                }
            ]
        }
    }
}