// 179003_01A_U_WT011C_white
// C
// SEED
// バスターガンダム
// バスター系　MS　専用「ディアッカ・エルスマン」
// 【PS装甲】　強襲　〔１〕：範囲兵器（３）
// （自軍戦闘フェイズ）〔２〕：このカードの部隊にいる、「PS装甲」を持つ自軍ユニット１枚は、ターン終了時まで±０／＋２／±０を得る。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（自軍戦闘フェイズ）〔２〕：このカードの部隊にいる、「PS装甲」を持つ自軍ユニット１枚は、ターン終了時まで±０／＋２／±０を得る。",
      title: ["使用型", ["自軍", "戦闘フェイズ"]],
      conditions: {
        ...createRollCostRequire(2, null),
        "このカードの部隊にいる、「PS装甲」を持つ自軍ユニット１枚": {
          title: ["Entity", {
            isThisBattleGroup: true,
            hasSpecialEffect: [["【PS装甲】"]],
            side: "自軍",
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
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "このカードの部隊にいる、「PS装甲」を持つ自軍ユニット１枚", cardId)
                    pairs.forEach(pair => {
                      ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: ["＋x／＋x／＋xを得る", [0, 2, 0]], cardIds: [pair[0]] }], pair)
                    })
                    return ctx
                  }.toString()
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