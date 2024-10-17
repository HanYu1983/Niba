// 179009_03B_U_WT045U_white
// U
// W
// メリクリウス
// メリクリウス系　MS
// 〔２〕：クロスウェポン［ヴァイエイト系］
// 『常駐』：このカードと交戦中の敵軍部隊の部隊戦闘力を－３する。
// （常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。

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
      description: "『常駐』：このカードと交戦中の敵軍部隊の部隊戦闘力を－３する。",
      title: ["自動型", "常駐"],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation != null) {
          return []
        }
        if (DefineFn.BaSyouKeywordFn.getBattleArea().includes(GameStateFn.getItemBaSyou(ctx, cardId).value[1])) {
          return [
            {
              // TODO: test it
              title: ["このカードと交戦中の敵軍部隊の部隊戦闘力を_－３する", -3],
              cardIds: [cardId]
            }
          ]
        }
        return []
      }.toString()
    },
    {
      id: "",
      description: "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
      title: ["使用型", ["常時"]],
      conditions: {
        ...createRollCostRequire(1, null),
        "自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚": {
          title: ["Entity", {
            side: "自軍",
            at: ["手札", "ハンガー"],
            hasChar: ["ヴァイエイト系"],
            is: ["ユニット"],
            count: 1,
          }]
        },
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [
                {
                  title: ["_の_ハンガーに移す", "自軍", "配備エリア"],
                  vars: ["自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚"]
                }
              ]]
            }
          ]
        }
      ]
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