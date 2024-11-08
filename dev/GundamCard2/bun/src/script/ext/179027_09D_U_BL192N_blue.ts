
// 179027_09D_U_BL192N_blue
// N
// センチネル
// ヌーベル・ジムⅢ
// ジム系　MS
// 『起動』：このカードが場に出た場合、自軍セットカード１枚を、持ち主の手札に移す事ができる。
// （注：裏向きのセットカードは、表を見ずに選択する）

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが場に出た場合、自軍セットカード１枚を、持ち主の手札に移す事ができる。",
      title: ["自動型", "起動"],
      testEnvs: [
        {
          thisCard: ["自軍", "配備エリア", { id: "", protoID: "179027_09D_U_BL192N_blue" }, null],
          addCards: [
            ["自軍", "戦闘エリア1", [{ id: "unit", protoID: "unit" }, { id: "char", protoID: "charBlue" }]],
          ],
          setGroupParent: { "char": "unit" },
          eventTitle: ["このカードが場に出た場合"],
        }
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (evt.title[0] == "このカードが場に出た場合" && evt.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            conditions: {
              "自軍セットカード１枚": {
                title: ["Entity", {
                  side: "自軍",
                  atBa: true,
                  isSetGroupRoot: false,
                  count: 1
                }]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_の_ハンガーに移す", "持ち主", "手札"],
                  vars: ["自軍セットカード１枚"]
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