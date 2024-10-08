// 179019_02A_U_WT031C_white
// C
// W
// マグアナック
// マグアナック系　MS
// 『起動』：このカードが場に出た場合、自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚を自軍ハンガーに移す事ができる。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが場に出た場合、自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚を自軍ハンガーに移す事ができる。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (evt.title[0] == "場に出た場合"
          && evt.cardIds?.includes(cardId)
        ) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚": {
                title: ["Entity", {
                  see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 4],
                  hasGSignProperty: [GameStateFn.getCardGSignProperty(ctx, cardId)],
                  side: "自軍",
                  is: ["ユニット"],
                  count: 1
                }]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_の_ハンガーに移す", "自軍", "ハンガー"],
                  vars: ["自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚"]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
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