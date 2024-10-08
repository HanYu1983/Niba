// 179019_01A_U_WT003C_white
// C
// W
// リーオー
// リーオー系　MS
// 『常駐』：このカードは、ロールコストの支払いにおいて、白のGサインを持つ自軍Gとして扱う事ができる。（注：国力は発生しない）

import { CardPrototype, CardColor } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『常駐』：このカードは、ロールコストの支払いにおいて、白のGサインを持つ自軍Gとして扱う事ができる。（注：国力は発生しない）",
      title: ["自動型", "常駐"],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation && situation.title[0] == "ロールコストの支払いにおいて") {
          return [{ title: ["_白のGサインを持つ_自軍_Gとして扱う事ができる", ["白"], "自軍", "グラフィック"], cardIds: [cardId] }]
        }
        return []
      }.toString()
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