import { Bridge } from "../../script/bridge";
import { AbsoluteBaSyouFn, BaSyouKeyword } from "../define/BaSyou";
import { Effect } from "../define/Effect";
import { PlayerID } from "../define/PlayerID";
import { StrBaSyouPair } from "../define/Tip";
import { ToolFn } from "../tool";
import { GameState } from "./GameState";

export function createRerollPhaseRuleEffect(ctx: GameState, playerId: PlayerID): Effect {
    return {
        id: `createRerollPhaseRuleEffect_${playerId}`,
        reason: ["GameRule", playerId],
        text: {
            id: `createRerollPhaseRuleEffect_text_${playerId}`,
            title: [],
            description: "getRerollPhaseRuleEffect",
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                const playerId = DefineFn.EffectFn.getPlayerID(effect)
                                const pairs = (["配備エリア", "Gゾーン"] as BaSyouKeyword[]).flatMap(kw => {
                                    const basyou = DefineFn.AbsoluteBaSyouFn.of(playerId, kw)
                                    return GameStateFn.getItemIdsByBasyou(ctx, basyou)
                                        .filter(cardId => GameStateFn.getItemIsCanReroll(ctx, cardId))
                                        .map(cardId => {
                                            return [cardId, basyou] as StrBaSyouPair
                                        })
                                })
                                for (const pair of pairs) {
                                    ctx = GameStateFn.doItemSetRollState(ctx, false, pair, { isSkipTargetMissing: true })
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