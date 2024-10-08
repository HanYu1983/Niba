// 179024_03B_U_WT039R_white
// R
// W
// ガンダムデスサイズ
// デスサイズ系　MS　専用「デュオ・マックスウェル」
// 戦闘配備　〔０〕：改装［デスサイズ系］
// 『起動』：このカードが場に出た場合、４以下の合計国力を持つ、敵軍キャラ、または敵軍オペ１枚を破壊できる。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [{
    id: "",
    description: "『起動』：このカードが場に出た場合、４以下の合計国力を持つ、敵軍キャラ、または敵軍オペ１枚を破壊できる。",
    title: ["使用型", ["ダメージ判定ステップ"]],
    onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
      const evt = DefineFn.EffectFn.getEvent(effect)
      const cardId = DefineFn.EffectFn.getCardID(effect)
      const cardController = GameStateFn.getItemController(ctx, cardId)
      if (evt.title[0] == "場に出た場合" && evt.cardIds?.includes(cardId)) {
        const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
          conditions: {
            "４以下の合計国力を持つ、敵軍キャラ": {
              title: ["Entity", {
                atBa: true,
                compareBattlePoint: ["合計国力", "<=", 4],
                side: "敵軍",
                is: ["キャラクター"],
                count: 1
              }],
              actions: [
                {
                  title: ["_ロールする", "破壞"],
                  vars: ["４以下の合計国力を持つ、敵軍キャラ"]
                }
              ]
            },
            "敵軍オペ１枚": {
              title: ["Entity", {
                atBa: true,
                side: "敵軍",
                is: ["オペレーション", "オペレーション(ユニット)"],
                count: 1
              }],
              actions: [
                {
                  title: ["_ロールする", "破壞"],
                  vars: ["敵軍オペ１枚"]
                }
              ]
            }
          },
          logicTreeAction: {
            logicTree: {
              type: "Or",
              children: [
                {
                  type: "Leaf",
                  value: "４以下の合計国力を持つ、敵軍キャラ"
                },
                {
                  type: "Leaf",
                  value: "敵軍オペ１枚"
                }
              ]
            },
            actions: []
          }
        })
        ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
      }
      return ctx
    }.toString()
  }]
};