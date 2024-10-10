// 179029_06C_C_BK045U_black
// 擦れ違う二人
// 破壊　補強
// <『起動』：このカードがGとして場に出た場合、〔黒２〕を支払う事ができる。その場合、自軍本国のカードを全て見て、その中にあるグラフィック１枚を、自軍ハンガーに移す事ができる。その後、自軍本国をシャッフルする>
// （自軍ターン）：セットカード以外の敵軍オペ１枚を破壊する。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: " <『起動』：このカードがGとして場に出た場合、〔黒２〕を支払う事ができる。その場合、自軍本国のカードを全て見て、その中にあるグラフィック１枚を、自軍ハンガーに移す事ができる。その後、自軍本国をシャッフルする>",
      protectLevel: 2,
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (event.title[0] == "このカードがGとして場に出た場合" && event.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            conditions: {
              ...DefineFn.createRollCostRequire(2, "黒"),
              "自軍本国のカードを全て見て、その中にあるグラフィック１枚を": {
                title: ["Entity", {
                  see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 50],
                  cardCategory: ["グラフィック"],
                  max: 1,
                }],
                actions: [
                  {
                    title: ["_の_ハンガーに移す", "自軍", "ハンガー"]
                  }
                ]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_自軍_本国をシャッフルする", "自軍", "本国"],
                  vars: ["自軍本国のカードを全て見て、その中にあるグラフィック１枚を"]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString(),
    }
  ],
  commandText: {
    id: "",
    description: " （自軍ターン）：セットカード以外の敵軍オペ１枚を破壊する。",
    title: ["使用型", ["自軍", "ターン"]],
    conditions: {
      "セットカード以外の敵軍オペ１枚": {
        title: ["Entity", {
          isSetGroup: true,
          atBa: true,
          side: "敵軍",
          is: ["オペレーション"],
          count: 1,
        }],
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["_ロールする", "破壞"],
            vars: ["セットカード以外の敵軍オペ１枚"]
          }
        ]
      }
    ]
  },
};
