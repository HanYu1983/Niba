import { Bridge } from "../../script/bridge";
import { Effect } from "../define/Effect";
import { PlayerID } from "../define/PlayerID";
import { Tip } from "../define/Tip";
import { GameState } from "./GameState";

export function createDiscardRuleEffect(ctx: GameState, playerId: PlayerID): Effect {
    return {
        id: `createDiscardRuleEffect_${playerId}`,
        reason: ["GameRule", playerId, { isDiscard: true }],
        text: {
            id: `createDiscardRuleEffect_text_${playerId}`,
            title: [],
            description: "調整手牌為7張以下",
            conditions: {
                "調整": {
                    title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): Tip | null {
                        const playerId = DefineFn.EffectFn.getPlayerID(effect)
                        const hands = GameStateFn.getPlayerHandIds(ctx, playerId)
                        const bonus = Options.ges?.map(ge => {
                            if (ge.title[0] == "自軍の手札の上限枚数に＋_１" && ge.cardIds.some(cardId => GameStateFn.getItemController(ctx, cardId) == playerId)) {
                                return ge.title[1]
                            }
                            return 0
                        }).reduce((a, b) => a + b, 0) || 0
                        const maxLen = 7 + bonus
                        const discardLen = hands.length - maxLen
                        if (discardLen <= 0) {
                            throw new DefineFn.TipError("")
                        }
                        const pairs = hands.map(id => GameStateFn.createStrBaSyouPair(ctx, id))
                        return {
                            title: ["カード", pairs, pairs.slice(0, discardLen)],
                            count: discardLen
                        }
                    }.toString()
                },
            },
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: ["_の_ハンガーに移す", "持ち主", "ジャンクヤード"],
                            vars: ["調整"]
                        },
                    ]
                }
            ]
        }
    }
}