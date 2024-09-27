// 179024_04B_U_BK060C_black
// ジム改高機動型
// ジム系　MS　T3部隊
// クイック
// 『起動』：このカードが場に出た場合、「特徴：T3部隊」を持つ自軍ユニット１枚は、ターン終了時まで＋２／＋２／＋２を得る。
import { title } from "process";
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが場に出た場合、「特徴：T3部隊」を持つ自軍ユニット１枚は、ターン終了時まで＋２／＋２／＋２を得る。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "場に出た場合" && evt.cardIds?.includes(cardId)) {
          const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
            reason: ["PlayText", cardController, cardId, effect.text.id],
            conditions: {
              "「特徴：T3部隊」を持つ自軍ユニット１枚": {
                title: ["Entity", {
                  hasChar: ["T3部隊"],
                  side: "自軍",
                  is: ["ユニット"],
                  count: 1
                }]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["ターン終了時まで「速攻」を得る。", [{ title: ["＋x／＋x／＋xを得る", [2, 2, 2]], cardIds: [] }]]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
          return ctx
        }
        return ctx
      }.toString()
    },
  ],
};
