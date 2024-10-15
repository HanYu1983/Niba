// 179018_05C_U_GN082U_green
// U
// 83
// ザクⅡF２型（ビッター機）
// ザク系　MS　専用「ノイエン・ビッター」
// 高機動
// 『起動』：このカードが、このカードと同じGサインを持つ、このカード以外の自軍ユニットがいる状態で場に出た場合、カード１枚を引く。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが、このカードと同じGサインを持つ、このカード以外の自軍ユニットがいる状態で場に出た場合、カード１枚を引く。",
      title: ["自動型", "起動"],
      testEnvs: [
        {
          eventTitle: ["このカードが場に出た場合"],
          thisCard: ["自軍", "配備エリア", { id: "", protoID: "179018_05C_U_GN082U_green" }, null],
          createCards: [
            ["自軍", "戦闘エリア2", [["179018_05C_U_GN082U_green", 1]]]
          ]
        }
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (event.title[0] == "このカードが場に出た場合" && event.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "このカードと同じGサインを持つ、このカード以外の自軍ユニットがいる状態": {
                actions: [
                  {
                    title: ["Entity", {
                      hasGSign: [],
                      isThisCard: false,
                      side: "自軍",
                      atBa: true,
                      is: ["ユニット"],
                      min: 1,
                    }]
                  }
                ]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["カード_１枚を引く", 1]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString(),
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