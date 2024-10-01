// 179016_04B_U_WT074C_white
// M1アストレイ
// アストレイ系　MS
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、プレイされて場に出た場合、〔２〕を支払う事ができる。その場合、カード１枚を引く。
// （注：このカードが場に出た時にも起動する）

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、プレイされて場に出た場合、〔２〕を支払う事ができる。その場合、カード１枚を引く。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (evt.title[0] == "プレイされて場に出た場合" &&
          evt.cardIds?.every(cid => GameStateFn.getItemController(ctx, cid) == cardController) &&
          evt.cardIds?.every(cid => GameStateFn.getItemCharacteristic(ctx, cid).includes("アストレイ系"))
        ) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            conditions: DefineFn.createRollCostRequire(2, null),
            logicTreeAction: {
              actions: [
                {
                  title: ["カード_１枚を引く", 1],
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