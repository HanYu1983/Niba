import { Bridge } from "../../script/bridge";
import { Effect } from "../define/Effect";
import { PlayerID } from "../define/PlayerID";
import { ToolFn } from "../tool";
import { GameState } from "./GameState";
import { setNextPhase } from "./PhaseComponent";

export function getDrawPhaseRuleEffect(ctx: GameState, playerId: PlayerID): Effect {
    return {
        id: ToolFn.getUUID("getDrawPhaseRuleEffect"),
        reason: ["GameRule", playerId],
        text: {
            id: ToolFn.getUUID("getDrawPhaseRuleEffect"),
            title: [],
            description: "抽牌階段規定效果",
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                                const drawCount = 1
                                const playerId = DefineFn.EffectFn.getPlayerID(effect)
                                const from = DefineFn.AbsoluteBaSyouFn.of(playerId, "本国")
                                const cardIds = GameStateFn.getCardLikeItemIdsByBasyou(ctx, from).slice(0, drawCount)
                                for (const cardId of cardIds) {
                                    ctx = GameStateFn.moveCardLikeItem(ctx, DefineFn.AbsoluteBaSyouFn.of(playerId, "手札"), [cardId, from]) as GameState
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