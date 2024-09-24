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
                ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.setGlobalEffect(is, null, ge1, { isRemoveOnTurnEnd: true })) as GameState
                ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.setFlag(is, "enabled", true, { isRemoveOnTurnEnd: true })) as GameState
                return ctx
              }.toString()
            }
          ]
        }
      ],
      onSituation: function _(ctx: GameState, effect: Effect, bridge: Bridge): GlobalEffect[] {
        const { DefineFn, GameStateFn } = bridge
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation != null) {
          return []
        }
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (GameStateFn.getItemState(ctx, cardId).flags["enabled"]) {
          const cardController = GameStateFn.getItemController(ctx, cardId);
          const targetIds = GameStateFn.getItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "ジャンクヤード"))
            .filter(cardId => GameStateFn.getItemPrototype(ctx, cardId).gsign?.[0].includes("黒"))
          return [
            {
              title: ["自軍手札にあるかのようにプレイできる"],
              cardIds: targetIds
            }
          ]
        }
        return []
      }.toString()
    },
  ],
};
