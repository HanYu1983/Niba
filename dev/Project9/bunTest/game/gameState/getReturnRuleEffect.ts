import { Bridge } from "../../script/bridge";
import { AbsoluteBaSyouFn, BaSyouKeyword } from "../define/BaSyou";
import { Effect } from "../define/Effect";
import { PlayerID } from "../define/PlayerID";
import { StrBaSyouPair } from "../define/Tip";
import { ToolFn } from "../tool";
import { GameState } from "./GameState";

export function getReturnRuleEffect(ctx: GameState, playerId: PlayerID): Effect {
    return {
        id: ToolFn.getUUID("getReturnRuleEffect"),
        reason: ["GameRule", playerId, "getReturnRuleEffect"],
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

                                const nx = GameStateFn.getCardLikeItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.of(playerId, "戦闘エリア1"))
                                

                                return ctx
                            }.toString()
                        }
                    ]
                }
            ]
        }
    }
}