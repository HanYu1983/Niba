// 179020_05C_U_BK100U_black
// ギャプランTR-5［ファイバー］（MS形態）
// ギャプラン系　ファイバー系　MS　T3部隊
// 〔１〕：改装［ファイバー系］
// 『起動』：このカードの部隊が敵軍本国に戦闘ダメージを与えた場合、〔黒１〕を支払う事ができる。その場合、敵軍は、自分の手札２枚を選んで廃棄する。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
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
          ctx = GameStateFn.addImmediateEffect(ctx, {
            id: "",
            reason: ["PlayText", cardController, cardId, effect.text.id],
            description: effect.description,
            isOption: true,
            text: {
              id: effect.text.id,
              description: effect.text.description,
              title: [],
              conditions: {
                ...DefineFn.createRollCostRequire(1, "黒"),
                "自分の手札２枚": {
                  title: "",
                  relatedPlayerSideKeyword: "敵軍",
                  actions: [
                    {
                      title: ["_ロールする", "廃棄"],
                      vars: ["自分の手札２枚"]
                    }
                  ]
                }
              },
              logicTreeActions: [
                {
                  actions: []
                }
              ]
            }
          }) as GameState
          return ctx
        }
        return ctx
      }.toString()
    },
  ],
};
