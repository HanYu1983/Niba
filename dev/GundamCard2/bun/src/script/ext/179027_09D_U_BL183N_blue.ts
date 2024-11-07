// 179027_09D_U_BL183N_blue
// N
// Z
// ディジェ［†］
// ディジェ系　MS　専用「アムロ・レイ」
// 戦闘配備
// ＜『起動』：このカードが場に出た場合、自軍本国を２回復する＞
// 『起動』：自軍本国が回復した場合、（さらに）自軍本国を２回復する。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "＜『起動』：このカードが場に出た場合、自軍本国を２回復する＞",
      title: ["自動型", "起動"],
      protectLevel: 2,
      testEnvs: [
        {
          thisCard: ["自軍", "Gゾーン", { id: "", protoID: "179027_09D_U_BL183N_blue" }, null],
          eventTitle: ["このカードが場に出た場合"],
          createCards: [
            ["自軍", "捨て山", [["unit", 2]]]
          ],
          checkFn: function _(ctx: GameState, { DefineFn, GameStateFn }: Bridge) {
            if (GameStateFn.getItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.of("PlayerA", "本国")).length != 2) {
              throw new Error()
            }
          }
        }
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        const event = DefineFn.EffectFn.getEvent(effect)
        if (event.title[0] == "このカードが場に出た場合" && event.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            logicTreeAction: {
              actions: [
                {
                  title: ["_敵軍本国に_１ダメージ", "自軍", -2]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString(),
    },
    {
      id: "",
      description: "『起動』：自軍本国が回復した場合、（さらに）自軍本国を２回復する。",
      title: ["自動型", "起動"],
      testEnvs: [
        {
          thisCard: ["自軍", "戦闘エリア1", { id: "", protoID: "179027_09D_U_BL183N_blue" }, null],
          eventTitle: ["自軍本国が回復した場合"],
          createCards: [
            ["自軍", "捨て山", [["unit", 2]]]
          ],
          checkFn: function _(ctx: GameState, { DefineFn, GameStateFn }: Bridge) {
            if (GameStateFn.getItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.of("PlayerA", "本国")).length != 2) {
              throw new Error()
            }
          }
        }
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        const event = DefineFn.EffectFn.getEvent(effect)
        if (event.title[0] == "自軍本国が回復した場合" && event.playerId == cardController) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            logicTreeAction: {
              actions: [
                {
                  title: ["_敵軍本国に_１ダメージ", "自軍", -2]
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