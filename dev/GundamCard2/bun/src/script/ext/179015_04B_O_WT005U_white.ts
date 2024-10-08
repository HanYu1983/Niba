// 179015_04B_O_WT005U_white
// U
// SEED
// サイクロプス
// 破壊
// 『起動』：ダメージ判定ステップ開始時に、このカードが交戦中の場合、このカードと同じ戦闘エリアにいる全てのユニットに５ダメージを与える。

import { CardPrototype, CardColor } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：ダメージ判定ステップ開始時に、このカードが交戦中の場合、このカードと同じ戦闘エリアにいる全てのユニットに５ダメージを与える。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (evt.title[0] == "GameEventOnTiming"
          && evt.title[1][0] == "戦闘フェイズ"
          && evt.title[1][1] == "ダメージ判定ステップ"
          && evt.title[1][2] == "ステップ開始"
          && GameStateFn.isBattle(ctx, cardId, null)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "このカードと同じ戦闘エリアにいる全てのユニット": {
                title: ["Entity", {
                  at: [DefineFn.AbsoluteBaSyouFn.getBaSyouKeyword(GameStateFn.getItemBaSyou(ctx, cardId))],
                  is: ["ユニット"],
                  max: 50,
                }]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_１ダメージを与える", 5],
                  vars: ["このカードと同じ戦闘エリアにいる全てのユニット"]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
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