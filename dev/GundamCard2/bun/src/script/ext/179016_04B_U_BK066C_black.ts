// 179016_04B_U_BK066C_black
// C
// Z
// バイザックTR-2［ビグウィグ］
// ハイザック系　MS　T3部隊
// 『起動』：このカードが場に出た場合、配備エリアにいる、X以下の防御力を持つ敵軍ユニット１枚を破壊する。
// （注：プレイ時に通常のコストを支払った時のみ適用可能）

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが場に出た場合、配備エリアにいる、X以下の防御力を持つ敵軍ユニット１枚を破壊する。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "場に出た場合" && evt.cardIds?.includes(cardId)) {
          const cardId = DefineFn.EffectFn.getCardID(effect)
          const cardProto = GameStateFn.getItemPrototype(ctx, cardId)
          const payColorKey = DefineFn.TipFn.createConditionKeyOfPayColorX(cardProto)
          const x = GameStateFn.getCardTipStrBaSyouPairs(ctx, payColorKey, cardId).length
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "配備エリアにいる、X以下の防御力を持つ敵軍ユニット１枚": {
                title: ["Entity", {
                  at: ["配備エリア"],
                  compareBattlePoint: ["防御力", "<=", x],
                  side: "敵軍",
                  is: ["ユニット"],
                  count: 1
                }]
              },
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_ロールする", "破壞"],
                  vars: ["配備エリアにいる、X以下の防御力を持つ敵軍ユニット１枚"]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
          return ctx
        }
        return ctx
      }.toString()
    },
  ],
};
