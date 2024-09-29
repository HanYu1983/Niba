// 179027_09D_C_BK063R_black
// 覚悟の戦い
// 破壊
// 『恒常』：自軍セットカードがある場合、このカードは、合計国力－２、ロールコスト－２してプレイできる。
// （ダメージ判定ステップ）：戦闘エリアにいる、セットカードがセットされていない敵軍ユニット１枚を破壊する。その場合、カード１枚を引く。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
import { GlobalEffect } from "../../game/define/GlobalEffect";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（ダメージ判定ステップ）：戦闘エリアにいる、セットカードがセットされていない敵軍ユニット１枚を破壊する。その場合、カード１枚を引く。",
    title: ["使用型", ["ダメージ判定ステップ"]],
    conditions: {
      "戦闘エリアにいる、セットカードがセットされていない敵軍ユニット１枚": {
        title: ["Entity", {
          at: ["戦闘エリア1", "戦闘エリア2"],
          hasSetCard: false,
          side: "敵軍",
          is: ["ユニット"],
          count: 1
        }]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["_ロールする", "破壞"],
            vars: ["戦闘エリアにいる、セットカードがセットされていない敵軍ユニット１枚"]
          },
          {
            title: ["カード_１枚を引く", 1],
          }
        ]
      }
    ]
  },
  texts: [
    {
      id: "",
      description: "『恒常』：自軍セットカードがある場合、このカードは、合計国力－２、ロールコスト－２してプレイできる。",
      title: ["自動型", "恒常"],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const tip = GameStateFn.createTipByEntitySearch(ctx, cardId, {
          side: "自軍",
          at: DefineFn.BaSyouKeywordFn.getBaAll(),
          hasSetCard: true,
        })
        const enabled = DefineFn.TipFn.getWant(tip).length > 0
        if (enabled) {
          return [{ title: ["合計国力＋_、ロールコスト＋_してプレイできる", -2, -2], cardIds: [cardId] }]
        }
        return []
      }.toString()
    }
  ]
};
