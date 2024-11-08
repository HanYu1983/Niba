
// 179031_12E_U_BL219N_blue
// N
// 08MS小隊
// ガンダムEz8［†］［∞］
// 陸戦型ガンダム系　MS　レジェンド　専用「シロー・アマダ」
// 戦闘配備　〔１〕：改装［陸戦型ガンダム系］
// 『起動』：このカードが場に出た場合、カード２枚を引く。その後、自軍手札１枚を選んで、持ち主の本国の上か下に移す。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが場に出た場合、カード２枚を引く。その後、自軍手札１枚を選んで、持ち主の本国の上か下に移す。",
      title: ["自動型", "起動"],
      testEnvs: [
        {
          thisCard: ["自軍", "配備エリア", { id: "", protoID: "179031_12E_U_BL219N_blue" }, null],
          eventTitle: ["このカードが場に出た場合"],
          createCards: [["自軍", "本国", [["unit", 2]]]],
          checkFn: function _(ctx: GameState, { DefineFn, GameStateFn }: Bridge) {
            if (GameStateFn.getPlayerHandIds(ctx, "PlayerA").length != 1) {
              throw new Error()
            }
            if (GameStateFn.getPlayerCountrytIds(ctx, "PlayerA").length != 1) {
              throw new Error()
            }
          }
        }
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (evt.title[0] == "このカードが場に出た場合" && evt.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            logicTreeAction: {
              actions: [
                {
                  title: ["カード_１枚を引く", 2]
                },
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
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
                    ctx = GameStateFn.addImmediateEffect(ctx, newE) as GameState
                    return ctx
                  }.toString()
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString()
    },
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