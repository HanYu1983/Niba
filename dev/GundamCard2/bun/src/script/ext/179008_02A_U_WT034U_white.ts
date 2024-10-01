// 179008_02A_U_WT034U_white
// アストレイ ブルーフレーム
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］　
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で廃棄される場合、カード１枚を引く。
// （注：このカードが廃棄される時にも起動する）

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で廃棄される場合、カード１枚を引く。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (evt.title[0] == "「改装」の効果で廃棄される場合" &&
          evt.cardIds?.every(cid => GameStateFn.getItemController(ctx, cid) == cardController) &&
          evt.cardIds?.every(cid => GameStateFn.getItemCharacteristic(ctx, cid).includes("アストレイ系"))
        ) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
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