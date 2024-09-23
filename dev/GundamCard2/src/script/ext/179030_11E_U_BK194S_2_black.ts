// 179030_11E_U_BK194S_2_black
// ゴトラタン［†］【コレクタブルレア】
// ゴトラタン系　MS　専用「カテジナ・ルース」
// 戦闘配備　強襲
// （自軍ターン）〔０〕：黒のGサインを持つ自軍Gが５枚以上ある場合、自軍ジャンクヤードにある、黒のGサインを持つ全てのカードは、このターン中、自軍手札にあるかのようにプレイできる。このターン中、場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { getGlobalEffects } from "../../game/gameState/globalEffects";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（自軍ターン）〔０〕：黒のGサインを持つ自軍Gが５枚以上ある場合、自軍ジャンクヤードにある、黒のGサインを持つ全てのカードは、このターン中、自軍手札にあるかのようにプレイできる。このターン中、場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる。",
      title: ["使用型", ["自軍", "ターン"]],
      conditions: {
        "黒のGサインを持つ自軍Gが５枚以上ある場合": {

        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                const cardId = DefineFn.EffectFn.getCardID(effect)
                const ge1: GlobalEffect = {
                  title: ["場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる"]
                }
                const ge2: GlobalEffect = {
                  title: ["自軍手札にあるかのようにプレイできる"]
                }

                // const addedEffects = GameStateFn.getPlayCardEffects(ctx, cardId).map(e => {
                //   const ge: GlobalEffect = {
                //     title: ["AddText", e.text],
                //     cardIds: [DefineFn.EffectFn.getCardID(e)]
                //   }
                //   return ge
                // })

                return ctx
              }.toString()
            }
          ]
        }
      ],
      // onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
      //   const cardId = DefineFn.EffectFn.getCardID(effect)
      //   const cardController = GameStateFn.getItemController(ctx, cardId)
      //   const evt = DefineFn.EffectFn.getEvent(effect)
      //   if (evt.title[0] == "GameEventOnMove" &&
      //     DefineFn.AbsoluteBaSyouFn.getPlayerID(evt.title[2]) == cardController &&
      //     DefineFn.AbsoluteBaSyouFn.getBaSyouKeyword(evt.title[2]) == "ジャンクヤード"
      //   ) {
          
      //   }
      //   return ctx
      // }.toString()
    },
  ],
};
