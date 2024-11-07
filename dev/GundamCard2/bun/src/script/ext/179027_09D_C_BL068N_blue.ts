// 179027_09D_C_BL068N_blue
// N
// Z
// メールシュトローム作戦
// 補強
// （常時）：カード１枚を引く。自軍捨て山のカードが０枚の場合、（さらに）カード１枚を引く。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（常時）：カード１枚を引く。自軍捨て山のカードが０枚の場合、（さらに）カード１枚を引く。",
    title: ["使用型", ["常時"]],
    testEnvs: [
      {
        createCards: [
          ["自軍", "本国", [["unit", 2]]]
        ]
      }
    ],
    logicTreeActions: [
      {
        actions: [
          {
            title: ["cutIn", [
              {
                title: ["カード_１枚を引く", 1],
              },
              {
                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn, Options }: Bridge): GameState {
                  const cardId = DefineFn.EffectFn.getCardID(effect)
                  const suteyamaLen = GameStateFn.getPlayerSuTeYaMaIds(ctx, GameStateFn.getItemController(ctx, cardId)).length
                  if (suteyamaLen == 0) {
                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
                      logicTreeAction: {
                        actions: [
                          {
                            title: ["カード_１枚を引く", 1],
                          }
                        ]
                      }
                    })
                    ctx = GameStateFn.addImmediateEffect(ctx, newE) as GameState
                  }
                  return ctx
                }.toString(),
              }
            ]]
          }
        ]
      }
    ],
  },
};