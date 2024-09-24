// 179030_11E_U_BK194S_2_black
// ゴトラタン［†］【コレクタブルレア】
// ゴトラタン系　MS　専用「カテジナ・ルース」
// 戦闘配備　強襲
// （自軍ターン）〔０〕：黒のGサインを持つ自軍Gが５枚以上ある場合、自軍ジャンクヤードにある、黒のGサインを持つ全てのカードは、このターン中、自軍手札にあるかのようにプレイできる。このターン中、場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（自軍ターン）〔０〕：黒のGサインを持つ自軍Gが５枚以上ある場合、自軍ジャンクヤードにある、黒のGサインを持つ全てのカードは、このターン中、自軍手札にあるかのようにプレイできる。このターン中、場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる。",
      title: ["使用型", ["自軍", "ターン"]],
      conditions: {
        "黒のGサインを持つ自軍Gが５枚以上ある場合": {
          actions: [
            {
              title: ["_黒のGサインを持つ_自軍_Gが_５枚以上ある場合", "黒", "自軍", "グラフィック", 5],
            }
          ]
        },
        "_自軍_ジャンクヤードにある、_黒のGサインを持つ全てのカードは": {
          title: ["_自軍_ジャンクヤードにある、_黒のGサインを持つ全てのカードは", "自軍", "ジャンクヤード", "黒"]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                const cardId = DefineFn.EffectFn.getCardID(effect)
                const ge1: GlobalEffect = {
                  title: ["場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる"],
                  cardIds: [cardId]
                }
                const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍ジャンクヤードにある、黒のGサインを持つ全てのカードは", cardId)
                const ge2: GlobalEffect = {
                  title: ["自軍手札にあるかのようにプレイできる"],
                  cardIds: pairs.map(pair => pair[0])
                }
                ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.setGlobalEffect(is, null, true, ge1)) as GameState
                ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.setGlobalEffect(is, null, true, ge2)) as GameState
                return ctx
              }.toString()
            }
          ]
        }
      ],
    },
  ],
};
