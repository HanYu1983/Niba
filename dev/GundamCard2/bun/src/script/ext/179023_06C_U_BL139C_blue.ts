// 179023_06C_U_BL139C_blue
// C
// 08MS小隊
// 陸戦型ガンダム（空挺仕様）
// 陸戦型ガンダム系　MS
// 『起動』：このカードがプレイされて場に出た場合、カード１枚を引く。その後、自軍手札１枚を持ち主の本国の下に移す。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードがプレイされて場に出た場合、カード１枚を引く。その後、自軍手札１枚を持ち主の本国の下に移す。",
      title: ["自動型", "起動"],
      testEnvs: [
        {
          thisCard: ["自軍", "配備エリア", { id: "", protoID: "179023_06C_U_BL139C_blue" }, null],
          eventTitle: ["プレイされて場に出た場合"],
          createCards: [
            ["自軍", "本国", [["unit", 1]]]
          ]
        }
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "プレイされて場に出た場合" && evt.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            logicTreeAction: {
              actions: [
                {
                  title: ["カード_１枚を引く", 1]
                },
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                    const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                      conditions: {
                        "自軍手札１枚": {
                          title: ["Entity", {
                            side: "自軍",
                            at: ["手札"],
                            count: 1
                          }]
                        }
                      },
                      logicTreeAction: {
                        actions: [
                          {
                            title: ["_の_ハンガーに移す", "持ち主", "本国"],
                            vars: ["自軍手札１枚"]
                          }
                        ]
                      }
                    })
                    ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE, { isSkipLimitCheck: true })
                    return ctx
                  }.toString()
                },
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
          return ctx
        }
        return ctx
      }.toString()
    }
  ]
};


function createRollCostRequire(
  costNum: number,
  color: CardColor | null
): { [key: string]: Condition } {
  let ret: { [key: string]: Condition } = {}
  for (let i = 0; i < costNum; ++i) {
    const key = `${i}[${color}]`
    ret = {
      ...ret,
      [key]: {
        title: ["RollColor", color],
        actions: [
          {
            title: ["_ロールする", "ロール"],
            vars: [key]
          }
        ]
      }
    };
  }
  return ret
}