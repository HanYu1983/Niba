// 179030_11E_C_WT077S_white
// 少年が見据える先
// 展開　補強
// 『恒常』：このカードは、敵軍ユニットが３枚以上いる場合、合計国力ー２してプレイできる。
// （戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『恒常』：このカードは、敵軍ユニットが３枚以上いる場合、合計国力ー２してプレイできる。",
      title: ["自動型", "恒常"],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation != null) {
          return []
        }
        const pairs = DefineFn.TipFn.getWant(GameStateFn.createTipByEntitySearch(ctx, cardId, {
          at: DefineFn.BaSyouKeywordFn.getBaAll(),
          side: "敵軍",
          is: ["ユニット"],
          count: 3,
        })) as StrBaSyouPair[]
        if (pairs.length >= 3) {
          return [
            {
              title: ["合計国力＋(１)してプレイできる", -2],
              cardIds: [cardId]
            },
          ]
        }
        return []
      }.toString()
    }
  ],
  commandText: {
    id: "",
    description: "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
    title: ["使用型", ["戦闘フェイズ"]],
    conditions: {
      "自軍捨て山の上のカード１枚": {
        title: ["Entity", {
          side: "自軍",
          at: ["捨て山"],
          count: 1,
        }]
      },
      "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる": {
        title: ["この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["cutIn", [
              {
                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                  const cardId = DefineFn.EffectFn.getCardID(effect)
                  const cardController = GameStateFn.getItemController(ctx, cardId)
                  const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍捨て山の上のカード１枚", cardId)
                  for (const pair of pairs) {
                    ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true })
                    ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "Gゾーン"), pair)
                  }
                  // TODO この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる
                  if (false) {
                    return ctx
                  }
                  ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController)
                  return ctx
                }.toString()
              }
            ]]
          }
        ]
      }
    ]
  },
};