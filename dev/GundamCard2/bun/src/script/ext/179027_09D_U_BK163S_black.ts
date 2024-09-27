// 179027_09D_U_BK163S_black
// ジ・Ｏ［†］
// ジ・O系　MS　PMX　専用「パプテマス・シロッコ」
// 戦闘配備　強襲
// 『起動』：このカードが場に出た場合、敵軍手札１枚を無作為に廃棄する。
// 『起動』：場、または手札から、敵軍ジャンクヤードにユニットが移動した場合、セットカードがセットされていない、G以外の敵軍カード１枚を破壊する。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      title: ["自動型", "起動"],
      description: "『起動』：このカードが場に出た場合、敵軍手札１枚を無作為に廃棄する。",
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "場に出た場合" && evt.cardIds?.includes(cardId)) {

        } else {
          return ctx
        }
        const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
          conditions: {
            "敵軍手札１枚": {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip | null {
                const cardId = DefineFn.EffectFn.getCardID(effect)
                const tip = GameStateFn.createTipByEntitySearch(ctx, cardId, {
                  side: "敵軍",
                  baSyouKeywords: ["手札"],
                  count: 1,
                })
                return tip
              }.toString()
            },
          },
        })
        ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        return ctx
      }.toString(),
    },
    {
      id: "",
      description: "『起動』：場、または手札から、敵軍ジャンクヤードにユニットが移動した場合、セットカードがセットされていない、G以外の敵軍カード１枚を破壊する。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "GameEventOnMove" &&
          (DefineFn.BaSyouKeywordFn.isBa(DefineFn.AbsoluteBaSyouFn.getBaSyouKeyword(evt.title[1])) ||
            DefineFn.AbsoluteBaSyouFn.getBaSyouKeyword(evt.title[1]) == "手札") &&
          DefineFn.AbsoluteBaSyouFn.eq(evt.title[2], DefineFn.AbsoluteBaSyouFn.of(cardController, "ジャンクヤード"))
        ) {

        } else {
          return ctx
        }
        const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
          conditions: {
            "セットカードがセットされていない、G以外の敵軍カード": {
              title: ["Entity", {
                side: "敵軍",
                runtimeItemCategory: DefineFn.CardCategoryFn.createRemaining(["グラフィック"]),
                hasSetCard: false,
                count: 1,
              }]
            }
          },
          logicTreeAction:{
            actions:[
              {
                title:["_ロールする", "破壞"],
                vars: ["セットカードがセットされていない、G以外の敵軍カード"]
              }
            ]
          }
        })
        ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        return ctx
      }.toString()
    }
  ]
};
