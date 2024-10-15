// 179025_07D_CH_GN070C_green
// C
// GUNDAM
// シャリア・ブル
// 男性　大人　NT
// クイック
// 『起動』：このカードが場に出た場合、敵軍手札を全て見る。

import { BaSyouKeyword } from "../../game/define/BaSyou";
import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { CardText, Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが場に出た場合、敵軍手札を全て見る。",
      title: ["自動型", "起動"],
      testEnvs: [{
        thisCard: ["自軍", "配備エリア", { id: "", protoID: "179025_07D_CH_GN070C_green" }],
        eventTitle: ["このカードが場に出た場合"]
      }],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (event.title[0] == "このカードが場に出た場合" && event.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "敵軍手札を全て": {
                title: ["Entity", {
                  side: "敵軍",
                  at: ["手札"],
                  max: 50,
                  asMuchAsPossible: true,
                }],
                actions: [
                  {
                    title: ["_ロールする", "見"],
                    vars: ["敵軍手札を全て"]
                  }
                ]
              }
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString(),
    },
  ],
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