// 179020_05C_U_BK100U_black
// ギャプランTR-5［ファイバー］（MS形態）
// ギャプラン系　ファイバー系　MS　T3部隊
// 〔１〕：改装［ファイバー系］
// 『起動』：このカードの部隊が敵軍本国に戦闘ダメージを与えた場合、〔黒１〕を支払う事ができる。その場合、敵軍は、自分の手札２枚を選んで廃棄する。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect, EffectFn } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードの部隊が敵軍本国に戦闘ダメージを与えた場合、〔黒１〕を支払う事ができる。その場合、敵軍は、自分の手札２枚を選んで廃棄する。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "このカードの部隊が敵軍本国に戦闘ダメージを与えた場合" && evt.cardIds?.includes(cardId)) {
          const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
            isOption: true,
            conditions: {
              ...DefineFn.createRollCostRequire(1, "黒"),
              "自分の手札２枚": {
                title: ["Entity", { side: "敵軍", baSyouKeywords: ["手札"], count: 2 }],
                relatedPlayerSideKeyword: "敵軍",
                actions: [
                  {
                    title: ["_ロールする", "廃棄"],
                    vars: ["自分の手札２枚"]
                  }
                ]
              }
            },
          })
          // 檢看能不能滿足支付
          const cets = GameStateFn.createEffectTips(ctx, newE, 0, 0).filter(DefineFn.TipOrErrorsFn.filterError)
          if (cets.length) {
            return ctx
          }
          ctx = GameStateFn.addImmediateEffect(ctx, newE) as GameState
          return ctx
        }
        return ctx
      }.toString()
    },
  ],
};
