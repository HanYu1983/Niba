// 179025_07D_CH_BL079C_blue
// C
// GUNDAM
// ハヤト・コバヤシ
// 男性　子供　WB隊
// 『常駐』：このセットグループのユニットは、ロール状態でも防御に出撃できる。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { type Effect } from "../../game/define/Effect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";
import { GlobalEffect } from "../../game/define/GlobalEffect";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『常駐』：このセットグループのユニットは、ロール状態でも防御に出撃できる。",
      title: ["自動型", "常駐"],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation != null) {
          return []
        }
        return [{ title: ["このセットグループのユニットは、ロール状態でも防御に出撃できる",], cardIds: [cardId] }]
      }.toString(),
    }
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