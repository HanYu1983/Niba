// 179022_06C_U_WT113R_white
// アストレイ ブルーフレーム セカンドG（スナイパーライフル）
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］
// 『起動』：本来の記述に、「特徴：アストレイ系」を持つ自軍カードが場に出た場合、〔白１〕を支払う事ができる。その場合、敵軍ユニット１枚の上に、±０／±０／－１コイン２個を乗せる。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：本来の記述に、「特徴：アストレイ系」を持つ自軍カードが場に出た場合、〔白１〕を支払う事ができる。その場合、敵軍ユニット１枚の上に、±０／±０／－１コイン２個を乗せる。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (evt.title[0] == "このカードが場に出た場合" &&
          evt.cardIds?.every(cid => GameStateFn.getItemController(ctx, cid) == cardController) &&
          evt.cardIds?.every(cid => GameStateFn.getItemPrototype(ctx, cid).characteristic?.includes("アストレイ系"))
        ) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            conditions: {
              ...DefineFn.createRollCostRequire(1, null),
              "敵軍ユニット１枚": {
                title: ["Entity", {
                  atBa: true,
                  side: "敵軍",
                  is: ["ユニット"],
                  count: 1,
                }]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_－１／－１／－１コイン_１個を乗せる", [0, 0, -1], 2],
                  vars: ["敵軍ユニット１枚"]
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