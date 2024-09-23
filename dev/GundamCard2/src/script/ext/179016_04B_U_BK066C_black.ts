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
          ctx = GameStateFn.addImmediateEffect(ctx, {
            id: "",
            reason: effect.reason,
            description: effect.description,
            text: {
              id: effect.text.id,
              description: effect.text.description,
              title: [],
              conditions: {
                "配備エリアにいる、X以下の防御力を持つ敵軍ユニット１枚": {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip | null {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const cardProto = GameStateFn.getItemPrototype(ctx, cardId)
                    const playerId = GameStateFn.getItemController(ctx, cardId)
                    const from = DefineFn.AbsoluteBaSyouFn.of(DefineFn.PlayerIDFn.getOpponent(playerId), "配備エリア")
                    const payColorKey = GameStateFn.createConditionKeyOfPayColorX(cardProto)
                    const x = GameStateFn.getCardTipStrBaSyouPairs(ctx, payColorKey, cardId).length
                    const targetIds = GameStateFn.getItemIdsByBasyou(ctx, from)
                      .filter(itemId => GameStateFn.getItemRuntimeCategory(ctx, itemId) == "ユニット")
                      .filter(itemId => GameStateFn.getSetGroupBattlePoint(ctx, itemId)[2] < x)
                    const pairs = targetIds.map(tid => {
                      return [tid, from] as StrBaSyouPair
                    })
                    const count = 1
                    return {
                      title: ["カード", pairs, pairs.slice(0, 1)],
                      count: count
                    }
                  }.toString(),
                },
              },
              logicTreeActions: [
                {
                  actions: [
                    {
                      title: ["_ロールする", "破壞"],
                      vars: ["配備エリアにいる、X以下の防御力を持つ敵軍ユニット１枚"]
                    }
                  ]
                }
              ]
            }
          }) as GameState
          return ctx
        }
        return ctx
      }.toString()
    },
  ],
};
