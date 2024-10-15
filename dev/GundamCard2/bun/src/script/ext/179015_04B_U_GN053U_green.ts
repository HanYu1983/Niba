// 179015_04B_U_GN053U_green
// U
// GUNDAM
// シャア専用リック・ドム
// ドム系　MS　専用「シャア・アズナブル」
// 『起動』：このカードが場に出た場合、セットカードがセットされていない、Ｇ以外の敵軍カード１枚を、持ち主の手札に移すことが出来る。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが場に出た場合、セットカードがセットされていない、Ｇ以外の敵軍カード１枚を、持ち主の手札に移すことが出来る。",
      title: ["自動型", "起動"],
      testEnv: {
        eventTitle: ["このカードが場に出た場合"],
        thisCard: ["自軍", "配備エリア", { id: "", protoID: "179015_04B_U_GN053U_green" }],
        basicCards: [
          ["敵軍", "戦闘エリア1", [["unit", 1]]]
        ]
      },
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (event.title[0] == "このカードが場に出た場合" && event.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            conditions: {
              "セットカードがセットされていない、Ｇ以外の敵軍カード１枚": {
                title: ["Entity", {
                  atBa: true,
                  hasSetCard: false,
                  is: DefineFn.CardCategoryFn.createRemaining(["グラフィック"]),
                  side: "敵軍",
                  count: 1
                }],
                actions: [
                  {
                    title: ["_の_ハンガーに移す", "持ち主", "手札"],
                    vars: ["セットカードがセットされていない、Ｇ以外の敵軍カード１枚"]
                  }
                ]
              }
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