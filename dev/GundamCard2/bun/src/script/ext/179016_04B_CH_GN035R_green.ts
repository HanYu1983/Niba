// 179016_04B_CH_GN035R_green
// R
// CCA
// クェス・パラヤ
// 女性　子供　NT
// （戦闘フェイズ）〔１〕：このカードを抜き出し、「サイコミュ」を持つ（別の）自軍ユニットにセットする。（注：場から離れた後、再度場に出る）

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
      description: "（戦闘フェイズ）〔１〕：このカードを抜き出し、「サイコミュ」を持つ（別の）自軍ユニットにセットする。（注：場から離れた後、再度場に出る）",
      title: ["使用型", ["戦闘フェイズ"]],
      testEnvs: [{
        createCards: [
          ["自軍", "Gゾーン", [["unit", 1]]],
          ["自軍", "戦闘エリア1", [["unitHasPhy", 1]]],
          ["自軍", "配備エリア", [["179016_04B_CH_GN035R_green", 1]]],
        ]
      }],
      conditions: {
        ...createRollCostRequire(1, null),
        "「サイコミュ」を持つ（別の）自軍ユニット": {
          title: ["Entity", {
            atBa: true,
            hasSpecialEffect: [["サイコミュ", 0]],
            isThisSetGroup: false,
            side: "自軍",
            is: ["ユニット"],
            count: 1
          }]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [
                {
                  title: function _(ctx: any, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                    const targets = GameStateFn.getCardTipStrBaSyouPairs(ctx, "「サイコミュ」を持つ（別の）自軍ユニット", cardId)
                    const target = targets[0]
                    if (target == null) {
                      throw new Error()
                    }
                    // 移出去 (不必)
                    // ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "取り除かれたカード"), GameStateFn.createStrBaSyouPair(ctx, cardId), { ges: Options.ges }) as GameState
                    // 再移回來
                    ctx = GameStateFn.doItemMove(ctx, from, GameStateFn.createStrBaSyouPair(ctx, cardId), { ges: Options.ges }) as GameState
                    ctx = GameStateFn.setSetGroupParent(ctx, target[0], cardId)
                    return ctx
                  }.toString()
                }
              ]]
            }
          ]
        }
      ]
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