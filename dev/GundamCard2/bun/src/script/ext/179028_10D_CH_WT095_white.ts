// 179028_10D_CH_WT095_white
// R
// W
// ヒイロ・ユイ
// 男性　子供
// 『恒常』：このカードは、自軍ジャンクヤードにある場合、自軍手札にあるカードのようにプレイできる。
// 『恒常』：このカードは、自軍ジャンクヤードにある状態でプレイする場合、セット先として、自軍ジャンクヤードにある、このカードと同じ属性のGサインを持つユニット１枚を、自軍配備エリアにロール状態で出し、このカードをセットできる。

import { CardPrototype } from "../../game/define/CardPrototype";
import { CardText, Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『恒常』：このカードは、自軍ジャンクヤードにある場合、自軍手札にあるカードのようにプレイできる。",
      title: ["自動型", "恒常"],
      createPlayEffect: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Effect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (GameStateFn.getItemBaSyou(ctx, cardId).value[1] != "ジャンクヤード") {
          return []
        }
        const ges = GameStateFn.getGlobalEffects(ctx, null)
        const playText = GameStateFn.createPlayCharacterOperationEffect(ctx, cardId, { ges: ges })
        const playGText = GameStateFn.createPlayGEffect(ctx, cardId)
        return [playText, playGText]
      }.toString(),
    },
    {
      id: "",
      description: "『恒常』：このカードは、自軍ジャンクヤードにある状態でプレイする場合、セット先として、自軍ジャンクヤードにある、このカードと同じ属性のGサインを持つユニット１枚を、自軍配備エリアにロール状態で出し、このカードをセットできる。",
      title: ["自動型", "恒常"],
      createPlayEffect: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Effect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (GameStateFn.getItemBaSyou(ctx, cardId).value[1] != "ジャンクヤード") {
          return []
        }
        const ges = GameStateFn.getGlobalEffects(ctx, null)
        const conditions = GameStateFn.createPlayCardConditions(ctx, cardId, { ges: ges })
        delete conditions[DefineFn.TipFn.createCharacterTargetUnitKey()]
        const text: CardText = {
          id: effect.text.id,
          title: ["使用型", ["自軍", "配備フェイズ"]],
          description: effect.text.description,
          conditions: {
            ...conditions,
            "自軍ジャンクヤードにある、このカードと同じ属性のGサインを持つユニット１枚": {
              title: ["Entity", {
                side: "自軍",
                at: ["ジャンクヤード"],
                hasGSignProperty: [GameStateFn.getCardGSignProperty(ctx, cardId)],
                is: ["ユニット"],
                count: 1
              }]
            }
          },
          logicTreeActions: [
            {
              actions: [
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                    ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from], { ges: Options.ges }) as GameState
                    return GameStateFn.addStackEffect(ctx, {
                      // 注意：id必須是唯一的，如果不使用亂數請確保你的id不會重復
                      // 否則有可能應該在ctx.effects中的效果被同id的效果刪除
                      id: `${effect.id}_場に出る`,
                      reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                      description: effect.text.description,
                      text: {
                        id: effect.text.id,
                        description: effect.text.description,
                        title: [],
                        logicTreeActions: [
                          {
                            actions: [
                              {
                                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                                  const cardId = DefineFn.EffectFn.getCardID(effect)
                                  const cardController = GameStateFn.getItemController(ctx, cardId)
                                  ctx = GameStateFn.doItemSetRollState(ctx, false, GameStateFn.createStrBaSyouPair(ctx, cardId), { isSkipTargetMissing: true })
                                  ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "配備エリア"), GameStateFn.createStrBaSyouPair(ctx, cardId), { ges: Options.ges }) as GameState
                                  const unitPairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍ジャンクヤードにある、このカードと同じ属性のGサインを持つユニット１枚", cardId)
                                  for (const pair of unitPairs) {
                                    ctx = GameStateFn.doItemSetRollState(ctx, false, pair, { isSkipTargetMissing: true })
                                    ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "配備エリア"), pair, { ges: Options.ges }) as GameState
                                    ctx = GameStateFn.setSetGroupParent(ctx, pair[0], cardId) as GameState
                                    // only first one
                                    break
                                  }
                                  return ctx
                                }.toString()
                              },
                            ]
                          }
                        ]
                      }
                    }) as GameState
                  }.toString()
                }
              ]
            }
          ]
        }
        return [{
          ...effect,
          text: text
        }]
      }.toString(),
    }
  ],
};
